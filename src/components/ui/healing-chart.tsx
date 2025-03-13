import React, { useState, useEffect, useRef } from 'react';
import { Card } from './card';
import { LineChart } from './line-chart';
import '../styles/healing.css';

interface HealingData {
  timestamp: number;
  value: number;
}

interface HealingChartProps {
  data: HealingData[];
  currentLevel: number;
}

const healingEmojis = [
  { emoji: '🧘', description: 'Medytacja i spokój', sound: 'meditation', vibration: [100, 50, 100] },
  { emoji: '💪', description: 'Siła wewnętrzna', sound: 'strength', vibration: [200, 100, 200] },
  { emoji: '❤️', description: 'Miłość i akceptacja', sound: 'love', vibration: [150, 75, 150] },
  { emoji: '🌱', description: 'Wzrost i rozwój', sound: 'growth', vibration: [120, 60, 120] },
  { emoji: '🌈', description: 'Nadzieja i optymizm', sound: 'hope', vibration: [180, 90, 180] },
  { emoji: '🎯', description: 'Cel i determinacja', sound: 'focus', vibration: [160, 80, 160] },
  { emoji: '🌟', description: 'Światło i inspiracja', sound: 'light', vibration: [140, 70, 140] },
  { emoji: '🦋', description: 'Transformacja', sound: 'transform', vibration: [170, 85, 170] },
  { emoji: '✨', description: 'Boska obecność', sound: 'divine', vibration: [190, 95, 190] },
  { emoji: '🙏', description: 'Modlitwa i wdzięczność', sound: 'prayer', vibration: [130, 65, 130] },
  { emoji: '💫', description: 'Kosmiczna miłość', sound: 'cosmic', vibration: [210, 105, 210] },
  { emoji: '🌠', description: 'Duchowe światło', sound: 'spirit', vibration: [220, 110, 220] },
  { emoji: '🕊️', description: 'Pokój i błogosławieństwo', sound: 'peace', vibration: [110, 55, 110] },
  { emoji: '🌺', description: 'Boska miłość', sound: 'divine-love', vibration: [230, 115, 230] },
  { emoji: '🎭', description: 'Duchowa transformacja', sound: 'spirit-transform', vibration: [240, 120, 240] },
  { emoji: '🎪', description: 'Boska gra', sound: 'divine-play', vibration: [250, 125, 250] },
];

const healingSounds = {
  meditation: new Audio('/sounds/meditation.mp3'),
  strength: new Audio('/sounds/strength.mp3'),
  love: new Audio('/sounds/love.mp3'),
  growth: new Audio('/sounds/growth.mp3'),
  hope: new Audio('/sounds/hope.mp3'),
  focus: new Audio('/sounds/focus.mp3'),
  light: new Audio('/sounds/light.mp3'),
  transform: new Audio('/sounds/transform.mp3'),
  divine: new Audio('/sounds/divine.mp3'),
  prayer: new Audio('/sounds/prayer.mp3'),
  cosmic: new Audio('/sounds/cosmic.mp3'),
  spirit: new Audio('/sounds/spirit.mp3'),
  peace: new Audio('/sounds/peace.mp3'),
  'divine-love': new Audio('/sounds/divine-love.mp3'),
  'spirit-transform': new Audio('/sounds/spirit-transform.mp3'),
  'divine-play': new Audio('/sounds/divine-play.mp3'),
};

const healingSuggestions = [
  'Praktykuj głębokie oddychanie',
  'Medytuj przez 5 minut',
  'Napisz 3 rzeczy, za które jesteś wdzięczny',
  'Wykonaj delikatne rozciąganie',
  'Posłuchaj relaksacyjnej muzyki',
  'Spójrz w niebo i poczuj spokój',
  'Pomyśl o kimś, kogo kochasz',
  'Poczuj swoją siłę wewnętrzną',
  'Pomodlę się za Ciebie',
  'Poczuj moją obecność',
  'Jesteś bezpieczny w mojej miłości',
  'Zaufaj swojemu sercu',
  'Pozwól sobie na uzdrowienie',
  'Jesteś kochany i akceptowany',
  'Twoja dusza jest piękna',
  'Jesteś częścią większej całości',
  'Poczuj moje błogosławieństwo',
  'Jesteś w moich myślach',
  'Twoja podróż jest święta',
  'Jesteś prowadzony przez światło',
  'Pozwól mi Cię uzdrowić',
  'Jesteś w moim sercu',
  'Twoja transformacja jest piękna',
  'Jesteś częścią boskiego planu',
];

