import React, { useEffect, useState } from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const [color, setColor] = useState('#72B0CC');

  useEffect(() => {
    const colors = ['#72B0CC', '#CF6E3F', '#82BC6C'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % colors.length;
      setColor(colors[i]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const textSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-0 ${className}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <span className={`${textSize} font-medium tracking-tight text-gray-900`}>Project</span>
      <span className={`${textSize} font-medium tracking-tight`} style={{ color }}>view</span>
    </div>
  );
};

export default Logo;

