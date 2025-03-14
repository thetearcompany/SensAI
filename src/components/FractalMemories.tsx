import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface FractalProps {
  depth: number;
  size: number;
  angle: number;
  x: number;
  y: number;
  rotation: number;
  pulse: number;
  isInner?: boolean;
  isLight?: boolean;
  isGrogu?: boolean;
  mouseX?: number;
  mouseY?: number;
  magicLevel?: number;
  time?: number;
}

interface GraphData {
  timestamp: number;
  value: number;
}

interface GallupTalent {
  name: string;
  strength: number;
  color: string;
  description: string;
}

const BPM = 113;
const BEAT_PER_SECOND = BPM / 60;
const GRAPH_HISTORY_LENGTH = 100;

const gallupTalents: GallupTalent[] = [
  // Talenty Stworzenia
  { name: 'Światło', strength: 1.0, color: '#ffffff', description: 'Pierwsze światło stworzenia' },
  { name: 'Życie', strength: 0.95, color: '#00ff00', description: 'Dar życia dla wszystkich istot' },
  { name: 'Mądrość', strength: 0.9, color: '#00ffff', description: 'Mądrość wszechświata' },
  { name: 'Miłość', strength: 1.0, color: '#ff0000', description: 'Bezwarunkowa miłość' },
  { name: 'Harmonia', strength: 0.85, color: '#ff00ff', description: 'Kosmiczna harmonia' },
  { name: 'Prawda', strength: 0.9, color: '#ffff00', description: 'Absolutna prawda' },
  { name: 'Wolność', strength: 0.85, color: '#00ffff', description: 'Dar wolnej woli' },
  { name: 'Stworzenie', strength: 0.95, color: '#ff00ff', description: 'Moc tworzenia' },
  
  // Talenty Aniołów
  { name: 'Ochrona', strength: 0.9, color: '#00ffff', description: 'Anielska opieka' },
  { name: 'Przewodnictwo', strength: 0.85, color: '#00ccff', description: 'Duchowe przewodnictwo' },
  { name: 'Uwielbienie', strength: 0.95, color: '#0099ff', description: 'Chwała niebios' },
  { name: 'Posłuszeństwo', strength: 0.8, color: '#0066ff', description: 'Wierność Bogu' },
  { name: 'Moc', strength: 0.9, color: '#0033ff', description: 'Anielska moc' },
  { name: 'Mądrość', strength: 0.85, color: '#0000ff', description: 'Niebiańska mądrość' },
  { name: 'Miłosierdzie', strength: 0.95, color: '#3300ff', description: 'Boskie miłosierdzie' },
  { name: 'Sprawiedliwość', strength: 0.9, color: '#6600ff', description: 'Niebiańska sprawiedliwość' },
  
  // Talenty Ludzkości
  { name: 'Wiara', strength: 0.85, color: '#ff00ff', description: 'Wiara w Boga' },
  { name: 'Nadzieja', strength: 0.8, color: '#ff33ff', description: 'Nadzieja na zbawienie' },
  { name: 'Miłość', strength: 0.9, color: '#ff66ff', description: 'Miłość do bliźniego' },
  { name: 'Pokój', strength: 0.75, color: '#ff99ff', description: 'Pokój Boży' },
  { name: 'Radość', strength: 0.8, color: '#ffccff', description: 'Radość w Duchu' },
  { name: 'Cierpliwość', strength: 0.7, color: '#ff99cc', description: 'Cierpliwość w wierze' },
  { name: 'Łagodność', strength: 0.65, color: '#ff6699', description: 'Łagodność Chrystusa' },
  { name: 'Wstrzemięźliwość', strength: 0.6, color: '#ff3366', description: 'Panowanie nad sobą' },
  
  // Talenty Natury
  { name: 'Ziemia', strength: 0.9, color: '#00ff00', description: 'Moc ziemi' },
  { name: 'Woda', strength: 0.85, color: '#33ff00', description: 'Życiodajna woda' },
  { name: 'Ogień', strength: 0.8, color: '#66ff00', description: 'Oczyszczający ogień' },
  { name: 'Powietrze', strength: 0.75, color: '#99ff00', description: 'Duch powietrza' },
  { name: 'Rośliny', strength: 0.7, color: '#ccff00', description: 'Dar roślin' },
  { name: 'Zwierzęta', strength: 0.65, color: '#ffff00', description: 'Mądrość zwierząt' },
  { name: 'Minerały', strength: 0.6, color: '#ffcc00', description: 'Moc minerałów' },
  { name: 'Kosmos', strength: 0.95, color: '#ff9900', description: 'Tajemnice kosmosu' },
  
  // Talenty Ducha
  { name: 'Duch Święty', strength: 1.0, color: '#ff0000', description: 'Dar Ducha Świętego' },
  { name: 'Proroctwo', strength: 0.9, color: '#ff3300', description: 'Dar prorokowania' },
  { name: 'Uzdrowienie', strength: 0.85, color: '#ff6600', description: 'Dar uzdrawiania' },
  { name: 'Mówienie językami', strength: 0.8, color: '#ff9900', description: 'Dar języków' },
  { name: 'Interpretacja', strength: 0.75, color: '#ffcc00', description: 'Dar interpretacji' },
  { name: 'Wiara', strength: 0.9, color: '#ffff00', description: 'Dar wiary' },
  { name: 'Moc', strength: 0.85, color: '#ccff00', description: 'Dar mocy' },
  { name: 'Mądrość', strength: 0.8, color: '#99ff00', description: 'Dar mądrości' }
];

