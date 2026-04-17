import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import useNodeStore from '../../hooks/useNodeStore';
import NodeLabel from '../NodeLabel';

export default function CometNode({ node, galaxyId }) {
  const orbitRef = useRef();
  const headRef = useRef();
  const [hovered, setHovered] = useState(false);
  const setActiveNode = useNodeStore((s) => s.setActiveNode);
  const activeNode = useNodeStore((s) => s.activeNode);
  const isActive = activeNode?.id === node.id;

  const worldPos = useRef(new THREE.Vector3());
  const { a, b, tilt } = node.ellipse;

  // Multicolor gradient for the comet head
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f472b6',
        emissive: '#ec4899',
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.3,
      }),
    []
  );

  const innerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fbbf24',
        emissive: '#f59e0b',
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.1,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const angle = t * node.orbitSpeed + node.orbitOffset;

    if (orbitRef.current) {
      // Elliptical orbit with tilt
      const x = Math.cos(angle) * a;
      const z = Math.sin(angle) * b;
      // Apply tilt rotation
      orbitRef.current.position.x = x * Math.cos(tilt) - z * Math.sin(tilt);
      orbitRef.current.position.z = x * Math.sin(tilt) + z * Math.cos(tilt);
      orbitRef.current.position.y = Math.sin(angle * 2) * 0.5;

      orbitRef.current.getWorldPosition(worldPos.current);
      node._worldPos = [worldPos.current.x, worldPos.current.y, worldPos.current.z];
    }

    if (headRef.current) {
      headRef.current.rotation.y = t * 2;
      headRef.current.rotation.x = t * 0.8;
      headMat.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.5;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Trail effect */}
      <Trail
        width={2.5}
        length={8}
        color={new THREE.Color('#f472b6')}
        attenuation={(t) => t * t}
        stride={0}
        interval={1}
        target={headRef}
      >
        {/* Comet head — outer glow */}
        <mesh
          ref={headRef}
          material={headMat}
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
          <dodecahedronGeometry args={[node.size, 1]} />
        </mesh>
      </Trail>

      {/* Inner bright core */}
      <mesh material={innerMat}>
        <sphereGeometry args={[node.size * 0.45, 16, 16]} />
      </mesh>

      {/* Colorful glow */}
      <mesh scale={1.8}>
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={2.8}>
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color="#f472b6"
        intensity={hovered || isActive ? 4 : 1.5}
        distance={6}
        decay={2}
      />

      <NodeLabel node={node} hovered={hovered} isActive={isActive} offsetY={node.size + 0.7} />
    </group>
  );
}
