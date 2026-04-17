import React from 'react';
import Scene from './components/Scene';
import HUD from './components/HUD';
import NodeDetail from './components/NodeDetail';
import LoaderScreen from './components/Loader';
import useHashNavigation from './hooks/useHashNavigation';

export default function App() {
  useHashNavigation();

  return (
    <>
      <LoaderScreen />
      <Scene />
      <HUD />
      <NodeDetail />
    </>
  );
}
