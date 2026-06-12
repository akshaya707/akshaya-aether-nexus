import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const mxRef = useRef(0);
  const myRef = useRef(0);

  const spawnParticles = useCallback((x: number, y: number, count = 12) => {
    const colors = [
      "oklch(0.68 0.25 300)",   // neon purple
      "oklch(0.72 0.2 250)",    // neon blue
      "oklch(0.75 0.18 180)",   // neon cyan
      "#ffffff",
    ];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 1 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let rx = 0, ry = 0;

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.02;
        if (p.life <= 0) return false;

        const alpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", ` / ${alpha})`).replace("oklch", "oklch").replace("#", "rgba(").replace(/(..)(..)(..)/, (_, r, g, b) => {
          // Convert hex to rgba fallback
          return `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},${alpha})`;
        });
        // Use a simpler approach for colors
        if (p.color.startsWith("oklch")) {
          ctx.fillStyle = p.color.replace(/\)$/, ` / ${alpha})`);
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        }
        ctx.fill();

        // Glow
        ctx.shadowBlur = 10 * p.life;
        ctx.shadowColor = p.color.startsWith("oklch") ? "oklch(0.72 0.2 250)" : p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });
    };

    const tick = () => {
      rx += (mxRef.current - rx) * 0.15;
      ry += (myRef.current - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - (hover ? 32 : 20)}px, ${ry - (hover ? 32 : 20)}px)`;
      }
      renderParticles();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const move = (e: MouseEvent) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.closest("a, button, [data-magnetic], input, textarea, [data-cursor-hover], .project-card, .skill-bar, .glass, .glass-strong");
      if (isInteractive) {
        if (!hover) {
          setHover(true);
          spawnParticles(e.clientX, e.clientY, 8);
        }
      } else {
        setHover(false);
      }
    };

    const down = (e: MouseEvent) => {
      setClicking(true);
      spawnParticles(e.clientX, e.clientY, 16);
    };

    const up = () => {
      setClicking(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [hover, spawnParticles]);

  const ringSize = hover ? 64 : 40;
  const dotSize = clicking ? 6 : 8;

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{ willChange: "contents" }}
      />
      {/* Core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full transition-[width,height,background-color,box-shadow] duration-150"
        style={{
          width: dotSize,
          height: dotSize,
          willChange: "transform",
          backgroundColor: hover ? "oklch(0.68 0.25 300)" : "#ffffff",
          boxShadow: hover
            ? "0 0 20px oklch(0.68 0.25 300), 0 0 40px oklch(0.68 0.25 300 / 50%)"
            : "0 0 10px oklch(0.72 0.2 250 / 80%), 0 0 20px oklch(0.72 0.2 250 / 40%)",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full transition-[width,height,border-color,background,box-shadow,transform] duration-300 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          willChange: "transform",
          border: `2px solid ${hover ? "oklch(0.68 0.25 300)" : "oklch(0.72 0.2 250 / 60%)"}`,
          background: hover
            ? "oklch(0.68 0.25 300 / 12%)"
            : "oklch(0.72 0.2 250 / 5%)",
          transform: "translate(-100px,-100px)",
          boxShadow: hover
            ? `0 0 30px oklch(0.68 0.25 300 / 40%), inset 0 0 20px oklch(0.68 0.25 300 / 10%)`
            : `0 0 20px oklch(0.72 0.2 250 / 30%), inset 0 0 15px oklch(0.72 0.2 250 / 5%)`,
          backdropFilter: hover ? "blur(2px)" : "none",
        }}
      />
      {/* Pulse ring on hover */}
      {hover && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-[9996] rounded-full animate-ping"
          style={{
            width: ringSize + 20,
            height: ringSize + 20,
            border: "1px solid oklch(0.68 0.25 300 / 40%)",
            transform: `translate(${mxRef.current - (ringSize + 20) / 2}px, ${myRef.current - (ringSize + 20) / 2}px)`,
          }}
        />
      )}
    </>
  );
}
