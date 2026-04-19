import React from 'react';
import Scene from './components/Scene';
import HUD from './components/HUD';
import NodeDetail from './components/NodeDetail';
import LoaderScreen from './components/Loader';
import useHashNavigation from './hooks/useHashNavigation';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"

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
