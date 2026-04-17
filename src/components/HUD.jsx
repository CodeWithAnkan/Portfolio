import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes } from '../theme';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES, SOCIAL_LINKS } from '../data/nodes';
import useNodeStore from '../hooks/useNodeStore';

const pulseGlow = keyframes({
  '0%, 100%': { boxShadow: '0 0 15px rgba(124, 58, 237, 0.08)' },
  '50%': { boxShadow: '0 0 25px rgba(124, 58, 237, 0.2)' },
});

const Wrapper = styled('div', {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 50,
  display: 'flex',
  flexDirection: 'row',
});

const Sidebar = styled('aside', {
  width: '250px',
  height: '100%',
  background: 'rgba(5, 2, 22, 0.88)',
  backdropFilter: 'blur(24px)',
  borderRight: '1px solid rgba(124, 58, 237, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  padding: '$6 $5',
  overflowY: 'auto',
  animation: `${pulseGlow} 4s ease-in-out infinite`,
});

const ToggleBtn = styled('button', {
  position: 'absolute',
  top: '$4',
  background: 'rgba(5, 2, 22, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(124, 58, 237, 0.15)',
  borderRadius: '0 $sm $sm 0',
  color: '$textMuted',
  width: '32px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  zIndex: 51,

  '&:hover': {
    background: 'rgba(124, 58, 237, 0.12)',
    color: '$text',
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
});

const Logo = styled('div', {
  marginBottom: '$6',
  paddingBottom: '$4',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
});

const Name = styled('h1', {
  fontFamily: '$heading',
  fontSize: '$xl',
  fontWeight: 800,
  color: '$text',
  lineHeight: 1.1,
  marginBottom: '$1',
  background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const Role = styled('p', {
  fontFamily: '$mono',
  fontSize: '$xs',
  color: '$textDim',
  letterSpacing: '1px',
  textTransform: 'uppercase',
});

const SectionLabel = styled('p', {
  fontFamily: '$mono',
  fontSize: '9px',
  color: '$textDim',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '$3',
  marginTop: '$5',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ActionButton = styled('button', {
  background: 'transparent',
  border: 'none',
  color: '$textMuted',
  fontSize: '9px',
  fontFamily: '$mono',
  cursor: 'pointer',
  padding: '2px 6px',
  borderRadius: '3px',
  transition: 'all 0.2s',
  '&:hover': {
    background: 'rgba(124, 58, 237, 0.2)',
    color: '$text'
  }
});

const LinkItem = styled('a', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  padding: '$2 $3',
  borderRadius: '$sm',
  fontFamily: '$body',
  fontSize: '$sm',
  color: '$textMuted',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  border: '1px solid transparent',

  '&:hover': {
    background: 'rgba(124, 58, 237, 0.08)',
    color: '$text',
    borderColor: 'rgba(124, 58, 237, 0.15)',
  },
});

const LinkIcon = styled('span', {
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  flexShrink: 0,
});

const ProjectList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
});

const ProjectItem = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $3',
  borderRadius: '$sm',
  fontFamily: '$body',
  fontSize: '$sm',
  color: '$textMuted',
  background: 'transparent',
  border: '1px solid transparent',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  width: '100%',

  '&:hover': {
    background: 'rgba(124, 58, 237, 0.08)',
    color: '$text',
    borderColor: 'rgba(124, 58, 237, 0.15)',
  },

  variants: {
    active: {
      true: {
        background: 'rgba(124, 58, 237, 0.12)',
        color: '$text',
        borderColor: 'rgba(124, 58, 237, 0.25)',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
      }
    }
  },
});

const Dot = styled('span', {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  flexShrink: 0,
});

const TypeLabel = styled('span', {
  fontFamily: '$mono',
  fontSize: '8px',
  color: '$textDim',
  marginLeft: 'auto',
  letterSpacing: '0.5px',
  flexShrink: 0,
});

const Footer = styled('div', {
  marginTop: 'auto',
  paddingTop: '$5',
  borderTop: '1px solid rgba(255,255,255,0.04)',
});

const FooterText = styled('p', {
  fontFamily: '$mono',
  fontSize: '9px',
  color: '$textDim',
  letterSpacing: '0.5px',
  lineHeight: 1.6,
});

const CorporatePopup = styled(motion.div, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '$6 $8',
    zIndex: 100,
    boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
    textAlign: 'center',
    minWidth: '320px'
});

const PopupTitle = styled('h3', {
    fontFamily: '$heading',
    color: '#00d4ff',
    margin: '0 0 $2 0',
    fontSize: '$lg'
});

const PopupText = styled('p', {
    fontFamily: '$body',
    color: '$textMuted',
    margin: 0,
    fontSize: '$sm',
    lineHeight: 1.5
});

const CloseButton = styled('button', {
    position: 'absolute',
    top: '$2',
    right: '$2',
    background: 'transparent',
    border: 'none',
    color: '$textMuted',
    cursor: 'pointer',
    fontSize: '18px',
    '&:hover': { color: '$text' }
});

const ResumeModal = styled(motion.div, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    // transform is managed by framer-motion
    background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '$6',
    zIndex: 200,
    boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
    width: '90vw',
    maxWidth: '1000px',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '$4'
});

const ResumeIframe = styled('iframe', {
    width: '100%',
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff'
});

const iconMap = {
  github: '⟐',
  linkedin: '◈',
  file: '▤',
  mail: '✉',
};

