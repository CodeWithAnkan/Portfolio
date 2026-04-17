import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import useNodeStore from '../hooks/useNodeStore';

export default function GalaxyParticleSystem({ galaxy }) {
  const ref = useRef();
  const groupRef = useRef();
  const activeGalaxy = useNodeStore((s) => s.activeGalaxy);
  const setActiveGalaxy = useNodeStore((s) => s.setActiveGalaxy);
  const [hovered, setHovered] = useState(false);

  // Fade out macro particles if gazing into the system
  const isTarget = activeGalaxy === galaxy.id;
  const isOther = activeGalaxy && !isTarget;
  const targetOpacity = isOther ? 0 : isTarget ? 0.05 : (hovered ? 1 : 0.6);

  // Distinct math profiles based on Galaxy type
  const params = useMemo(() => {
    switch (galaxy.type) {
      case 'whirlpool': // The user's exact Pinwheel/Grand-Design reference
        return {
          count: 50000,
          radius: 35,
          coreRadius: 6,
          coreRatio: 0.25,
          branches: 3,           
          spin: 0.25,             // Graceful sweeping arms
          randomness: 0.35,       // Spread ratio
          randomnessPower: 1.5,   // Secret sauce: densely packs stars to the spine, letting the rest form gloom!
          thickness: 0.08,
          insideColor: '#fcd34d', // Sandy/golden core
          midColor: '#be185d',    // Pink dust
          outsideColor: '#2563eb', // Blue fringes
          tiltX: Math.PI * 0.25,
          tiltZ: -Math.PI * 0.1,
          size: 0.08
        };
      case 'andromeda':
        return {
          count: 70000,          
          radius: 45,            
          coreRadius: 8,
          coreRatio: 0.4,       
          branches: 2,           
          spin: 0.25,            
          randomness: 0.8,       // More diffuse for Andromeda's thick oval look
          randomnessPower: 1.8,  
          thickness: 0.15,       
          insideColor: '#ffedd5', 
          midColor: '#60a5fa',    
          outsideColor: '#00d4ff', 
          tiltX: Math.PI * 0.45,  
          tiltZ: 0,
          size: 0.1
        };
      case 'milkyway':
      default:
        return {
          count: 60000,
          radius: 40,
          coreRadius: 7,
          coreRatio: 0.3,       
          branches: 4,           // 4 major arms trailing off
          spin: 0.2,
          randomness: 0.45,       
          randomnessPower: 1.8,  
          thickness: 0.1,
          insideColor: '#ffedd5', // White-hot/golden center
          midColor: '#8b5cf6',    // Purplish mid-lane dust
          outsideColor: '#1d4ed8', // Deep blue galactic rim
          tiltX: -Math.PI * 0.08,
          tiltZ: Math.PI * 0.12,
          size: 0.08
        };
    }
  }, [galaxy.type]);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(params.count * 3);
    const col = new Float32Array(params.count * 3);
    
    const colorInside = new THREE.Color(params.insideColor);
    const colorOutside = new THREE.Color(params.outsideColor);
    const colorMid = params.midColor ? new THREE.Color(params.midColor) : null;

    for (let i = 0; i < params.count; i++) {
        let x, y, z;
        const isCore = Math.random() < params.coreRatio;
        
        if (isCore) {
            // Core distribution (dense spherical bulge)
            const r = Math.pow(Math.random(), 2.0) * params.coreRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            x = r * Math.sin(phi) * Math.cos(theta);
            z = r * Math.sin(phi) * Math.sin(theta);
            y = r * Math.cos(phi) * 0.5; // Squashed core
            
            if (galaxy.type === 'milkyway') {
                x *= 1.5; 
            } else if (galaxy.type === 'andromeda') {
                x *= 1.2;
            } else if (galaxy.type === 'whirlpool') {
                x *= 1.3;
            }
        } else {
            // Spiral Arms 
            // Distribute tightly near the core and gracefully stretching to the edge
            const r = params.coreRadius + Math.pow(Math.random(), 1.2) * (params.radius - params.coreRadius);
            
            const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
            const spinAngle = r * params.spin;
            const angle = branchAngle + spinAngle;
            
            // Randomness Power perfectly curves the dispersion.
            // 80% of stars stick to the "spine" of the arm. 20% scatter out, forming the "gloom" between arms!
            const spread = params.randomness * r;
            const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread;
            const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread * params.thickness;
            const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spread;
            
            x = Math.cos(angle) * r + randomX;
            z = Math.sin(angle) * r + randomZ;
            y = randomY;
        }

        pos[i * 3 + 0] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // True distance calculation for perfectly mapped color blending
        const trueDistance = Math.sqrt(x*x + y*y + z*z);
        const colorRatio = Math.min(1.0, trueDistance / params.radius);

        const mixedColor = new THREE.Color();
        if (colorMid) {
            // Multi-stop gradient: Inside -> Mid -> Outside
            if (colorRatio < 0.4) {
                mixedColor.copy(colorInside).lerp(colorMid, colorRatio / 0.4);
            } else {
                mixedColor.copy(colorMid).lerp(colorOutside, (colorRatio - 0.4) / 0.6);
            }
        } else {
            mixedColor.copy(colorInside).lerp(colorOutside, colorRatio);
        }
        
        col[i * 3 + 0] = mixedColor.r;
        col[i * 3 + 1] = mixedColor.g;
        col[i * 3 + 2] = mixedColor.b;
    }
    
    return [pos, col];
  }, [params, galaxy.type]);

  useFrame((state, delta) => {
    if (groupRef.current) {
        // Different rotation rates
        groupRef.current.rotation.y -= delta * (galaxy.type === 'andromeda' ? 0.04 : 0.06);
    }
    
    if (ref.current && ref.current.material) {
        ref.current.material.opacity = THREE.MathUtils.lerp(
            ref.current.material.opacity,
            targetOpacity,
            0.05
        );
    }
  });

  return (
    <group 
      position={galaxy.position} 
      onClick={(e) => {
        if (!activeGalaxy && !galaxy.isComingSoon) {
          e.stopPropagation();
          setActiveGalaxy(galaxy.id);
        } else if (!activeGalaxy && galaxy.isComingSoon) {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('TRIGGER_COMING_SOON'));
        }
      }}
      onPointerOver={(e) => {
        if (!activeGalaxy) {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={groupRef} rotation={[params.tiltX, 0, params.tiltZ]}>
          <points ref={ref} frustumCulled={false}>
              <bufferGeometry>
                  <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                  <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
              </bufferGeometry>
              <pointsMaterial
                  transparent
                  vertexColors
                  size={params.size}
                  sizeAttenuation
                  depthWrite={false}
                  opacity={0} 
                  blending={THREE.AdditiveBlending}
              />
          </points>
      </group>
      
      {(!activeGalaxy) && (
        <mesh position={[0, 15, 0]}>
            <pointLight intensity={2} color={params.insideColor} distance={40} />
            <Html center position={[0, 25, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                           initial={{ opacity: 0, y: 15, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                           transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                           style={{
                               background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                               backdropFilter: 'blur(24px)',
                               WebkitBackdropFilter: 'blur(24px)',
                               border: '1px solid rgba(255,255,255,0.1)',
                               boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
                               padding: '16px 28px',
                               borderRadius: '16px',
                               textAlign: 'center',
                               minWidth: 'max-content',
                               display: 'flex',
                               flexDirection: 'column',
                               gap: '6px'
                           }}
                        >
                            <h4 style={{ margin: 0, color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, letterSpacing: '0.5px' }}>
                                {galaxy.title}
                            </h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontFamily: 'Fira Code, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {galaxy.subtitle}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Html>
        </mesh>
      )}
    </group>
  );
}
