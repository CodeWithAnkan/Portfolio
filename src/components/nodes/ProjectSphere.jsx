import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useNodeStore from '../../hooks/useNodeStore';
import NodeLabel from '../NodeLabel';

export default function ProjectSphere({ node, galaxyId }) {
  const orbitRef = useRef();
  const outerRef = useRef();
  const coreRef = useRef();
  const wireRef = useRef();
  const [hovered, setHovered] = useState(false);
  const setActiveNode = useNodeStore((s) => s.setActiveNode);
  const activeNode = useNodeStore((s) => s.activeNode);
  const isActive = activeNode?.id === node.id;

  const worldPos = useRef(new THREE.Vector3());

  const outerMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: node.accentColor,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        thickness: 1.5,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.35,
      }),
    [node.accentColor]
  );

  const coreMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: node.accentColor,
        emissive: node.accentColor,
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [node.accentColor]
  );

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: node.accentColor,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      }),
    [node.accentColor]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const angle = t * node.orbitSpeed + node.orbitOffset;

    if (orbitRef.current) {
      orbitRef.current.position.x = Math.cos(angle) * node.orbitRadius;
      orbitRef.current.position.z = Math.sin(angle) * node.orbitRadius;
      orbitRef.current.position.y = node.yOffset + Math.sin(t * 0.45 + node.orbitOffset) * 0.1;

      orbitRef.current.getWorldPosition(worldPos.current);
      node._worldPos = [worldPos.current.x, worldPos.current.y, worldPos.current.z];
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.12 + node.orbitOffset;
      outerRef.current.rotation.x = Math.sin(t * 0.15 + node.orbitOffset) * 0.1;
      outerMat.opacity = hovered || isActive ? 0.5 : 0.35;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.3;
      coreMat.emissiveIntensity = hovered || isActive
        ? 1.2
        : 0.6 + Math.sin(t * 1.2 + node.orbitOffset) * 0.3;
      const scale = hovered || isActive ? 0.55 : 0.45 + Math.sin(t * 0.8 + node.orbitOffset) * 0.03;
      coreRef.current.scale.setScalar(scale);
    }

    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.08;
      wireRef.current.rotation.z = t * 0.05;
      wireMat.opacity = 0.06 + Math.sin(t * 0.5 + node.orbitOffset) * 0.03;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Outer glass sphere */}
      <mesh
        ref={outerRef}
        material={outerMat}
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

      {/* Inner emissive core */}
      <mesh ref={coreRef} material={coreMat}>
        <icosahedronGeometry args={[1, 1]} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef} material={wireMat}>
        <sphereGeometry args={[node.size * 1.15, 24, 24]} />
      </mesh>

      {/* Node glow */}
      <pointLight
        color={node.accentColor}
        intensity={hovered || isActive ? 2.5 : 0.8}
        distance={5}
        decay={2}
      />

      <NodeLabel node={node} position={[0, 0, 0]} hovered={hovered} isActive={isActive} offsetY={node.size + 0.5} />
    </group>
  );
}
