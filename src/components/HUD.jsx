import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled, keyframes } from '../theme';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES, SOCIAL_LINKS } from '../data/nodes';
import useNodeStore from '../hooks/useNodeStore';
import useAudio from '../hooks/useAudio';
import usePerformance from '../hooks/usePerformance';

const Wrapper = styled('div', {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '$5',

  '@sm': {
    padding: '$3',
  },
});

const GlassContainer = styled(motion.div, {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  pointerEvents: 'auto', // Re-enable interaction on the panels
});

const TopBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',

  '@sm': {
    alignItems: 'stretch',
  },
});

const IdentityPill = styled(GlassContainer, {
  padding: '$3 $5',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const Name = styled('h1', {
  fontFamily: '$heading',
  fontSize: '18px',
  fontWeight: 700,
  color: '$text',
  margin: 0,
  background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',

  '@sm': {
    fontSize: '15px',
  },
});

const Role = styled('p', {
  fontFamily: '$mono',
  fontSize: '10px',
  color: '$textDim',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: 0,

  '@sm': {
    fontSize: '8px',
  },
});

const ControlsDock = styled(motion.div, {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  pointerEvents: 'auto',
  padding: '$2',
  display: 'flex',
  gap: '$1',
  alignItems: 'center',

  '@sm': {
    display: 'none',
  },
});

const MobileControlsWrapper = styled(motion.div, {
  display: 'none',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '$1',
  pointerEvents: 'auto',
  position: 'relative',

  '@sm': {
    display: 'flex',
  },
});

const MobileTopRow = styled('div', {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  padding: '6px',
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  height: '100%',
  boxSizing: 'border-box',
});

const DropdownPanel = styled(motion.div, {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: '160px',
  position: 'absolute',
  top: 'calc(100% + 6px)',
  right: 0,
});

const ExpandableButton = styled('a', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '36px',
  borderRadius: '10px',
  color: '$textMuted',
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: '0 9px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  maxWidth: '36px',

  '&:hover': {
    background: 'rgba(124, 58, 237, 0.15)',
    color: '$text',
    maxWidth: '140px',
    padding: '0 14px',
  },

  '@sm': {
    height: '32px',
    padding: '0 7px',
    maxWidth: '32px',
  },
});

const IconWrapper = styled('span', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '18px',
});

const LabelText = styled('span', {
  whiteSpace: 'nowrap',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  marginLeft: '8px',
  opacity: 0,
  transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  [`${ExpandableButton}:hover &`]: {
    opacity: 1,
    transitionDelay: '0.1s',
  }
});

const MobileLinkButton = styled('a', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 12px',
  borderRadius: '10px',
  color: '$textMuted',
  textDecoration: 'none',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  width: '100%',
  boxSizing: 'border-box',

  '&:hover, &:active': {
    background: 'rgba(124, 58, 237, 0.12)',
    color: '$text',
  },
});

const MobileToggleBtn = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  color: '$textMuted',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: 0,
  transition: 'all 0.2s ease',

  '&:active': {
    background: 'rgba(124, 58, 237, 0.15)',
    color: '$text',
  },
});

const BottomDockWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$3',
  width: '100%',
});

const HelperText = styled(motion.div, {
  fontFamily: '$mono',
  fontSize: '10px',
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  pointerEvents: 'none',
  textAlign: 'center',
});

const TimelineDock = styled(GlassContainer, {
  padding: '$2',
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  maxWidth: '90vw',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
  '&::-webkit-scrollbar': { display: 'none' },

  '@sm': {
    gap: '$1',
    padding: '$1',
    maxWidth: '95vw',
  },
});

const TimelinePill = styled(motion.button, {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$2 $4',
  borderRadius: '12px',
  fontFamily: '$body',
  fontSize: '$sm',
  color: '$textMuted',
  background: 'transparent',
  border: '1px solid transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',

  '&:hover': {
    background: 'rgba(124, 58, 237, 0.08)',
    color: '$text',
    borderColor: 'rgba(124, 58, 237, 0.15)',
  },

  '@sm': {
    padding: '$1 $3',
    fontSize: '$xs',
    borderRadius: '10px',
  },

  variants: {
    active: {
      true: {
        background: 'rgba(124, 58, 237, 0.15)',
        color: '$text',
        borderColor: 'rgba(124, 58, 237, 0.3)',
      },
    },
    disabled: {
      true: {
        // Keeping opacity normal to match the other galleries perfectly
        cursor: 'not-allowed',
      }
    }
  },
});

