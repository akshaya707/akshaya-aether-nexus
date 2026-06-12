import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const mxRef = useRef(-100);
  const myRef = useRef(-100);

  const spawnParticles = useCallback((x: number, y: number, count = 14) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const speed = 1.5 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 1.2 + Math.random() * 2.5,
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
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let rx = -100, ry = -100;

    const renderParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= 0.018;
        if (p.life <= 0) return false;

        const alpha = p.life;
        const currentSize = p.size * p.life;

        // Glow
        ctx.shadowBlur = 12 * alpha;
        ctx.shadowColor = "oklch(0.72 0.2 250)";

        // Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.78 0.18 230 / ${alpha})`;
        ctx.fill();

        ctx.shadowBlur = 0;
        return true;
      });
    };

    const tick = () => {
      rx += (mxRef.current - rx) * 0.14;
      ry += (myRef.current - ry) * 0.14;
      if (ringRef.current) {
        const size = hover ? 52 : 36;
        ringRef.current.style.transform = `translate(${rx - size / 2}px, ${ry - size / 2}px)`;
      }
      if (pulseRef.current && hover) {
        pulseRef.current.style.transform = `translate(${mxRef.current - 42}px, ${myRef.current - 42}px)`;
      }
      renderParticles();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const move = (e: MouseEvent) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.closest(
        "a, button, [data-magnetic], input, textarea, [data-cursor-hover], .glass, .glass-strong"
      );
      if (isInteractive) {
        if (!hover) {
          setHover(true);
          spawnParticles(e.clientX, e.clientY, 10);
        }
      } else {
        setHover(false);
      }
    };

    const down = (e: MouseEvent) => {
      setClicking(true);
      spawnParticles(e.clientX, e.clientY, 20);
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

  const ringSize = hover ? 52 : 36;
  const dotSize = clicking ? 10 : hover ? 7 : 5;

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{ width: "100vw", height: "100vh", willChange: "contents" }}
      />
      {/* Core dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full transition-all duration-150"
        style={{
          width: dotSize,
          height: dotSize,
          willChange: "transform",
          backgroundColor: hover ? "oklch(0.68 0.25 300)" : "#ffffff",
          boxShadow: hover
            ? "0 0 24px oklch(0.68 0.25 300), 0 0 48px oklch(0.68 0.25 300 / 50%), 0 0 80px oklch(0.68 0.25 300 / 25%)"
            : "0 0 12px oklch(0.72 0.2 250 / 80%), 0 0 24px oklch(0.72 0.2 250 / 40%)",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full transition-all duration-300 ease-out"
        style={{
          width: ringSize,
          height: ringSize,
          willChange: "transform",
          border: `1.5px solid ${hover ? "oklch(0.68 0.25 300 / 80%)" : "oklch(0.72 0.2 250 / 50%)"}`,
          background: hover
            ? "oklch(0.68 0.25 300 / 10%)"
            : "oklch(0.72 0.2 250 / 5%)",
          transform: "translate(-100px,-100px)",
          boxShadow: hover
            ? `0 0 40px oklch(0.68 0.25 300 / 35%), inset 0 0 30px oklch(0.68 0.25 300 / 8%)`
            : `0 0 25px oklch(0.72 0.2 250 / 25%), inset 0 0 20px oklch(0.72 0.2 250 / 5%)`,
        }}
      />
      {/* Hover pulse ring */}
      <div
        ref={pulseRef}
        className="pointer-events-none fixed left-0 top-0 z-[9996] rounded-full"
        style={{
          width: 84,
          height: 84,
          border: "1px solid oklch(0.68 0.25 300 / 30%)",
          transform: "translate(-200px,-200px)",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.1s linear",
          animation: hover ? "cursor-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" : "none",
        }}
      />
    </>
  );
}
