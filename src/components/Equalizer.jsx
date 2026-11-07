import React from 'react';

export const Equalizer = ({ count = 14, height = 40, animated = true }) => {
  return (
    <div 
      className="equalizer-container" 
      style={{ height: `${height}px` }}
      aria-label="Audio Visualizer"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span 
          key={i} 
          className="equalizer-bar" 
          style={{ 
            animationPlayState: animated ? 'running' : 'paused',
            height: animated ? undefined : `${(i % 5 + 1) * 6}px`
          }} 
        />
      ))}
    </div>
  );
};