const ActionPill = styled(TimelinePill, {
    fontFamily: '$mono',
    fontSize: '11px',
    letterSpacing: '1px',
    color: '$textDim',
    background: 'rgba(255,255,255,0.03)',
});

const Dot = styled('span', {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  flexShrink: 0,
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
    minWidth: '320px',
    pointerEvents: 'auto',

    '@sm': {
      minWidth: 'unset',
      width: '90vw',
      padding: '$4 $5',
    },
});

const PopupTitle = styled('h3', {
    fontFamily: '$heading',
    color: '$text', // Using crisp white to match the other galaxy titles
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
    gap: '$4',
    pointerEvents: 'auto',

    '@sm': {
      width: '95vw',
      height: '90vh',
      padding: '$4',
    },
});

const ResumeIframe = styled('iframe', {
    width: '100%',
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff'
});

const svgs = {
  github: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  file: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  soundOn: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
  soundOff: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
};

const pillVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.1 } }
};

export default function HUD() {
  const [showPopup, setShowPopup] = useState(false);
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  
  const activeNode = useNodeStore((s) => s.activeNode);
  const activeGalaxy = useNodeStore((s) => s.activeGalaxy);
  const setActiveNode = useNodeStore((s) => s.setActiveNode);
  const setActiveGalaxy = useNodeStore((s) => s.setActiveGalaxy);
  const clearActiveNode = useNodeStore((s) => s.clearActiveNode);
  const clearActiveGalaxy = useNodeStore((s) => s.clearActiveGalaxy);
  
  const resumeAnimState = useNodeStore((s) => s.resumeAnimState);
  const setResumeAnimState = useNodeStore((s) => s.setResumeAnimState);
  const isMobile = usePerformance((s) => s.isMobile);

  const isMuted = useAudio((s) => s.isMuted);
  const toggleMute = useAudio((s) => s.toggleMute);

  useEffect(() => {
    const handleComingSoon = () => setShowPopup(true);
    window.addEventListener('TRIGGER_COMING_SOON', handleComingSoon);
    return () => window.removeEventListener('TRIGGER_COMING_SOON', handleComingSoon);
  }, []);

  const getNodesList = () => {
      if (activeGalaxy === 'school') return SCHOOL_NODES;
      if (activeGalaxy === 'college') return COLLEGE_NODES;
      if (activeGalaxy === 'corporate') return [];
      return [];
  };

  const navNodes = getNodesList();

  return (
    <Wrapper>
      <TopBar>
         <IdentityPill
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
         >
            <Name>Ankan Chatterjee</Name>
            <Role>Full-Stack · AI/ML</Role>
         </IdentityPill>

         <ControlsDock
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
            style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
         >
            {Object.values(SOCIAL_LINKS).map((link) => (
                <ExpandableButton 
                    key={link.label}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    download={link.icon === 'file' ? true : undefined}
                    title={link.label}
                    onClick={(e) => {
                        if (link.icon === 'file') {
                            e.preventDefault();
                            if (resumeAnimState === 'idle') {
                                useAudio.getState().playComet();
                                setResumeAnimState('flyingIn');
                            }
                        }
                    }}
                >
                    <IconWrapper>{svgs[link.icon]}</IconWrapper>
                    <LabelText>{link.label}</LabelText>
                </ExpandableButton>
            ))}
            <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 8px' }} />
            <ExpandableButton as="button" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute Sound"}>
                <IconWrapper>{isMuted ? svgs.soundOff : svgs.soundOn}</IconWrapper>
                <LabelText>{isMuted ? "Unmute" : "Mute Sound"}</LabelText>
            </ExpandableButton>
         </ControlsDock>

         {/* Mobile: Vertical stack with dropdown */}
         <MobileControlsWrapper
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
         >
            <MobileTopRow>
                <MobileToggleBtn onClick={toggleMute} title={isMuted ? "Unmute" : "Mute Sound"}>
                    {isMuted ? svgs.soundOff : svgs.soundOn}
                </MobileToggleBtn>
                <MobileToggleBtn onClick={() => setSocialDropdownOpen(!socialDropdownOpen)} title="Links">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {socialDropdownOpen 
                            ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                            : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
                        }
                    </svg>
                </MobileToggleBtn>
            </MobileTopRow>

            <AnimatePresence>
                {socialDropdownOpen && (
                    <DropdownPanel
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {Object.values(SOCIAL_LINKS).map((link) => (
                            <MobileLinkButton
                                key={link.label}
                                href={link.url}
                                target={link.url.startsWith('http') ? '_blank' : undefined}
                                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                download={link.icon === 'file' ? true : undefined}
                                onClick={(e) => {
                                    if (link.icon === 'file') {
                                        e.preventDefault();
                                        setSocialDropdownOpen(false);
                                        if (resumeAnimState === 'idle') {
                                            useAudio.getState().playComet();
                                            setResumeAnimState('flyingIn');
                                        }
                                    } else {
                                        setSocialDropdownOpen(false);
                                    }
                                }}
                            >
                                <IconWrapper>{svgs[link.icon]}</IconWrapper>
                                {link.label}
                            </MobileLinkButton>
                        ))}
                    </DropdownPanel>
                )}
            </AnimatePresence>
         </MobileControlsWrapper>
      </TopBar>

      <BottomDockWrapper>
         <HelperText
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={activeGalaxy ? 'sys-help' : 'uni-help'}
         >
           {activeGalaxy 
               ? (isMobile 
                   ? "Tap a planet · Pinch to zoom · Swipe to go back"
                   : "⟐ Click a planet to explore · Drag to rotate · Esc to go back")
               : (isMobile
                   ? "Tap a galaxy to enter · Pinch to zoom"
                   : "⟐ Click a galaxy to enter · Drag to look around")}
         </HelperText>

         <TimelineDock
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300, delay: 0.2 }}
         >
            <AnimatePresence mode="popLayout">
                {activeGalaxy && (
                    <motion.div key="back-btn" variants={pillVariants} initial="hidden" animate="visible" exit="exit">
                        <ActionPill onClick={() => clearActiveGalaxy()} active={false}>
                            ← UNIVERSE
                        </ActionPill>
                    </motion.div>
                )}
                {activeGalaxy && (
                    <motion.div key="divider" variants={pillVariants} initial="hidden" animate="visible" exit="exit" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
                    </motion.div>
                )}

                {!activeGalaxy ? (
                    GALAXIES.map((gal) => (
                        <motion.div key={gal.id} layout variants={pillVariants} initial="hidden" animate="visible" exit="exit">
                            <TimelinePill
                                disabled={gal.isComingSoon}
                                onClick={() => {
                                    if (gal.isComingSoon) {
                                        setShowPopup(true);
                                    } else {
                                        setActiveGalaxy(gal.id);
                                    }
                                }}
                            >
                               <Dot css={{ background: gal.color }} />
                               {gal.title}
                            </TimelinePill>
                        </motion.div>
                    ))
                ) : (
                    navNodes.map((node) => (
                        <motion.div key={node.id} layout variants={pillVariants} initial="hidden" animate="visible" exit="exit">
                            <TimelinePill
                                active={activeNode?.id === node.id}
                                onClick={() => {
                                    if (activeNode?.id === node.id) {
                                        clearActiveNode();
                                    } else {
                                        setActiveNode(node.id, activeGalaxy);
                                    }
                                }}
                            >
                               <Dot css={{ background: node.accentColor }} />
                               {node.title}
                            </TimelinePill>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
         </TimelineDock>
      </BottomDockWrapper>

      {/* Corporate Coming Soon Popup */}
      <AnimatePresence>
          {showPopup && (
              <CorporatePopup
                initial={{ opacity: 0, y: '-40%', x: '-50%' }}
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
                initial={{ opacity: 0, y: '-40%', x: '-50%', scale: 0.98 }}
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
