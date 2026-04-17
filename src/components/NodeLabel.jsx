import React from 'react';
import { Html } from '@react-three/drei';

const labelStyle = {
  pointerEvents: 'none',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap',
};

const titleStyle = {
  fontFamily: "'Outfit', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: '#e2e8f0',
  textShadow: '0 0 12px rgba(124, 58, 237, 0.5)',
  letterSpacing: '0.5px',
};

const tagsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  justifyContent: 'center',
  maxWidth: '280px',
};

const tagBaseStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '8px',
  fontWeight: 500,
  padding: '2px 6px',
  borderRadius: '3px',
  background: 'rgba(124, 58, 237, 0.15)',
  border: '1px solid rgba(124, 58, 237, 0.2)',
  color: '#a78bfa',
  letterSpacing: '0.8px',
};

const metricsStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '9px',
  fontWeight: 700,
  color: '#10b981',
  textShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
  letterSpacing: '0.5px',
};

export default function NodeLabel({ node, hovered, isActive, offsetY = 1.5 }) {
  const showFull = hovered || isActive;

  return (
    <Html
      position={[0, offsetY, 0]}
      center
      distanceFactor={10}
      style={{
        transition: 'opacity 0.3s ease',
        opacity: 1,
      }}
    >
      <div style={labelStyle}>
        <div style={titleStyle}>{node.title}</div>

        {showFull && (
          <>
            <div style={tagsContainerStyle}>
              {node.techTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...tagBaseStyle,
                    borderColor: `${node.accentColor}33`,
                    background: `${node.accentColor}20`,
                    color: node.accentColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {node.metrics && node.metrics.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {node.metrics.slice(0, 2).map((m) => (
                  <span key={m} style={{ ...metricsStyle, color: node.accentColor }}>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Html>
  );
}