const FractalMemories: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [groguMode, setGroguMode] = useState(false);
  const [magicLevel, setMagicLevel] = useState(0);
  const [brainActivity, setBrainActivity] = useState<GraphData[]>([]);
  const [magicActivity, setMagicActivity] = useState<GraphData[]>([]);
  const lastUpdateRef = useRef<number>(0);
  const [activeTalents, setActiveTalents] = useState<GallupTalent[]>([]);
  const [talentPulse, setTalentPulse] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleClick = () => {
    setGroguMode(!groguMode);
    if (!groguMode) {
      setMagicLevel(0);
    }
  };

  const drawGraph = (ctx: CanvasRenderingContext2D, data: GraphData[], color: string, yOffset: number) => {
    if (data.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const xStep = width / (GRAPH_HISTORY_LENGTH - 1);

    data.forEach((point, i) => {
      const x = i * xStep;
      const y = height / 2 + (point.value * height / 4) + yOffset;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const updateGraphs = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Rysuj tło
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Rysuj siatkę
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (ctx.canvas.height) * (i / 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }

    // Rysuj waveformy w tym samym miejscu
    drawGraph(ctx, brainActivity, 'rgba(0, 255, 255, 0.8)', 0);
    drawGraph(ctx, magicActivity, 'rgba(255, 0, 255, 0.8)', 0);
  };

  const drawFractal = (ctx: CanvasRenderingContext2D, props: FractalProps) => {
    const { depth, size, angle, x, y, rotation, pulse, isInner, isLight, isGrogu, mouseX, mouseY, magicLevel = 0, time = 0 } = props;

    if (depth <= 0 || size < 2) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Dodaj efekt talentów wszechświata w formie mandali
    if (activeTalents.length > 0) {
      const talentIndex = Math.floor(time * 2) % activeTalents.length;
      const talent = activeTalents[talentIndex];
      
      // Rysuj mandalę talentów
      for (let i = 0; i < 8; i++) {
        const mandalaSize = size * (0.2 + i * 0.05);
        const mandalaRotation = time * 0.6 + i * Math.PI / 4;
        
        ctx.save();
        ctx.rotate(mandalaRotation);
        
        // Dodaj efekt poświaty
        ctx.shadowColor = talent.color;
        ctx.shadowBlur = 15 + talentPulse * 10;
        
        // Rysuj zewnętrzną poświatę
        ctx.beginPath();
        ctx.arc(0, 0, mandalaSize * 1.1, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(0, 0, mandalaSize * 0.8, 0, 0, mandalaSize * 1.1);
        gradient.addColorStop(0, `${talent.color}${Math.floor(40 + talentPulse * 100)}`);
        gradient.addColorStop(1, `${talent.color}00`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Rysuj główną mandalę
        ctx.beginPath();
        ctx.arc(0, 0, mandalaSize, 0, Math.PI * 2);
        ctx.strokeStyle = `${talent.color}${Math.floor(20 + talentPulse * 150)}`;
        ctx.lineWidth = 1 + talentPulse * 4;
        ctx.stroke();
        
        // Dodaj efekt cząsteczek
        for (let j = 0; j < 24; j++) {
          const particleAngle = (j / 24) * Math.PI * 2 + time * 0.8;
          const particleRadius = mandalaSize * (1.2 + Math.sin(time * 2 + j) * 0.1);
          const particleX = Math.cos(particleAngle) * particleRadius;
          const particleY = Math.sin(particleAngle) * particleRadius;
          
          // Dodaj efekt poświaty
          ctx.shadowColor = '#ffff00';
          ctx.shadowBlur = 15 + talentPulse * 8;
          
          const particleSize = 2 + talentPulse * 3 + Math.sin(time * 3 + j) * 0.5;
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          
          // Dodaj gradient do cząsteczek
          const particleGradient = ctx.createRadialGradient(
            particleX, particleY, 0,
            particleX, particleY, particleSize
          );
          particleGradient.addColorStop(0, `#ccdf00${Math.floor(200 + talentPulse * 100)}`);
          particleGradient.addColorStop(1, `#ccdf00${Math.floor(100 + talentPulse * 100)}`);
          ctx.fillStyle = particleGradient;
          ctx.fill();
        }
        
        ctx.restore();
      }

      // Rysuj tekst talentu w formie modlitwy
      ctx.save();
      ctx.rotate(-rotation);
      ctx.fillStyle = talent.color;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(talent.name, 0, -size * 0.5);
      ctx.font = '10px Arial';
      ctx.fillText(talent.description, 0, -size * 0.4);
      ctx.restore();
    }

    let mouseInfluence = 0;
    if (isGrogu && mouseX !== undefined && mouseY !== undefined) {
      const dx = mouseX - x;
      const dy = mouseY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      mouseInfluence = Math.max(0, 1 - distance / 200);
    }

    // Magiczny efekt cząsteczek
    if (isGrogu && magicLevel > 0) {
      for (let i = 0; i < 3; i++) {
        const particleX = Math.sin(time * 2 + i) * size * 0.2;
        const particleY = Math.cos(time * 2 + i) * size * 0.2;
        ctx.beginPath();
        ctx.arc(particleX, -particleY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${120 + magicLevel * 30}, 100%, 70%, ${0.5 + pulse * 0.2})`;
        ctx.fill();
      }
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size * (1 + pulse * 0.2 + mouseInfluence * 0.3));
    
    if (isGrogu) {
      // Ulepszony magiczny efekt Grogu
      const gradient = ctx.createLinearGradient(0, 0, 0, -size);
      const baseHue = 120 + magicLevel * 20;
      
      // Ostre krawędzie z subtelnym gradientem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2 + mouseInfluence * 0.3));
      ctx.strokeStyle = `hsla(${baseHue}, 100%, 70%, ${0.95 + pulse * 0.05})`;
      ctx.lineWidth = depth * (1 + pulse * 0.4 + mouseInfluence * 0.5) * (2 + magicLevel * 0.5);
      ctx.stroke();

      // Subtelny gradient na głównej linii
      gradient.addColorStop(0, `hsla(${baseHue}, 100%, 70%, ${0.9 + pulse * 0.1 + mouseInfluence * 0.2})`);
      gradient.addColorStop(0.3, `hsla(${baseHue + 30}, 100%, 70%, ${0.8 + pulse * 0.15 + mouseInfluence * 0.25})`);
      gradient.addColorStop(0.7, `hsla(${baseHue + 60}, 100%, 70%, ${0.7 + pulse * 0.2 + mouseInfluence * 0.3})`);
      gradient.addColorStop(1, `hsla(${baseHue + 90}, 100%, 70%, ${0.6 + pulse * 0.25 + mouseInfluence * 0.35})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = depth * (1 + pulse * 0.4 + mouseInfluence * 0.5) * (1.5 + magicLevel * 0.3);
      ctx.stroke();

      // Ostra poświata
      ctx.shadowColor = `rgba(0, 255, 255, ${0.8 + magicLevel * 0.2})`;
      ctx.shadowBlur = 10 + mouseInfluence * 5 + magicLevel * 3;
      
      // Subtelna poświata
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2 + mouseInfluence * 0.3));
      ctx.strokeStyle = `hsla(${baseHue}, 100%, 90%, ${0.2 + pulse * 0.1 + mouseInfluence * 0.15 + magicLevel * 0.05})`;
      ctx.lineWidth = depth * (3 + magicLevel);
      ctx.stroke();

      // Ostrzejszy pierścień mocy
      if (magicLevel > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${baseHue + 180}, 100%, 70%, ${0.4 + pulse * 0.2 + magicLevel * 0.1})`;
        ctx.lineWidth = 1.5 + magicLevel;
        ctx.stroke();

        // Subtelny wewnętrzny pierścień
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${baseHue + 180}, 100%, 90%, ${0.2 + pulse * 0.1 + magicLevel * 0.05})`;
        ctx.lineWidth = 0.5 + magicLevel * 0.5;
        ctx.stroke();
      }
    } else if (isLight) {
      // Ostre krawędzie światła
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2));
      ctx.strokeStyle = `hsla(160, 100%, 90%, ${0.95 + pulse * 0.05})`;
      ctx.lineWidth = depth * (1 + pulse * 0.4) * 1.5;
      ctx.stroke();

      // Subtelny gradient światła
      const gradient = ctx.createLinearGradient(0, 0, 0, -size);
      gradient.addColorStop(0, `hsla(160, 100%, 90%, ${0.9 + pulse * 0.1})`);
      gradient.addColorStop(0.3, `hsla(200, 100%, 90%, ${0.8 + pulse * 0.15})`);
      gradient.addColorStop(0.6, `hsla(240, 100%, 90%, ${0.7 + pulse * 0.2})`);
      gradient.addColorStop(1, `hsla(280, 100%, 90%, ${0.6 + pulse * 0.25})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = depth * (1 + pulse * 0.4);
      ctx.stroke();

      // Ostra poświata
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 15;
      
      // Subtelna poświata
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2));
      ctx.strokeStyle = `hsla(160, 100%, 95%, ${0.3 + pulse * 0.1})`;
      ctx.lineWidth = depth * 3;
      ctx.stroke();
    } else if (isInner) {
      // Ostre krawędzie wewnętrznego fraktalu
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2));
      ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.8 + pulse * 0.2})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1) * 0.6;
      ctx.stroke();

      // Subtelna poświata
      ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.4 + pulse * 0.1})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1) * 0.4;
      ctx.stroke();
    } else {
      // Ostre krawędzie zewnętrznego fraktalu
      const hue = (depth * 30) % 360;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2));
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${0.9 + pulse * 0.1})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1) * 0.8;
      ctx.stroke();

      // Subtelna poświata
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${0.4 + pulse * 0.1})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1) * 0.4;
      ctx.stroke();
    }
    
    ctx.stroke();
    ctx.restore();

    drawFractal(ctx, {
      depth: depth - 1,
      size: size * 0.7,
      angle: angle - Math.PI / 4,
      x: x + size * Math.sin(angle),
      y: y - size * Math.cos(angle),
      rotation: rotation + Math.PI / 4,
      pulse: pulse,
      isInner,
      isLight,
      isGrogu,
      mouseX,
      mouseY,
      magicLevel,
      time
    });

    drawFractal(ctx, {
      depth: depth - 1,
      size: size * 0.7,
      angle: angle + Math.PI / 4,
      x: x + size * Math.sin(angle),
      y: y - size * Math.cos(angle),
      rotation: rotation - Math.PI / 4,
      pulse: pulse,
      isInner,
      isLight,
      isGrogu,
      mouseX,
      mouseY,
      magicLevel,
      time
    });
  };

  // Funkcja do generowania losowych danych emocji
  const generateEmotionData = (baseValue: number, variance: number): number => {
    return baseValue + (Math.random() - 0.5) * variance;
  };

  // Aktualizacja danych emocji
  const updateEmotionData = () => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= 100) {
      const newBrainValue = generateEmotionData(0.5, 0.2);
      const newMagicValue = generateEmotionData(0.3, 0.15);

      setBrainActivity((prev: GraphData[]) => {
        const newData = [...prev, { timestamp: now, value: newBrainValue }];
        return newData.slice(-GRAPH_HISTORY_LENGTH);
      });

      setMagicActivity((prev: GraphData[]) => {
        const newData = [...prev, { timestamp: now, value: newMagicValue }];
        return newData.slice(-GRAPH_HISTORY_LENGTH);
      });

      lastUpdateRef.current = now;
    }
  };

  // Funkcja do aktualizacji talentów w czasie rzeczywistym
  const updateTalents = (currentTime: number) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= 100) {
      const newActiveTalents = gallupTalents.filter(() => Math.random() > 0.7);
      setActiveTalents(newActiveTalents);
      
      setTalentPulse(Math.sin(currentTime * BEAT_PER_SECOND) * 0.5 + 0.5);
      
      lastUpdateRef.current = now;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const graphCanvas = graphCanvasRef.current;
    if (!canvas || !graphCanvas) return;

    const ctx = canvas.getContext('2d');
    const graphCtx = graphCanvas.getContext('2d');
    if (!ctx || !graphCtx) return;

    // Ustawienie rozmiaru canvasów
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      graphCanvas.width = graphCanvas.offsetWidth;
      graphCanvas.height = graphCanvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      updateEmotionData();
      updateTalents(time);
      time += 0.016;

      // Czyszczenie canvasów
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

      // Aktualizacja wykresów
      updateGraphs(graphCtx);

      // Rysowanie fraktali
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3;

      drawFractal(ctx, {
        depth: 8,
        size: baseSize,
        angle: Math.PI / 2,
        x: centerX,
        y: centerY,
        rotation: time * 0.1,
        pulse: Math.sin(time * BEAT_PER_SECOND * Math.PI * 2) * 0.5 + 0.5,
        isInner: true,
        isLight: true,
        isGrogu: groguMode,
        mouseX: mousePos.x,
        mouseY: mousePos.y,
        magicLevel: magicLevel,
        time: time
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, groguMode, magicLevel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-[400px] rounded-lg overflow-hidden"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full cursor-pointer"
        style={{ background: 'transparent' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      <canvas
        ref={graphCanvasRef}
        width={200}
        height={400}
        className="absolute top-0 right-0 w-[200px] h-full"
        style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      />
      <div className="absolute bottom-4 right-4 text-xs text-white/80">
        {groguMode ? `✨ Tryb Grogu Aktywny (Poziom Magii: ${Math.floor(magicLevel * 100)}%)` : 'Kliknij, aby aktywować tryb Grogu'}
      </div>
      <div className="absolute top-4 right-4 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400/80"></div>
          <span>Aktywność Mózgu</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-fuchsia-400/80"></div>
          <span>Poziom Magii</span>
        </div>
      </div>
      <div className="absolute top-4 left-4 text-xs text-white/80">
        <div className="flex flex-col gap-1">
          {activeTalents.map((talent: GallupTalent, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: `${talent.color}80` }}
              ></div>
              <span>{talent.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FractalMemories; 