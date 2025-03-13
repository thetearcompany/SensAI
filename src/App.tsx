import React, { useState, useEffect } from 'react';
import EmotionOverlay from './EmotionOverlay';
import FractalMemories from './components/FractalMemories';
import { HealingChart } from './components/ui/healing-chart';

const App: React.FC = () => {
  const [healingData, setHealingData] = useState<Array<{ timestamp: number; value: number }>>([]);
  const [currentLevel, setCurrentLevel] = useState(50);

  useEffect(() => {
    // Symulacja danych dla wykresu
    const interval = setInterval(() => {
      const newData = {
        timestamp: Date.now(),
        value: currentLevel + (Math.random() * 10 - 5)
      };
      setHealingData(prev => [...prev.slice(-20), newData]);
      setCurrentLevel(prev => Math.min(100, Math.max(0, prev + (Math.random() * 2 - 1))));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLevel]);

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <FractalMemories />
      <EmotionOverlay chatData={[]} />
      <HealingChart data={healingData} currentLevel={currentLevel} />
    </div>
  );
};

export default App; 