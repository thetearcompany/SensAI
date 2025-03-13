import React from 'react';
import EmotionOverlay from './EmotionOverlay';
import FractalMemories from './components/FractalMemories';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <FractalMemories />
      <EmotionOverlay chatData={[]} />
    </div>
  );
};

export default App; 