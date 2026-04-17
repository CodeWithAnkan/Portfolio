import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import useNodeStore from '../hooks/useNodeStore';

export default function ResumeComet() {
    const resumeAnimState = useNodeStore((s) => s.resumeAnimState);
    const setResumeAnimState = useNodeStore((s) => s.setResumeAnimState);
    
    const cometRef = useRef();
    const { camera } = useThree();
    
    // Track progression through state independently
    const progress = useRef(0);
    const trailRef = useRef();

    useFrame((state, delta) => {
        if (!cometRef.current) return;

        if (resumeAnimState === 'idle') {
            cometRef.current.visible = false;
            progress.current = 0;
            return;
        }

        cometRef.current.visible = true;

        const camVec = new THREE.Vector3();
        camera.getWorldDirection(camVec);
        
        // Dynamic pathing relative to exactly where the user is looking
        const relativeStart = camera.position.clone()
            .add(camVec.clone().multiplyScalar(400))
            .add(new THREE.Vector3(150, 100, 0)); // Top right from focal point
            
        const actualTarget = camera.position.clone()
            .add(camVec.clone().multiplyScalar(20)); // Rests dramatically right in front of camera

        if (resumeAnimState === 'flyingIn') {
            // Easing math to slow down towards the center (Cubic Ease Out)
            progress.current += delta * 1.2; 
            const t = Math.min(1.0, progress.current);
            const easeOutCubic = 1 - Math.pow(1 - t, 3);
            
            cometRef.current.position.lerpVectors(relativeStart, actualTarget, easeOutCubic);
            
            // Spin for blazing effect
            cometRef.current.rotation.y -= delta * 8;
            cometRef.current.rotation.x -= delta * 4;

            if (t >= 1.0) {
                setResumeAnimState('reading');
                progress.current = 0;
            }
        } 
        else if (resumeAnimState === 'reading') {
            // Float gently in the center screen while reading
            const floatTarget = actualTarget.clone();
            floatTarget.y += Math.sin(state.clock.elapsedTime * 3) * 0.5; // gentle bob
            
            cometRef.current.position.lerp(floatTarget, 0.1);
            cometRef.current.rotation.y -= delta * 2;
        }
        else if (resumeAnimState === 'flyingOut') {
            // Accelerate rapidly continuing in the same direction (Cubic Ease In)
            progress.current += delta * 1.5; 
            const t = Math.min(1.0, progress.current);
            const easeInCubic = t * t * t;

            // Calculate exact vector line it arrived on, and continue it past the camera
            const flightDirection = actualTarget.clone().sub(relativeStart).normalize();
            // It flies PAST the camera in the exact same trajectory
            const relativeExit = actualTarget.clone().add(flightDirection.multiplyScalar(300)); 

            cometRef.current.position.lerpVectors(actualTarget, relativeExit, easeInCubic);

            if (t >= 1.0) {
                setResumeAnimState('idle');
                progress.current = 0;
                if (trailRef.current) trailRef.current.clear(); // Reset the trail completely
            }
        }
    });

    return (
        <group>
            {/* Outer soft heat trail */}
            <Trail
                width={18}
                length={25}
                color={new THREE.Color('#ea580c')}
                attenuation={(t) => t * t * t} // Very soft fading tail
                target={cometRef}
            />
            {/* Inner hot plasma trail */}
            <Trail
                ref={trailRef}
                width={6}               
                length={15}             // Short trailing length so it doesn't span the screen
                color={new THREE.Color('#fde047')} // Bright yellow/white
                attenuation={(t) => t * t} // Tapers sharply
                target={cometRef}
            >
                <mesh ref={cometRef} visible={false}>
                    {/* Core */}
                    <mesh>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    
                    {/* Hot Core Aura */}
                    <mesh scale={2.5}>
                        <sphereGeometry args={[0.8, 16, 16]} />
                        <meshBasicMaterial color="#fef08a" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
                    </mesh>
                    
                    {/* Outer Fire Aura */}
                    <mesh scale={5.0}>
                        <sphereGeometry args={[0.8, 16, 16]} />
                        <meshBasicMaterial color="#ea580c" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
                    </mesh>

                    {/* Intense point light illuminating nearby space */}
                    <pointLight intensity={30} color="#f97316" distance={200} decay={2} />
                </mesh>
            </Trail>
        </group>
    );
}
