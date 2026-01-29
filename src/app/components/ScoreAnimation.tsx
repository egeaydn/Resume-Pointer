'use client';

import { useState, useEffect } from 'react';

interface ScoreAnimationProps {
  targetScore: number;
  maxScore: number;
  color: string;
  label: string;
}

export default function ScoreAnimation({ targetScore, maxScore, color, label }: ScoreAnimationProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Animate score counting up
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        setDisplayScore(targetScore);
        clearInterval(timer);
        
        // Show confetti for excellent scores
        if (targetScore >= 85) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetScore]);

  return (
    <div className="relative">
      {showConfetti && <ConfettiEffect />}
      
      <div className="text-7xl font-bold mb-2 transition-all" style={{ color }}>
        {displayScore}
        <span className="text-3xl text-gray-500">/{maxScore}</span>
      </div>
      
      <div className="text-xl font-semibold mb-4 transition-opacity duration-500" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

function ConfettiEffect() {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    color: ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -10%;
            opacity: 1;
            transform: rotate(0deg);
          }
          100% {
            top: 110%;
            opacity: 0;
            transform: rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
