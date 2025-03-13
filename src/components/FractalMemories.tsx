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

const BPM = 55.5;
const BEAT_PER_SECOND = BPM / 60;
const GRAPH_HISTORY_LENGTH = 100;

const FractalMemories: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [groguMode, setGroguMode] = useState(false);
  const [magicLevel, setMagicLevel] = useState(0);
  const [brainActivity, setBrainActivity] = useState<GraphData[]>([]);
  const [magicActivity, setMagicActivity] = useState<GraphData[]>([]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const graphCanvas = graphCanvasRef.current;
    if (!canvas || !graphCanvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const graphCtx = graphCanvas.getContext('2d', { alpha: true });
    if (!ctx || !graphCtx) return;

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time = Date.now() * 0.001;
      
      // Główny rytm w tempie 55.5 BPM
      const baseRotation = time * BEAT_PER_SECOND * 0.5;
      const basePulse = Math.sin(time * BEAT_PER_SECOND * 2);
      const lightPulse = Math.sin(time * BEAT_PER_SECOND);

      // Dodatkowe ruchy dla pas de deux
      const danceRotation1 = Math.sin(time * 0.15) * 0.3; // Wolniejszy ruch
      const danceRotation2 = Math.cos(time * 0.15) * 0.3; // Przeciwny ruch
      const danceOffset1 = Math.sin(time * 0.1) * 10; // Delikatniejsze przesunięcie
      const danceOffset2 = Math.cos(time * 0.1) * 10; // Przeciwne przesunięcie

      // Aktualizuj dane wykresów
      const timestamp = Date.now();
      setBrainActivity(prev => {
        const newData = [...prev, { timestamp, value: basePulse }];
        return newData.slice(-GRAPH_HISTORY_LENGTH);
      });
      setMagicActivity(prev => {
        const newData = [...prev, { timestamp, value: magicLevel }];
        return newData.slice(-GRAPH_HISTORY_LENGTH);
      });

      // Zwiększ poziom magii w czasie
      if (groguMode && magicLevel < 3) {
        setMagicLevel(prev => Math.min(3, prev + 0.01));
      }
      
      // Pierwszy tancerz - główny fraktal
      drawFractal(ctx, {
        depth: 8,
        size: 100,
        angle: -Math.PI / 2,
        x: canvas.width / 2 + danceOffset1,
        y: canvas.height / 2 + basePulse * 20 + danceOffset2,
        rotation: baseRotation + danceRotation1,
        pulse: basePulse,
        time
      });

      // Drugi tancerz - wewnętrzny fraktal
      drawFractal(ctx, {
        depth: 6,
        size: 50,
        angle: -Math.PI / 2,
        x: canvas.width / 2 - danceOffset1,
        y: canvas.height / 2 + basePulse * 10 - danceOffset2,
        rotation: -baseRotation * 1.5 + danceRotation2,
        pulse: basePulse,
        isInner: true,
        time
      });

      // Fraktal światła - dodaje blask do choreografii
      drawFractal(ctx, {
        depth: 7,
        size: 75,
        angle: -Math.PI / 2,
        x: canvas.width / 2 + danceOffset2 * 0.5,
        y: canvas.height / 2 + lightPulse * 15 + danceOffset1 * 0.5,
        rotation: baseRotation * 0.8 + (danceRotation1 + danceRotation2) * 0.5,
        pulse: lightPulse,
        isLight: true,
        time
      });

      // Fraktal Ducha Świętego - subtelnie towarzyszy tańcowi
      const holySpiritRotation = Math.sin(time * 0.1) * 0.2;
      const holySpiritOffset = Math.cos(time * 0.1) * 15;
      const holySpiritPulse = Math.sin(time * BEAT_PER_SECOND * 0.5);
      
      drawFractal(ctx, {
        depth: 4,
        size: 40,
        angle: -Math.PI / 2,
        x: canvas.width / 2 + danceOffset1 * 0.7 + holySpiritOffset,
        y: canvas.height / 2 + basePulse * 15 + danceOffset2 * 0.7,
        rotation: baseRotation * 0.6 + holySpiritRotation,
        pulse: holySpiritPulse,
        isLight: true,
        time
      });

      // Fraktal Grogu - dodaje magię do tańca
      if (groguMode) {
        drawFractal(ctx, {
          depth: 5,
          size: 60,
          angle: -Math.PI / 2,
          x: canvas.width / 2 + danceOffset2 * 0.3,
          y: canvas.height / 2 + lightPulse * 10 + danceOffset1 * 0.3,
          rotation: baseRotation * 1.2 + (danceRotation1 - danceRotation2) * 0.3,
          pulse: lightPulse,
          isGrogu: true,
          mouseX: mousePos.x,
          mouseY: mousePos.y,
          magicLevel,
          time
        });
      }

      // Aktualizuj wykresy
      updateGraphs(graphCtx);

      requestAnimationFrame(animate);
    };

    animate();
  }, [groguMode, mousePos, magicLevel, brainActivity, magicActivity]);

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
    </motion.div>
  );
};

export default FractalMemories; 