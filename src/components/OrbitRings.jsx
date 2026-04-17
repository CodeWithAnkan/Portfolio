import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function OrbitRings({ radii }) {
  const groupRef = useRef();

  const rings = useMemo(() => {
    return radii.map((radius) => {
      const segments = 128;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return { geometry, radius, key: `orbit-${radius}` };
    });
  }, [radii]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((line, i) => {
        if (line.material) {
          line.material.opacity = 0.06 + Math.sin(clock.elapsedTime * 0.3 + i * 1.2) * 0.02;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map(({ geometry, key }) => (
        <line key={key} geometry={geometry}>
          <lineBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}
