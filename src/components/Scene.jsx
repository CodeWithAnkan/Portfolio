import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CAMERA_DEFAULTS } from '../utils/constants';
import StarField from './StarField';
import OrbitRings from './OrbitRings';
import CameraController from './CameraController';
import SunNode from './nodes/SunNode';
import CometNode from './nodes/CometNode';
import ProjectSphere from './nodes/ProjectSphere';
import AsteroidBelt from './AsteroidBelt';
import GalaxyParticleSystem from './GalaxyParticleSystem';
import { CanvasLoader } from './Loader';
import ResumeComet from './ResumeComet';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES, ORBIT_RADII_SCHOOL, ORBIT_RADII_COLLEGE } from '../data/nodes';
import useNodeStore from '../hooks/useNodeStore';

function renderNode(node, galaxyId) {
  switch (node.type) {
    case 'sun':
      return <SunNode key={node.id} node={node} galaxyId={galaxyId} />;
    case 'comet':
      return <CometNode key={node.id} node={node} galaxyId={galaxyId} />;
    case 'sphere':
      return <ProjectSphere key={node.id} node={node} galaxyId={galaxyId} />;
    default:
      return null;
  }
}

function SolarSystemInner({ activeGalaxy, selfId, nodes, orbitRadii }) {
  // We only render the heavy solar system nodes if we are actually viewing this galaxy
  // to save performance. But since we want a smooth transition, we always render the Sun
  const isViewed = activeGalaxy === selfId;

  return (
    <>
      {nodes.map((node) => {
        if (!isViewed && node.type !== 'sun') return null;
        return renderNode(node, selfId);
      })}
      
      {isViewed && (
        <>
          <OrbitRings radii={orbitRadii} />
          <AsteroidBelt count={selfId === 'college' ? 120 : 60} radiusMin={selfId === 'college' ? 26 : 19} radiusMax={selfId === 'college' ? 36 : 24} />
        </>
      )}
    </>
  );
}

export default function Scene() {
  const activeGalaxy = useNodeStore((s) => s.activeGalaxy);

  return (
    <Canvas
      camera={{
        position: [0, 150, 300], // Start at universe overview
        fov: CAMERA_DEFAULTS.fov,
        near: CAMERA_DEFAULTS.near,
        far: 1000, // Extend far plane to see faraway galaxies
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#030014',
      }}
    >
      <ambientLight intensity={0.04} color="#c4d4ff" />
      <directionalLight position={[10, 15, 5]} intensity={0.15} color="#e8e0ff" />

      <Suspense fallback={<CanvasLoader />}>
        <StarField />

        {/* Render Galaxies */}
        {GALAXIES.map((galaxy) => (
          <group key={galaxy.id}>
            <GalaxyParticleSystem galaxy={galaxy} />
            
            {/* Render the inner solar systems perfectly aligned inside their parent galaxy's coordinate space */}
            <group position={galaxy.position}>
                {galaxy.id === 'school' && (
                    <SolarSystemInner activeGalaxy={activeGalaxy} selfId="school" nodes={SCHOOL_NODES} orbitRadii={ORBIT_RADII_SCHOOL} />
                )}
                {galaxy.id === 'college' && (
                    <SolarSystemInner activeGalaxy={activeGalaxy} selfId="college" nodes={COLLEGE_NODES} orbitRadii={ORBIT_RADII_COLLEGE} />
                )}
            </group>
          </group>
        ))}

        <CameraController />
        <ResumeComet />
        <fog attach="fog" args={['#030014', 80, 500]} />
      </Suspense>
    </Canvas>
  );
}
