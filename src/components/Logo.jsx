import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
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
      <span
        className={`${textSize} font-medium tracking-tight logo-view-animation`}
      >
        view
      </span>
      <style jsx>{`
        .logo-view-animation {
          background: linear-gradient(
            120deg,
            #72B0CC 0%,
            #72B0CC 33%,
            #CF6E3F 33%,
            #CF6E3F 66%,
            #82BC6C 66%,
            #82BC6C 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: logo-gradient-shift 6s ease-in-out infinite;
        }

        @keyframes logo-gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          33% {
            background-position: 50% 50%;
          }
          66% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Logo;

