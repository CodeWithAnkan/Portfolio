import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes } from '../theme';
import useNodeStore from '../hooks/useNodeStore';

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const Overlay = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(3, 0, 20, 0.6)',
  backdropFilter: 'blur(8px)',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$7',

  '@md': {
    padding: '$4',
  },
});

const Card = styled('div', {
  background: '$glass',
  border: '1px solid $glassBorder',
  borderRadius: '$lg',
  padding: '$8',
  maxWidth: '680px',
  width: '100%',
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: '$card',
  position: 'relative',

  '@md': {
    padding: '$6',
    maxHeight: '90vh',
  },
});

const CloseBtn = styled('button', {
  position: 'absolute',
  top: '$4',
  right: '$4',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '$sm',
  color: '$textMuted',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '18px',
  transition: 'all 0.2s ease',

  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    color: '$text',
    borderColor: '$accent',
  },
});

const Title = styled('h2', {
  fontFamily: '$heading',
  fontWeight: 700,
  fontSize: '$xxl',
  color: '$text',
  marginBottom: '$2',
  lineHeight: 1.1,

  '@md': {
    fontSize: '$xl',
  },
});

const Subtitle = styled('p', {
  fontFamily: '$heading',
  fontWeight: 400,
  fontSize: '$lg',
  marginBottom: '$6',
  letterSpacing: '0.5px',
});

const SectionTitle = styled('h3', {
  fontFamily: '$heading',
  fontWeight: 600,
  fontSize: '$md',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '$3',
  marginTop: '$6',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  '&::before': {
    content: '',
    display: 'block',
    width: '12px',
    height: '2px',
    borderRadius: '1px',
  },
});

const StoryText = styled('p', {
  fontFamily: '$body',
  fontSize: '$md',
  color: '$textMuted',
  lineHeight: 1.7,
  marginBottom: '$2',
});

const TagsRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
  marginBottom: '$5',
});

const Tag = styled('span', {
  fontFamily: '$mono',
  fontSize: '$xs',
  fontWeight: 500,
  padding: '$1 $3',
  borderRadius: '$full',
  letterSpacing: '0.8px',
  border: '1px solid',
});

const MetricPill = styled('span', {
  fontFamily: '$mono',
  fontSize: '$xs',
  fontWeight: 700,
  padding: '$2 $4',
  borderRadius: '$sm',
  letterSpacing: '0.5px',
  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
  backgroundSize: '200% 100%',
  animation: `${shimmer} 3s ease-in-out infinite`,
});

const MetricsRow = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$3',
  marginTop: '$5',
  paddingTop: '$5',
  borderTop: '1px solid rgba(255,255,255,0.05)',
});

const Divider = styled('div', {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)',
  margin: '$5 0',
});

export default function NodeDetail() {
  const activeNode = useNodeStore((s) => s.activeNode);
  const detailOpen = useNodeStore((s) => s.detailOpen);
  const clearActiveNode = useNodeStore((s) => s.clearActiveNode);

  return (
    <AnimatePresence>
      {detailOpen && activeNode && (
        <motion.div
          key="detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={clearActiveNode}
        >
          <Overlay>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CloseBtn onClick={clearActiveNode} aria-label="Close detail panel">
                  ✕
                </CloseBtn>

                <Title>{activeNode.title}</Title>
                <Subtitle style={{ color: activeNode.accentColor }}>
                  {activeNode.subtitle}
                </Subtitle>

                <TagsRow>
                  {activeNode.techTags.map((tag) => (
                    <Tag
                      key={tag}
                      css={{
                        color: activeNode.accentColor,
                        borderColor: `${activeNode.accentColor}33`,
                        background: `${activeNode.accentColor}12`,
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </TagsRow>

                <Divider />

                <SectionTitle css={{ '&::before': { background: '#f59e0b' } }}>
                  Challenge
                </SectionTitle>
                <StoryText>{activeNode.story.challenge}</StoryText>

                <SectionTitle css={{ '&::before': { background: '#00d4ff' } }}>
                  Solution
                </SectionTitle>
                <StoryText>{activeNode.story.solution}</StoryText>

                <SectionTitle css={{ '&::before': { background: '#10b981' } }}>
                  Impact
                </SectionTitle>
                <StoryText>{activeNode.story.impact}</StoryText>

                {activeNode.metrics && activeNode.metrics.length > 0 && (
                  <MetricsRow>
                    {activeNode.metrics.map((m) => (
                      <MetricPill
                        key={m}
                        css={{
                          color: activeNode.accentColor,
                          border: `1px solid ${activeNode.accentColor}33`,
                        }}
                      >
                        ⚡ {m}
                      </MetricPill>
                    ))}
                  </MetricsRow>
                )}
              </Card>
            </motion.div>
          </Overlay>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
