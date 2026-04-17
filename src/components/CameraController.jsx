import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useNodeStore from '../hooks/useNodeStore';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES } from '../data/nodes';
import { CAMERA_DEFAULTS, CAMERA_FOCUS_OFFSET, CAMERA_LERP_SPEED, AUTO_ROTATE_SPEED } from '../utils/constants';

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
        // Look at specific galaxy
        const gal = GALAXIES.find((g) => g.id === activeGalaxy);
        if (gal) {
           targetPos.set(gal.position[0] + CAMERA_DEFAULTS.position[0], gal.position[1] + CAMERA_DEFAULTS.position[1], gal.position[2] + CAMERA_DEFAULTS.position[2]);
           targetLookAt.set(...gal.position);
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
      minDistance={activeGalaxy ? 6 : 100}
      maxPolarAngle={Math.PI * 0.5} // Allow going down to equator but not below negative-Y
      minPolarAngle={0}             // Allow looking straight down
      dampingFactor={0.05}
      enableDamping
      makeDefault
      onStart={() => { userInteracting.current = true; isAnimating.current = false; }}
      onEnd={() => { userInteracting.current = false; }}
    />
  );
}
