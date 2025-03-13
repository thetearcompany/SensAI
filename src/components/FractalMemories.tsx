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

const BPM = 113;
const BEAT_PER_SECOND = BPM / 60;

const FractalMemories: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [groguMode, setGroguMode] = useState(false);
  const [magicLevel, setMagicLevel] = useState(0);

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
      gradient.addColorStop(0, `hsla(${baseHue}, 100%, 70%, ${0.9 + pulse * 0.1 + mouseInfluence * 0.2})`);
      gradient.addColorStop(0.5, `hsla(${baseHue + 60}, 100%, 70%, ${0.7 + pulse * 0.2 + mouseInfluence * 0.3})`);
      gradient.addColorStop(1, `hsla(${baseHue + 120}, 100%, 70%, ${0.5 + pulse * 0.3 + mouseInfluence * 0.4})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = depth * (1 + pulse * 0.4 + mouseInfluence * 0.5) * (2 + magicLevel * 0.5);
      ctx.shadowColor = `rgba(0, 255, 255, ${0.8 + magicLevel * 0.2})`;
      ctx.shadowBlur = 15 + mouseInfluence * 10 + magicLevel * 5;
      
      // Dodatkowy efekt poświaty
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2 + mouseInfluence * 0.3));
      ctx.strokeStyle = `hsla(${baseHue}, 100%, 90%, ${0.3 + pulse * 0.2 + mouseInfluence * 0.3 + magicLevel * 0.1})`;
      ctx.lineWidth = depth * (4 + magicLevel);
      ctx.stroke();

      // Magiczny pierścień
      if (magicLevel > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${baseHue + 180}, 100%, 70%, ${0.3 + pulse * 0.2 + magicLevel * 0.1})`;
        ctx.lineWidth = 2 + magicLevel;
        ctx.stroke();
      }
    } else if (isLight) {
      // Efekt strumienia światła
      const gradient = ctx.createLinearGradient(0, 0, 0, -size);
      gradient.addColorStop(0, `hsla(160, 100%, 90%, ${0.95 + pulse * 0.05})`);
      gradient.addColorStop(0.3, `hsla(200, 100%, 90%, ${0.85 + pulse * 0.15})`);
      gradient.addColorStop(0.6, `hsla(240, 100%, 90%, ${0.75 + pulse * 0.25})`);
      gradient.addColorStop(1, `hsla(280, 100%, 90%, ${0.65 + pulse * 0.35})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = depth * (1 + pulse * 0.4) * 2;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 20;
      
      // Dodatkowy efekt poświaty
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size * (1 + pulse * 0.2));
      ctx.strokeStyle = `hsla(160, 100%, 95%, ${0.4 + pulse * 0.2})`;
      ctx.lineWidth = depth * 4;
      ctx.stroke();
    } else if (isInner) {
      // Perłowy kolor dla wewnętrznego fraktalu
      ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.6 + pulse * 0.2})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1) * 0.8;
    } else {
      // Kolorowy kolor dla zewnętrznego fraktalu
      ctx.strokeStyle = `hsla(${(depth * 30) % 360}, 70%, 50%, ${0.8 + pulse * 0.2})`;
      ctx.lineWidth = depth * (1 + pulse * 0.1);
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
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time = Date.now() * 0.001;
      const rotation = time * BEAT_PER_SECOND * 0.5;
      const pulse = Math.sin(time * BEAT_PER_SECOND * 2);
      const lightPulse = Math.sin(time * BEAT_PER_SECOND);

      // Zwiększ poziom magii w czasie
      if (groguMode && magicLevel < 3) {
        setMagicLevel(prev => Math.min(3, prev + 0.01));
      }
      
      // Rysuj zewnętrzny fraktal
      drawFractal(ctx, {
        depth: 8,
        size: 100,
        angle: -Math.PI / 2,
        x: canvas.width / 2,
        y: canvas.height / 2 + pulse * 20,
        rotation: rotation,
        pulse: pulse,
        time
      });

      // Rysuj wewnętrzny fraktal
      drawFractal(ctx, {
        depth: 6,
        size: 50,
        angle: -Math.PI / 2,
        x: canvas.width / 2,
        y: canvas.height / 2 + pulse * 10,
        rotation: -rotation * 1.5,
        pulse: pulse,
        isInner: true,
        time
      });

      // Rysuj fraktal światła
      drawFractal(ctx, {
        depth: 7,
        size: 75,
        angle: -Math.PI / 2,
        x: canvas.width / 2,
        y: canvas.height / 2 + lightPulse * 15,
        rotation: rotation * 0.8,
        pulse: lightPulse,
        isLight: true,
        time
      });

      // Rysuj fraktal Grogu
      if (groguMode) {
        drawFractal(ctx, {
          depth: 5,
          size: 60,
          angle: -Math.PI / 2,
          x: canvas.width / 2,
          y: canvas.height / 2 + lightPulse * 10,
          rotation: rotation * 1.2,
          pulse: lightPulse,
          isGrogu: true,
          mouseX: mousePos.x,
          mouseY: mousePos.y,
          magicLevel,
          time
        });
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [groguMode, mousePos, magicLevel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-[400px] rounded-lg overflow-hidden"
      style={{ background: 'transparent' }}
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
      <div className="absolute bottom-4 right-4 text-xs text-white/50">
        {groguMode ? `✨ Tryb Grogu Aktywny (Poziom Magii: ${Math.floor(magicLevel * 100)}%)` : 'Kliknij, aby aktywować tryb Grogu'}
      </div>
    </motion.div>
  );
};

export default FractalMemories; 