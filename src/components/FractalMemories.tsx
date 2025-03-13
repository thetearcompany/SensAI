import React, { useEffect, useRef } from 'react';
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
}

const BPM = 113;
const BEAT_PER_SECOND = BPM / 60;

const FractalMemories: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawFractal = (ctx: CanvasRenderingContext2D, props: FractalProps) => {
    const { depth, size, angle, x, y, rotation, pulse, isInner, isLight } = props;

    if (depth <= 0 || size < 2) return;

    // Zapisz aktualny stan kontekstu
    ctx.save();
    
    // Przesuń punkt początkowy do środka linii
    ctx.translate(x, y);
    // Obróć o kąt rotacji
    ctx.rotate(rotation);

    // Rysuj główną linię z efektem pulsowania
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size * (1 + pulse * 0.2));
    
    if (isLight) {
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

    // Przywróć stan kontekstu
    ctx.restore();

    // Rekurencyjnie rysuj gałęzie
    drawFractal(ctx, {
      depth: depth - 1,
      size: size * 0.7,
      angle: angle - Math.PI / 4,
      x: x + size * Math.sin(angle),
      y: y - size * Math.cos(angle),
      rotation: rotation + Math.PI / 4,
      pulse: pulse,
      isInner,
      isLight
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
      isLight
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      const rotation = time * BEAT_PER_SECOND * 0.5; // Obroty zsynchronizowane z BPM
      const pulse = Math.sin(time * BEAT_PER_SECOND * 2); // Pulsowanie na każdy takt
      const lightPulse = Math.sin(time * BEAT_PER_SECOND); // Pulsowanie na każde uderzenie
      
      // Rysuj zewnętrzny fraktal
      drawFractal(ctx, {
        depth: 8,
        size: 100,
        angle: -Math.PI / 2,
        x: canvas.width / 2,
        y: canvas.height / 2 + pulse * 20,
        rotation: rotation,
        pulse: pulse
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
        isInner: true
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
        isLight: true
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

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
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  );
};

export default FractalMemories; 