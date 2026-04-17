import { create } from 'zustand';

// Singleton audio context to persist across components silently
let audioCtx = null;
let droneOsc = null;
let droneGain = null;

const initSynth = () => {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Setup Ambient Static OM Drone
        droneOsc = audioCtx.createOscillator();
        droneGain = audioCtx.createGain();
        
        // Dropped a full octave strictly to 68.05 Hz for a deep texture
        droneOsc.type = 'triangle';
        droneOsc.frequency.setValueAtTime(68.05, audioCtx.currentTime); 
        
        // Vocal Formant Filter (Static, no LFO modulation)
        const formantFilter = audioCtx.createBiquadFilter();
        formantFilter.type = 'lowpass';
        formantFilter.Q.setValueAtTime(1.0, audioCtx.currentTime);
        formantFilter.frequency.setValueAtTime(250, audioCtx.currentTime); // Fixed at deep "O" formant
        
        // Secondary Muffle Filter (kills the high-pitched buzzing)
        const muffleFilter = audioCtx.createBiquadFilter();
        muffleFilter.type = 'lowpass';
        muffleFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
        muffleFilter.Q.setValueAtTime(0.5, audioCtx.currentTime);
        
        droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
        
        // Hook up the vocal cords
        droneOsc.connect(formantFilter);
        formantFilter.connect(muffleFilter);
        muffleFilter.connect(droneGain);
        droneGain.connect(audioCtx.destination);
        
        droneOsc.start();
        
        // Massive slow linear fade-in (3.5 seconds) to completely avoid sharp transient "machine" clicks at the start
        droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
        droneGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 3.5);
    } catch (e) {
        console.warn("Web Audio API not supported", e);
    }
}

const playComet = () => {
    if (!audioCtx) return;
    // Synthesis of a massive swoosh (filtered white noise)
    const bufferSize = audioCtx.sampleRate * 5.0; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Sweep a bandpass filter drastically to simulate combustion
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
    filter.frequency.setValueAtTime(200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, audioCtx.currentTime + 1.2);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 4.8);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 4.9);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseSource.start();
};

const useAudio = create((set, get) => ({
    isInitialized: false,
    isMuted: false,
    init: () => {
        initSynth();
        set({ isInitialized: true });
    },
    toggleMute: () => {
        if (!audioCtx) return;
        if (get().isMuted) {
            audioCtx.resume();
            set({ isMuted: false });
        } else {
            audioCtx.suspend();
            set({ isMuted: true });
        }
    },
    playComet
}));

export default useAudio;
