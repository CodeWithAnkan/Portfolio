import { useEffect } from 'react';
import useNodeStore from './useNodeStore';

export default function useHashNavigation() {
  const initFromHash = useNodeStore((s) => s.initFromHash);

  useEffect(() => {
    initFromHash();

    const handleHashChange = () => {
      initFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initFromHash]);
}
