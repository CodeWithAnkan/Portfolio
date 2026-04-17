import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AsteroidBelt({ count = 1200, radiusMin = 13, radiusMax = 22 }) {
  const meshRef = useRef();

  // Create random positions, rotations, and scales for each asteroid
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        // Random angle and distance within the belt
        const angle = Math.random() * Math.PI * 2;
        // Distribute density more towards the middle of the belt
        const r = radiusMin + Math.random() * (radiusMax - radiusMin) * (0.5 + Math.random() * 0.5);
        
        // Add some random scatter in the y-axis (thickness of belt)
        const y = (Math.random() - 0.5) * 1.5;
        
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        
        // Random orbit speed offset based on distance
        const speed = 0.02 + Math.random() * 0.02 + (20 / r) * 0.01;

        temp.push({
            position: new THREE.Vector3(x, y, z),
            rotation: new THREE.Vector3(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ),
            scale: 0.02 + Math.random() * 0.08 + (Math.random() < 0.05 ? 0.1 : 0),
            speed,
            angle,
            radius: r,
            yOffset: y
        });
    }
    return temp;
  }, [count, radiusMin, radiusMax]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
        // Update position in orbit
        const currentAngle = particle.angle + time * particle.speed;
        particle.position.x = Math.cos(currentAngle) * particle.radius;
        particle.position.z = Math.sin(currentAngle) * particle.radius;
        
        // Add slight bobbing
        particle.position.y = particle.yOffset + Math.sin(time * 0.5 + i) * 0.2;

        dummy.position.copy(particle.position);
        
        // Slowly rotate the asteroid itself
        dummy.rotation.x = particle.rotation.x + time * 0.2;
        dummy.rotation.y = particle.rotation.y + time * 0.3;
        dummy.rotation.z = particle.rotation.z;
        
        dummy.scale.set(particle.scale, particle.scale, particle.scale);
        dummy.updateMatrix();
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#2a2a35"
        roughness={0.9}
        metalness={0.1}
      />
    </instancedMesh>
  );
}
