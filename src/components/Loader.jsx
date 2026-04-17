import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
  width: '100vw',
  height: '100vh',
  background: '#030014',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 200,
  pointerEvents: 'none',
};

const titleStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '28px',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '2px',
};

const barContainer = {
  width: '200px',
  height: '2px',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: '1px',
  overflow: 'hidden',
};

const percentStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  color: '#64748b',
  letterSpacing: '1px',
};

function LoaderScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a quick load sequence since we have no heavy assets
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setProgress(Math.min(100, frame * 8));
      if (frame >= 13) {
        clearInterval(interval);
        setTimeout(() => setVisible(false), 400);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={containerStyle}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div style={titleStyle}>ANKAN</div>
          <div style={barContainer}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                borderRadius: '1px',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div style={percentStyle}>{Math.round(progress)}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Fallback used inside <Suspense> within the Canvas */
export function CanvasLoader() {
  return (
    <Html center>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px',
        color: '#64748b',
      }}>
        Loading scene...
      </div>
    </Html>
  );
}

export default LoaderScreen;
