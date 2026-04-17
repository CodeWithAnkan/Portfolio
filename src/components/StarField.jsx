import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { STAR_COUNT } from '../utils/constants';

export default function StarField() {
  const ref = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 40 + Math.random() * 800; // Stretch radius massive
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Varied sizes — most small, some big
      sz[i] = Math.random() < 0.08 ? 0.5 + Math.random() * 0.6 : 0.1 + Math.random() * 0.2;
    }

    return [pos, sz];
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.006;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <group>
      {/* Main bright stars */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.4}
          sizeAttenuation
          depthWrite={false}
          opacity={1}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Warm accent stars layer */}
      <BrightStars count={400} color="#ffd6a5" minSize={0.4} maxSize={1.0} radiusMin={40} radiusMax={900} glitter={false} />
      <BrightStars count={400} color="#ffeaa7" minSize={0.5} maxSize={1.3} radiusMin={40} radiusMax={900} glitter={true} />

      {/* Blue accent stars layer */}
      <BrightStars count={300} color="#93c5fd" minSize={0.35} maxSize={0.9} radiusMin={40} radiusMax={900} glitter={false} />
      <BrightStars count={300} color="#a29bfe" minSize={0.4} maxSize={1.1} radiusMin={40} radiusMax={900} glitter={true} />
    </group>
  );
}

function BrightStars({ count, color, minSize, maxSize, radiusMin, radiusMax, glitter }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radiusMin + Math.random() * (radiusMax - radiusMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radiusMin, radiusMax]);

  useFrame(({ clock }) => {
    if (ref.current && ref.current.material) {
      if (glitter) {
        // High-intensity rapid twinkling for glittering stars
         ref.current.material.opacity = 0.2 + Math.abs(Math.sin(clock.elapsedTime * 1.5 + count)) * 0.8;
      } else {
        // Slow subtle fade for normal bright stars
        ref.current.material.opacity = 0.8 + Math.sin(clock.elapsedTime * 0.4) * 0.2;
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={(minSize + maxSize) / 2}
        sizeAttenuation
        depthWrite={false}
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}
