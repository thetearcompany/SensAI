import React from 'react';
import ReactDOM from 'react-dom/client';
import FractalMemories from '@/components/FractalMemories';
import '@/styles/globals.css';

// Przykładowe dane do testów
const testMessages = [
  "Cześć wszystkim! 😊",
  "Świetny stream! 😃",
  "Co za niespodzianka! 😲",
  "Ale super! 😄",
  "Nie podoba mi się to 😡",
  "Smutne to... 😢",
  "Wow! 😯",
  "Kappa Kappa Kappa",
  "PogChamp",
  "LUL",
  ":)",
  ":(",
  "👿",
  "😭",
  "😃"
];

const MeditationPanel: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        <FractalMemories />
        <div className="text-center mt-4 text-white/80">
          <p className="text-lg">Kliknij, aby aktywować tryb medytacyjny</p>
          <p className="text-sm mt-2">Poruszaj myszką, aby interagować z fraktalami</p>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MeditationPanel />
  </React.StrictMode>
); 