'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  flashTarget: number;
  flashing: boolean;
}

interface MeshBackgroundProps {
  nodeCount?: number;
}

export default function MeshBackground({ nodeCount = 100 }: MeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.15 + 0.05,
      flashTarget: 0.1,
      flashing: false,
    }));

    // Randomly flash a node every 300ms
    const flashInterval = setInterval(() => {
      const n = nodes[Math.floor(Math.random() * nodes.length)];
      if (!n.flashing) {
        n.flashing = true;
        n.flashTarget = 0.7 + Math.random() * 0.15;
      }
    }, 300);

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) { n.vx *= -1; n.x = Math.max(0, Math.min(w, n.x)); }
        if (n.y < 0 || n.y > h) { n.vy *= -1; n.y = Math.max(0, Math.min(h, n.y)); }

        if (n.flashing) {
          if (n.opacity < n.flashTarget) {
            n.opacity += 0.025;
          } else {
            n.opacity -= 0.015;
            if (n.opacity <= 0.08) {
              n.opacity = 0.08 + Math.random() * 0.08;
              n.flashing = false;
              n.flashTarget = 0.1;
            }
          }
        }
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.13;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const bright = n.opacity > 0.4;
        if (bright) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(255,255,255,${n.opacity * 0.8})`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, bright ? 1.5 : 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${n.opacity})`;
        ctx.fill();
        if (bright) ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(flashInterval);
      window.removeEventListener('resize', onResize);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
