import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useNodeStore from '../../hooks/useNodeStore';
import NodeLabel from '../NodeLabel';

// Custom sun surface shader for turbulent, fiery look
const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 pos = vPosition * 1.8;

    // Layered turbulence
    float n1 = snoise(pos + uTime * 0.15) * 0.5;
    float n2 = snoise(pos * 2.0 - uTime * 0.25) * 0.3;
    float n3 = snoise(pos * 4.0 + uTime * 0.1) * 0.15;
    float noise = n1 + n2 + n3;

    // Sun color palette — from deep orange core to bright yellow surface
    vec3 deepOrange = vec3(0.85, 0.25, 0.0);
    vec3 brightOrange = vec3(1.0, 0.55, 0.0);
    vec3 yellow = vec3(1.0, 0.85, 0.2);
    vec3 white = vec3(1.0, 0.95, 0.75);

    float t = noise * 0.5 + 0.5;
    vec3 color;
    if (t < 0.3) {
      color = mix(deepOrange, brightOrange, t / 0.3);
    } else if (t < 0.6) {
      color = mix(brightOrange, yellow, (t - 0.3) / 0.3);
    } else {
      color = mix(yellow, white, (t - 0.6) / 0.4);
    }

    // Limb darkening
    float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    color *= 0.7 + 0.3 * (1.0 - fresnel * 0.5);

    // Sunspots
    float spot = snoise(pos * 3.5 + uTime * 0.05);
    if (spot < -0.4) {
      color *= 0.4;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function SunNode({ node, galaxyId }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const [hovered, setHovered] = useState(false);
  const setActiveNode = useNodeStore((s) => s.setActiveNode);
  const activeNode = useNodeStore((s) => s.activeNode);
  const isActive = activeNode?.id === node.id;

  const uniforms = useRef({ uTime: { value: 0 } });

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sunVertexShader,
        fragmentShader: sunFragmentShader,
        uniforms: uniforms.current,
      }),
    []
  );

  // Glow layers
  const glowLayers = useMemo(() => [
    { scale: 2.5, opacity: 0.06, color: '#ff8c00' },
    { scale: 3.2, opacity: 0.04, color: '#ffa500' },
    { scale: 4.0, opacity: 0.025, color: '#ffcc44' },
    { scale: 5.0, opacity: 0.015, color: '#ffe066' },
  ], []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    uniforms.current.uTime.value = t;

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Core sphere with shader */}
      <mesh
        ref={coreRef}
        material={shaderMat}
        onClick={(e) => {
          e.stopPropagation();
          setActiveNode(node.id, galaxyId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[node.size, 64, 64]} />
      </mesh>

      {/* Multiple glow layers for realistic aura */}
      {glowLayers.map((layer, i) => (
        <mesh key={i} scale={layer.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={layer.color}
            transparent
            opacity={layer.opacity}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Strong point lights */}
      <pointLight
        color="#ffa500"
        intensity={hovered || isActive ? 10 : 6}
        distance={40}
        decay={1.2}
      />
      <pointLight
        color="#ff6600"
        intensity={2}
        distance={60}
        decay={2}
      />

      <NodeLabel node={node} hovered={hovered} isActive={isActive} offsetY={node.size + 1.0} />
    </group>
  );
}
