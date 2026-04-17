import { create } from 'zustand';
import { GALAXIES, SCHOOL_NODES, COLLEGE_NODES } from '../data/nodes';

const ALL_NODES = [...SCHOOL_NODES, ...COLLEGE_NODES];

const useNodeStore = create((set, get) => ({
  activeGalaxy: null, // 'school', 'college', 'corporate'
  activeNode: null,
  hoveredNode: null,
  detailOpen: false,
  resumeAnimState: 'idle', // 'idle' | 'flyingIn' | 'reading' | 'flyingOut'

  setResumeAnimState: (state) => set({ resumeAnimState: state }),

  setActiveGalaxy: (galaxyId) => {
    if (galaxyId === 'corporate') return; // Handled separately for "coming soon"
    window.location.hash = `galaxy_${galaxyId}`;
    set({ activeGalaxy: galaxyId, activeNode: null, detailOpen: false });
  },

  clearActiveGalaxy: () => {
    window.history.replaceState(null, '', window.location.pathname);
    set({ activeGalaxy: null, activeNode: null, detailOpen: false });
  },

  setActiveNode: (nodeId, galaxyId) => {
    const node = ALL_NODES.find((n) => n.id === nodeId) || null;
    if (node) {
      window.location.hash = `${galaxyId}/${node.hashId}`;
    }
    set({ activeNode: node, detailOpen: !!node, activeGalaxy: galaxyId });
  },

  clearActiveNode: () => {
    const { activeGalaxy } = get();
    if (activeGalaxy) {
      window.location.hash = `galaxy_${activeGalaxy}`;
    }
    set({ activeNode: null, detailOpen: false });
  },

  setHoveredNode: (nodeId) => {
    set({ hoveredNode: nodeId });
  },

  closeDetail: () => {
    set({ detailOpen: false });
  },

  initFromHash: () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      if (hash.startsWith('galaxy_')) {
        const gal = hash.replace('galaxy_', '');
        set({ activeGalaxy: gal });
      } else if (hash.includes('/')) {
        const [gal, nodeId] = hash.split('/');
        const node = ALL_NODES.find((n) => n.hashId === nodeId);
        if (node) {
          set({ activeGalaxy: gal, activeNode: node, detailOpen: true });
        }
      }
    }
  },
}));

export default useNodeStore;
