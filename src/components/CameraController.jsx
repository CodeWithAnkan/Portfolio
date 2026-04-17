import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useNodeStore from '../hooks/useNodeStore';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES, GALAXY_REFS } from '../data/nodes';
import { CAMERA_DEFAULTS, CAMERA_FOCUS_OFFSET, CAMERA_LERP_SPEED, AUTO_ROTATE_SPEED } from '../utils/constants';
import usePerformance from '../hooks/usePerformance';

const targetPos = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const currentLookAt = new THREE.Vector3(0, 0, 0);

const ALL_NODES = [...SCHOOL_NODES, ...COLLEGE_NODES];

export default function CameraController() {
  const controlsRef = useRef();
  const activeGalaxy = useNodeStore((s) => s.activeGalaxy);
  const activeNode = useNodeStore((s) => s.activeNode);
  const clearActiveNode = useNodeStore((s) => s.clearActiveNode);
  const clearActiveGalaxy = useNodeStore((s) => s.clearActiveGalaxy);
  
  const { camera } = useThree();
  const isAnimating = useRef(true);
  const followingNode = useRef(null);
  
  const userInteracting = useRef(false);
  const isMobile = usePerformance((s) => s.isMobile);

  // Track continuous target coordinates
  const universeCamPos = new THREE.Vector3(0, 80, 260);
  const universeLookAt = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeNode) {
          clearActiveNode();
        } else if (activeGalaxy) {
          clearActiveGalaxy();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNode, activeGalaxy, clearActiveNode, clearActiveGalaxy]);

  useEffect(() => {
    isAnimating.current = true;
    userInteracting.current = false;
    
    if (activeNode) {
      followingNode.current = activeNode;
    } else {
      followingNode.current = null;
      
      if (activeGalaxy) {
        // Look at specific galaxy using realtime world-matrix position calculation
        const galRef = GALAXY_REFS[activeGalaxy];
        if (galRef) {
           const worldPos = new THREE.Vector3();
           galRef.getWorldPosition(worldPos);
           
           targetPos.set(worldPos.x + CAMERA_DEFAULTS.position[0], worldPos.y + CAMERA_DEFAULTS.position[1], worldPos.z + CAMERA_DEFAULTS.position[2]);
           targetLookAt.copy(worldPos);
        }
      } else {
        // Universe Overview
        targetPos.copy(universeCamPos);
        targetLookAt.copy(universeLookAt);
      }
    }
  }, [activeNode, activeGalaxy]);

  useFrame(() => {
    // 1. If following an orbiting node, update target lookAt
    if (followingNode.current) {
      const nodeData = ALL_NODES.find((n) => n.id === followingNode.current.id);
      if (nodeData && nodeData._worldPos) {
        targetLookAt.set(nodeData._worldPos[0], nodeData._worldPos[1], nodeData._worldPos[2]);
      }
    }

    // 2. Smoothly move OrbitControls target
    if (controlsRef.current) {
       controlsRef.current.target.lerp(targetLookAt, CAMERA_LERP_SPEED * 1.5);
       controlsRef.current.update();
    }

    // 3. Smoothly move camera position ONLY if we are transitioning galaxies and user isn't overriding
    if (isAnimating.current && !userInteracting.current && !followingNode.current) {
      const distTarget = camera.position.distanceTo(targetPos);
      const speed = distTarget > 50 ? 0.04 : CAMERA_LERP_SPEED;
      
      camera.position.lerp(targetPos, speed);
      
      if (distTarget < 0.5) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={!activeNode}
      autoRotate={!activeNode && activeGalaxy !== null}
      autoRotateSpeed={AUTO_ROTATE_SPEED}
      maxDistance={activeGalaxy ? 130 : 550}
      minDistance={activeGalaxy ? (isMobile ? 10 : 6) : (isMobile ? 40 : 25)}
      maxPolarAngle={Math.PI * 0.5}
      minPolarAngle={0}
      dampingFactor={isMobile ? 0.08 : 0.05}
      enableDamping
      makeDefault
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      onStart={() => { userInteracting.current = true; isAnimating.current = false; }}
      onEnd={() => { userInteracting.current = false; }}
    />
  );
}
