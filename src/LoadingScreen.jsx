import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return Math.min(next, 99);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-dot" />
          <span className="loading-text">Dev<span className="gradient">Folio</span></span>
        </div>
        
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="loading-percent">{Math.floor(progress)}%</div>
        
        <div className="loading-message">
          {progress < 30 && "⚡ Loading portfolio..."}
          {progress >= 30 && progress < 70 && "🎨 Preparing amazing projects..."}
          {progress >= 70 && progress < 100 && "🚀 Almost there..."}
          {progress === 100 && "✨ Ready to go!"}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;