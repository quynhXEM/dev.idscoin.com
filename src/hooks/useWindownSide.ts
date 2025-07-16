// hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight});
    }

    updateSize(); // Gọi lần đầu khi component mount
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
