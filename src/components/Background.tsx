import React, { useEffect, useRef } from 'react';

export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 200 + 55}, 255, ${Math.random() * 0.3})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#0B1A2E');
      gradient.addColorStop(1, '#0A0F1F');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blobs
      const time = Date.now() * 0.001;
      ctx.save();
      ctx.filter = 'blur(100px)';
      
      const blob1X = canvas.width * 0.3 + Math.sin(time * 0.5) * 100;
      const blob1Y = canvas.height * 0.3 + Math.cos(time * 0.3) * 100;
      ctx.beginPath();
      ctx.arc(blob1X, blob1Y, 300, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fill();

      const blob2X = canvas.width * 0.7 + Math.cos(time * 0.4) * 150;
      const blob2Y = canvas.height * 0.7 + Math.sin(time * 0.6) * 150;
      ctx.beginPath();
      ctx.arc(blob2X, blob2Y, 400, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(176, 38, 255, 0.1)';
      ctx.fill();

      ctx.restore();

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
};