const sidebarVariants = {
  open: {
    width: 250,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  closed: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

export default function HUD() {
  const [isOpen, setIsOpen] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  
  const activeNode = useNodeStore((s) => s.activeNode);
  const activeGalaxy = useNodeStore((s) => s.activeGalaxy);
  const setActiveNode = useNodeStore((s) => s.setActiveNode);
  const setActiveGalaxy = useNodeStore((s) => s.setActiveGalaxy);
  const clearActiveNode = useNodeStore((s) => s.clearActiveNode);
  const clearActiveGalaxy = useNodeStore((s) => s.clearActiveGalaxy);
  const resumeAnimState = useNodeStore((s) => s.resumeAnimState);
  const setResumeAnimState = useNodeStore((s) => s.setResumeAnimState);

  useEffect(() => {
    const handleComingSoon = () => setShowPopup(true);
    window.addEventListener('TRIGGER_COMING_SOON', handleComingSoon);
    return () => window.removeEventListener('TRIGGER_COMING_SOON', handleComingSoon);
  }, []);

  const getNodesList = () => {
      if (activeGalaxy === 'school') return SCHOOL_NODES;
      if (activeGalaxy === 'college') return COLLEGE_NODES;
      return [];
  };

  const navNodes = getNodesList();

  return (
    <Wrapper>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            style={{ overflow: 'hidden', flexShrink: 0 }}
          >
            <Sidebar>
              <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeGalaxy ? 'system' : 'universe'}
                    variants={staggerContainer} 
                    initial="hidden" 
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  >
                    <Logo as={motion.div} variants={itemVariants}>
                      <Name>Ankan</Name>
                      <Role>Full-Stack · AI/ML</Role>
                    </Logo>

                    <SectionLabel as={motion.p} variants={itemVariants}>
                      Connect
                    </SectionLabel>

                    {Object.values(SOCIAL_LINKS).map((link) => (
                      <LinkItem
                        key={link.label}
                        href={link.url}
                        target={link.url.startsWith('http') ? '_blank' : undefined}
                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        download={link.icon === 'file' ? true : undefined}
                        as={motion.a}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        onClick={(e) => {
                            if (link.icon === 'file') {
                                e.preventDefault();
                                if (resumeAnimState === 'idle') {
                                    setResumeAnimState('flyingIn');
                                }
                            }
                        }}
                      >
                        <LinkIcon>{iconMap[link.icon]}</LinkIcon>
                        {link.label}
                      </LinkItem>
                    ))}

                    <SectionLabel as={motion.p} variants={itemVariants}>
                      <span>{activeGalaxy ? 'Solar System' : 'Universe'}</span>
                      {activeGalaxy && (
                          <ActionButton onClick={() => clearActiveGalaxy()}>
                              ← BACK
                          </ActionButton>
                      )}
                    </SectionLabel>

                    <ProjectList as={motion.div} variants={staggerContainer}>
                      {!activeGalaxy ? (
                          GALAXIES.map((gal) => (
                            <ProjectItem
                                key={gal.id}
                                disabled={gal.isComingSoon}
                                onClick={() => {
                                    if (gal.isComingSoon) {
                                        setShowPopup(true);
                                    } else {
                                        setActiveGalaxy(gal.id);
                                    }
                                }}
                                as={motion.button}
                                variants={itemVariants}
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.97 }}
                                active={false}
                            >
                                <Dot css={{ background: gal.color }} />
                                {gal.title}
                                <TypeLabel>⁂</TypeLabel>
                            </ProjectItem>
                          ))
                      ) : (
                          navNodes.map((node) => (
                            <ProjectItem
                                key={node.id}
                                active={activeNode?.id === node.id}
                                onClick={() => {
                                    if (activeNode?.id === node.id) {
                                        clearActiveNode();
                                    } else {
                                        setActiveNode(node.id, activeGalaxy);
                                    }
                                }}
                                as={motion.button}
                                variants={itemVariants}
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.97 }}
                            >
                            <Dot css={{ background: node.accentColor }} />
                            {node.title}
                            <TypeLabel>
                                {node.type === 'sun' ? '☀' : node.type === 'comet' ? '☄' : '●'}
                            </TypeLabel>
                            </ProjectItem>
                        ))
                      )}
                    </ProjectList>

                    <Footer as={motion.div} variants={itemVariants}>
                      <FooterText>
                        {activeGalaxy ? (
                            <>
                            ⟐ Click a planet to explore<br />
                            ⟐ ESC to return to universe<br />
                            ⟐ Scroll to zoom · Drag to rotate
                            </>
                        ) : (
                            <>
                            ⟐ Click a galaxy to enter<br />
                            ⟐ Explore distinct timelines<br />
                            ⟐ Drag to look around
                            </>
                        )}
                      </FooterText>
                    </Footer>
                  </motion.div>
              </AnimatePresence>
            </Sidebar>
          </motion.div>
        )}
      </AnimatePresence>

      <ToggleBtn
        onClick={() => setIsOpen(!isOpen)}
        style={{
          left: isOpen ? '250px' : '0px',
          transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? '◂' : '▸'}
      </ToggleBtn>

      {/* Corporate Coming Soon Popup */}
      <AnimatePresence>
          {showPopup && (
              <CorporatePopup
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: '-50%', x: '-50%' }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                  <CloseButton onClick={() => setShowPopup(false)}>×</CloseButton>
                  <PopupTitle>Corporate Life</PopupTitle>
                  <PopupText>Access to this sector is currently locked. Check back soon for updates.</PopupText>
              </CorporatePopup>
          )}

          {resumeAnimState === 'reading' && (
              <ResumeModal
                initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.98 }}
                animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <PopupTitle style={{ margin: 0 }}>Ankan's Resume</PopupTitle>
                      <ActionButton 
                          onClick={() => setResumeAnimState('flyingOut')}
                          style={{ fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '8px' }}
                      >
                          Close
                      </ActionButton>
                  </div>
                  <ResumeIframe src="/resume.pdf" title="Resume" />
              </ResumeModal>
          )}
      </AnimatePresence>
    </Wrapper>
  );
}
