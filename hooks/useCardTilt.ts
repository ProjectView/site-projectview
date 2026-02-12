'use client';

import { useRef, useState } from 'react';

export function useCardTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`,
      transition: 'transform 0.15s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(800px) rotateY(0) rotateX(0) scale(1)',
      transition: 'transform 0.4s ease-out',
    });
  };

  return { ref, style, handleMouseMove, handleMouseLeave };
}
