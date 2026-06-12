import { useEffect, useRef, useCallback } from "react";

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
  const hoverRef = useRef(false);
  const clickingRef = useRef(false);
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
    // Skip on touch / small screens
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let rx = -100, ry = -100;

    const applyHoverStyles = (h: boolean) => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const pulse = pulseRef.current;
      if (dot) {
        dot.style.width = (clickingRef.current ? 10 : h ? 7 : 5) + "px";
        dot.style.height = (clickingRef.current ? 10 : h ? 7 : 5) + "px";
        dot.style.backgroundColor = h ? "oklch(0.68 0.25 300)" : "#ffffff";
        dot.style.boxShadow = h
          ? "0 0 24px oklch(0.68 0.25 300), 0 0 48px oklch(0.68 0.25 300 / 50%), 0 0 80px oklch(0.68 0.25 300 / 25%)"
          : "0 0 12px oklch(0.72 0.2 250 / 80%), 0 0 24px oklch(0.72 0.2 250 / 40%)";
      }
      if (ring) {
        const size = h ? 52 : 36;
        ring.style.width = size + "px";
        ring.style.height = size + "px";
        ring.style.border = `1.5px solid ${h ? "oklch(0.68 0.25 300 / 80%)" : "oklch(0.72 0.2 250 / 50%)"}`;
        ring.style.background = h ? "oklch(0.68 0.25 300 / 10%)" : "oklch(0.72 0.2 250 / 5%)";
        ring.style.boxShadow = h
          ? "0 0 40px oklch(0.68 0.25 300 / 35%), inset 0 0 30px oklch(0.68 0.25 300 / 8%)"
          : "0 0 25px oklch(0.72 0.2 250 / 25%), inset 0 0 20px oklch(0.72 0.2 250 / 5%)";
      }
      if (pulse) {
        pulse.style.opacity = h ? "1" : "0";
        pulse.style.animation = h ? "cursor-ping 1.2s cubic-bezier(0,0,0.2,1) infinite" : "none";
      }
    };
    applyHoverStyles(false);

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
        ctx.shadowBlur = 12 * alpha;
        ctx.shadowColor = "oklch(0.72 0.2 250)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.78 0.18 230 / ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        return true;
      });
    };

    const tick = () => {
      rx += (mxRef.current - rx) * 0.18;
      ry += (myRef.current - ry) * 0.18;
      const ringSize = hoverRef.current ? 52 : 36;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - ringSize / 2}px, ${ry - ringSize / 2}px)`;
      }
      if (pulseRef.current) {
        pulseRef.current.style.transform = `translate(${mxRef.current - 42}px, ${myRef.current - 42}px)`;
      }
      renderParticles();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const move = (e: MouseEvent) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      const dot = dotRef.current;
      if (dot) {
        const s = clickingRef.current ? 10 : hoverRef.current ? 7 : 5;
        dot.style.transform = `translate(${e.clientX - s / 2}px, ${e.clientY - s / 2}px)`;
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = !!t.closest?.(
        "a, button, [data-magnetic], input, textarea, [data-cursor-hover], .glass, .glass-strong"
      );
      if (isInteractive !== hoverRef.current) {
        hoverRef.current = isInteractive;
        applyHoverStyles(isInteractive);
        if (isInteractive) spawnParticles(e.clientX, e.clientY, 10);
      }
    };

    const down = (e: MouseEvent) => {
      clickingRef.current = true;
      applyHoverStyles(hoverRef.current);
      spawnParticles(e.clientX, e.clientY, 20);
    };
    const up = () => {
      clickingRef.current = false;
      applyHoverStyles(hoverRef.current);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
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
  }, [spawnParticles]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9997] hidden md:block"
        style={{ willChange: "contents" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full md:block"
        style={{ width: 5, height: 5, willChange: "transform", transform: "translate(-100px,-100px)" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden rounded-full md:block"
        style={{ width: 36, height: 36, willChange: "transform", transform: "translate(-100px,-100px)" }}
      />
      <div
        ref={pulseRef}
        className="pointer-events-none fixed left-0 top-0 z-[9996] hidden rounded-full md:block"
        style={{
          width: 84,
          height: 84,
          border: "1px solid oklch(0.68 0.25 300 / 30%)",
          transform: "translate(-200px,-200px)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </>
  );
}