const healingAffirmations = [
  'Jesteś kochany ponad wszystko',
  'Twoja wartość jest nieskończona',
  'Jesteś bezpieczny w mojej opiece',
  'Twoja dusza jest wieczna',
  'Jesteś częścią boskiego planu',
  'Twoja miłość jest bezwarunkowa',
  'Jesteś otoczony światłem',
  'Twoja siła jest nieskończona',
  'Jesteś moim błogosławieństwem',
  'Twoja podróż jest święta',
  'Jesteś prowadzony przez światło',
  'Twoja transformacja jest piękna',
  'Jesteś w moim sercu na zawsze',
  'Twoja obecność jest darem',
  'Jesteś częścią boskiej gracji',
  'Twoja miłość jest wieczna',
];

const healingColors = [
  'from-purple-50 to-pink-50',
  'from-blue-50 to-indigo-50',
  'from-green-50 to-teal-50',
  'from-yellow-50 to-orange-50',
  'from-red-50 to-pink-50',
];

const healingParticles = ['✨', '💫', '🌟', '⭐', '🌠'];

export function HealingChart({ data, currentLevel }: HealingChartProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentEmoji = healingEmojis[Math.floor(currentLevel / 6.25)];
  const currentSuggestion = healingSuggestions[Math.floor(Math.random() * healingSuggestions.length)];
  const currentAffirmation = healingAffirmations[Math.floor(Math.random() * healingAffirmations.length)];
  const currentColor = healingColors[Math.floor(currentLevel / 20)];

  useEffect(() => {
    if (isHovered && !isPlaying) {
      const sound = healingSounds[currentEmoji.sound as keyof typeof healingSounds];
      if (sound) {
        sound.volume = 0.3;
        sound.play().catch(() => {});
        setIsPlaying(true);
        
        // Dodaj wibrację
        if (navigator.vibrate) {
          navigator.vibrate(currentEmoji.vibration);
        }
      }
    }
  }, [isHovered, currentEmoji.sound, isPlaying, currentEmoji.vibration]);

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(prev => [...prev, ...newParticles]);
      
      const timeout = setTimeout(() => {
        setParticles(prev => prev.slice(5));
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount % 3 === 0) {
      setShowAffirmation(true);
      setTimeout(() => setShowAffirmation(false), 3000);
    }
  };

  return (
    <Card 
      className={`p-6 bg-gradient-to-br ${currentColor} shadow-lg healing-card relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
      onClick={handleClick}
    >
      <div className="moonlight-effect"></div>
      <div className="prism-effect"></div>
      <div className="calm-effect"></div>
      
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute healing-particle text-2xl"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {healingParticles[Math.floor(Math.random() * healingParticles.length)]}
        </div>
      ))}
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <div className="text-7xl mb-2 healing-emoji transform group-hover:scale-110 transition-transform duration-300">
            {currentEmoji.emoji}
          </div>
          <div className="absolute -inset-2 bg-white/30 rounded-full blur-xl healing-glow"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="text-xl text-purple-700 text-center font-medium healing-text">
          {currentEmoji.description}
        </div>
        
        <div className="w-full h-48">
          <LineChart data={data} />
        </div>

        <div className="text-center mt-4 space-y-4">
          <div className="text-3xl font-bold healing-level">
            Poziom Healingu: {currentLevel}%
          </div>
          {showAffirmation && (
            <div className="text-2xl text-purple-800 italic font-medium healing-affirmation animate-fade-in">
              {currentAffirmation}
            </div>
          )}
          <div className="text-lg text-gray-700 healing-suggestion">
            Suggestion: {currentSuggestion}
          </div>
          <div className="text-sm text-purple-600 italic mt-2 peace-text">
            Księżyc jest pryzmatem, a Ty jesteś światłem
          </div>
          <div className="text-sm text-purple-500 italic gentle-wave">
            Odpocznij, Jurek. Wszystko jest dobrze.
          </div>
        </div>
      </div>
    </Card>
  );
} 