import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Github, Linkedin, Mail, Download, ArrowUpRight, Sparkles, Brain, Code2,
  Database, Cpu, GraduationCap, Award, Trophy, Heart, Briefcase, MapPin,
  Send, ExternalLink, FileText, Layers, Zap, Eye, Rocket,
} from "lucide-react";
import akshayaPhoto from "@/assets/akshaya.jpg";

/* ---------- helpers ---------- */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - (r.left + r.width / 2)) * strength);
      y.set((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { x.set(0); y.set(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength, x, y]);
  return { ref, sx, sy };
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now(); const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Typewriter({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0); const [s, setS] = useState(""); const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[i % phrases.length];
    const t = setTimeout(() => {
      if (!del) {
        setS(cur.slice(0, s.length + 1));
        if (s.length + 1 === cur.length) setTimeout(() => setDel(true), 1400);
      } else {
        setS(cur.slice(0, s.length - 1));
        if (s.length - 1 === 0) { setDel(false); setI(i + 1); }
      }
    }, del ? 35 : 70);
    return () => clearTimeout(t);
  }, [s, del, i, phrases]);
  return (
    <span className="font-mono">
      {s}<span className="inline-block w-[2px] h-[1em] bg-[var(--neon)] ml-1 align-middle animate-pulse" />
    </span>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-14"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--neon)]">{kicker}</p>
      <h2 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
        <span className="gradient-text">{title}</span>
      </h2>
    </motion.div>
  );
}

/* ---------- Magnetic button ---------- */
function MagneticButton({
  children, href, onClick, variant = "primary",
}: { children: React.ReactNode; href?: string; onClick?: () => void; variant?: "primary" | "ghost" }) {
  const { ref, sx, sy } = useMagnetic(0.3);
  const cls =
    variant === "primary"
      ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-[0_8px_30px_oklch(0.72_0.2_250/40%)] hover:shadow-[0_8px_40px_oklch(0.68_0.25_300/60%)]"
      : "glass text-foreground hover:bg-white/10";
  const inner = (
    <motion.div ref={ref} data-magnetic style={{ x: sx, y: sy }}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-shadow ${cls}`}>
      {children}
    </motion.div>
  );
  if (href) return <a href={href} target="_blank" rel="noreferrer">{inner}</a>;
  return <button onClick={onClick}>{inner}</button>;
}

/* ---------- NAV ---------- */
function Nav() {
  const links = [
    ["About", "about"], ["Skills", "skills"], ["Stack", "stack"],
    ["Projects", "projects"], ["Experience", "experience"], ["Contact", "contact"],
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 ${scrolled ? "glass-strong" : ""} rounded-full transition-all ${scrolled ? "py-2 px-4" : ""}`}>
        <a href="#hero" className="flex items-center gap-2 font-mono text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-xs font-bold text-white">AP</span>
          <span className="hidden sm:inline">akshaya.ai</span>
        </a>
        <nav className="hidden gap-1 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={`#${h}`} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">{l}</a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_oklch(0.72_0.2_250/50%)]">
            Let's talk <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </motion.header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28">
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--neon)]" />
          </span>
          Available for AI Engineering roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
        >
          <span className="block">Akshaya</span>
          <span className="gradient-text">Parella</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-6 text-lg md:text-2xl text-muted-foreground h-8"
        >
          <Typewriter phrases={[
            "AI Engineer.",
            "Deep Learning Researcher.",
            "Computer Vision Specialist.",
            "Building intelligent systems.",
          ]} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
        >
          I design and ship production-grade AI — from CNN-powered medical diagnostics
          to enterprise workflow automation. Obsessed with the seam where research meets product.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="#projects"><Sparkles className="h-4 w-4" /> View Projects</MagneticButton>
          <MagneticButton variant="ghost" href="/resume.pdf"><Download className="h-4 w-4" /> Download Resume</MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-12 flex justify-center gap-4"
        >
          {[
            { Icon: Github, href: "https://github.com/" },
            { Icon: Linkedin, href: "https://linkedin.com/" },
            { Icon: Mail, href: "mailto:akshaya@example.com" },
          ].map(({ Icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer"
               className="grid h-11 w-11 place-items-center rounded-full glass transition-all hover:scale-110 hover:border-[var(--primary)]">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground"
      >
        scroll ↓
      </motion.div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
function About() {
  const stats = [
    { n: 4, s: "+", label: "Years coding" },
    { n: 12, s: "+", label: "Projects shipped" },
    { n: 8, s: "+", label: "Certifications" },
    { n: 100, s: "%", label: "Caffeine driven" },
  ];
  return (
    <Section id="about">
      <SectionTitle kicker="01 / About" title="The engineer behind the models." />
      <div className="grid gap-10 md:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="md:col-span-3 space-y-5 text-lg text-muted-foreground leading-relaxed"
        >
          <p>
            I'm <span className="text-foreground font-semibold">Akshaya Parella</span> — an aspiring AI Engineer
            fascinated by how neural networks learn to see, reason, and decide. My work lives at the intersection of
            <span className="text-[var(--neon)]"> deep learning</span>,
            <span className="text-[var(--violet)]"> computer vision</span>, and
            real-world product engineering.
          </p>
          <p>
            From training CNNs to detect diabetic retinopathy with Grad-CAM explainability,
            to architecting Pega-powered enterprise workflows, I love building systems that are
            both intelligent and unmistakably useful.
          </p>
          <p className="flex items-center gap-2 text-sm font-mono"><MapPin className="h-4 w-4 text-[var(--neon)]" /> India · open to remote</p>
        </motion.div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {stats.map((st, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass p-6 hover:border-[var(--primary)] transition-colors"
            >
              <div className="text-3xl font-bold gradient-text"><Counter to={st.n} suffix={st.s} /></div>
              <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">{st.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- SKILLS ---------- */
function Skills() {
  const skills = [
    { name: "Deep Learning / CNNs", level: 92, Icon: Brain },
    { name: "Python & TensorFlow", level: 95, Icon: Code2 },
    { name: "Computer Vision (OpenCV)", level: 88, Icon: Eye },
    { name: "Data Engineering", level: 80, Icon: Database },
    { name: "Pega Platform / BPM", level: 85, Icon: Layers },
    { name: "Streamlit / FastAPI", level: 87, Icon: Zap },
  ];
  return (
    <Section id="skills">
      <SectionTitle kicker="02 / Skills" title="Things I'm dangerously good at." />
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((sk, i) => (
          <motion.div key={sk.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass p-6 group hover:border-[var(--primary)] transition-all"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)]/30 to-[var(--accent)]/30">
                  <sk.Icon className="h-5 w-5 text-[var(--neon)]" />
                </div>
                <span className="font-medium">{sk.name}</span>
              </div>
              <span className="font-mono text-sm text-muted-foreground">{sk.level}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }} whileInView={{ width: `${sk.level}%` }}
                viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-[0_0_12px_oklch(0.72_0.2_250/80%)]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- TECH STACK ---------- */
function TechStack() {
  const stack = [
    { name: "Python", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "TensorFlow", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
    { name: "PyTorch", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
    { name: "OpenCV", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
    { name: "Keras", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg" },
    { name: "NumPy", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
    { name: "Pandas", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
    { name: "Streamlit", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg" },
    { name: "Flask", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
    { name: "Docker", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "VSCode", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Jupyter", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
    { name: "Java", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "MySQL", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  ];
  return (
    <Section id="stack">
      <SectionTitle kicker="03 / Tech Stack" title="My everyday toolbox." />
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {stack.map((t, i) => (
          <motion.div key={t.name}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }}
            whileHover={{ y: -6, scale: 1.08 }}
            className="glass aspect-square flex flex-col items-center justify-center gap-2 group hover:border-[var(--primary)] hover:shadow-[0_0_30px_oklch(0.72_0.2_250/40%)] transition-all"
          >
            <img src={t.url} alt={t.name} className="h-10 w-10 transition-transform group-hover:scale-110" loading="lazy" />
            <span className="text-[10px] font-mono text-muted-foreground">{t.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- EDUCATION ---------- */
function Education() {
  const items = [
    { year: "2022 – 2026", title: "B.Tech in Computer Science (AI & ML)", place: "University · Specializing in AI", note: "Focus on deep learning, CV, and applied ML systems." },
    { year: "2020 – 2022", title: "Intermediate / Higher Secondary", place: "MPC Stream", note: "Foundations in mathematics & programming." },
    { year: "2020", title: "Secondary Schooling", place: "Distinction", note: "Early start with computers and problem solving." },
  ];
  return (
    <Section id="education">
      <SectionTitle kicker="04 / Education" title="The academic path." />
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--primary)]/50 to-transparent" />
        {items.map((it, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }}
            className={`relative mb-12 md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
              <div className="glass p-6 inline-block text-left">
                <div className="font-mono text-xs text-[var(--neon)]">{it.year}</div>
                <h3 className="mt-1 text-xl font-semibold">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.place}</p>
                <p className="mt-3 text-sm">{it.note}</p>
              </div>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-[0_0_20px_oklch(0.72_0.2_250/80%)] ring-4 ring-background" />
            </div>
            <div className="hidden md:block" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CERTIFICATIONS ---------- */
function Certifications() {
  const certs = [
    "TensorFlow Developer Certificate",
    "Deep Learning Specialization — Coursera",
    "Pega Certified System Architect",
    "Google Cloud — Intro to ML",
    "IBM AI Engineering Professional",
    "Microsoft AI Fundamentals (AI-900)",
  ];
  return (
    <Section id="certifications">
      <SectionTitle kicker="05 / Certifications" title="Receipts for the work." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certs.map((c, i) => (
          <motion.div key={c}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass p-5 flex items-start gap-3 hover:border-[var(--accent)] transition-colors"
          >
            <Award className="h-5 w-5 text-[var(--neon)] shrink-0 mt-0.5" />
            <span className="text-sm">{c}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- PROJECTS ---------- */
function ProjectCard({ project, i }: { project: typeof projects[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 14 });
  const sry = useSpring(ry, { stiffness: 150, damping: 14 });
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 14); rx.set(-py * 14);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: i * 0.1 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="glass-strong overflow-hidden group relative"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
             style={{ background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), oklch(0.72 0.2 250 / 12%), transparent 40%)" }} />
        <div className="relative aspect-video overflow-hidden border-b border-white/10">
          <div className="absolute inset-0" style={{ background: project.bg }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <project.Icon className="h-24 w-24 text-white/30" />
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full glass px-3 py-1 text-[10px] font-mono uppercase tracking-wider">{project.tag}</span>
          </div>
        </div>
        <div className="p-7" style={{ transform: "translateZ(40px)" }}>
          <h3 className="text-2xl font-semibold">{project.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map(t => (
              <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">{t}</span>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--neon)] hover:text-[var(--violet)] transition-colors">
              <Github className="h-4 w-4" /> Code
            </a>
            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--neon)] hover:text-[var(--violet)] transition-colors">
              <ExternalLink className="h-4 w-4" /> Live
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const projects = [
  {
    title: "Diabetic Retinopathy — AI Diagnostic System",
    tag: "Deep Learning",
    desc: "Automated detection and severity classification of diabetic retinopathy from retinal fundus images. CNN backbone with UCLAHE preprocessing and Grad-CAM visualization for explainable, clinician-friendly predictions — deployed via Streamlit.",
    tech: ["CNN", "TensorFlow", "OpenCV", "Streamlit", "Grad-CAM", "UCLAHE"],
    Icon: Eye,
    bg: "linear-gradient(135deg, oklch(0.3 0.18 250), oklch(0.25 0.22 305))",
  },
  {
    title: "GiftStore — Enterprise Workflow Application",
    tag: "Pega · BPM",
    desc: "End-to-end gift ordering & fulfillment platform built on Pega. Case management, data modeling, automated workflows and SLA-driven routing — turning a manual ordering process into a streamlined enterprise flow.",
    tech: ["Pega Platform", "Case Management", "Data Modeling", "Workflow Automation"],
    Icon: Layers,
    bg: "linear-gradient(135deg, oklch(0.28 0.2 300), oklch(0.32 0.18 220))",
  },
];

function Projects() {
  return (
    <Section id="projects">
      <SectionTitle kicker="06 / Featured Projects" title="Things I've actually shipped." />
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => <ProjectCard key={p.title} project={p} i={i} />)}
      </div>
    </Section>
  );
}

/* ---------- EXPERIENCE ---------- */
function Experience() {
  const exp = [
    { role: "AI Engineering Intern (Training)", org: "Deep Learning Bootcamp", date: "2024", desc: "Hands-on CNN, RNN and transformer model training; built and deployed multiple end-to-end CV pipelines." },
    { role: "Pega Systems Trainee", org: "Pega Academy", date: "2024", desc: "BPM, case design, decisioning and workflow automation across real enterprise scenarios." },
    { role: "ML Research Project", org: "University Capstone", date: "2024 – 2025", desc: "Led the Diabetic Retinopathy classification project — model architecture, training, explainability and deployment." },
  ];
  return (
    <Section id="experience">
      <SectionTitle kicker="07 / Experience & Training" title="Where I've sharpened the craft." />
      <div className="grid gap-5">
        {exp.map((e, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass p-6 md:p-7 grid gap-4 md:grid-cols-[160px_1fr_auto] items-start hover:border-[var(--primary)] transition-colors"
          >
            <div className="font-mono text-xs text-[var(--neon)]">{e.date}</div>
            <div>
              <h3 className="text-lg font-semibold">{e.role}</h3>
              <p className="text-sm text-muted-foreground">{e.org}</p>
              <p className="mt-2 text-sm">{e.desc}</p>
            </div>
            <Briefcase className="h-5 w-5 text-muted-foreground hidden md:block" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- ACHIEVEMENTS + INTERESTS ---------- */
function Achievements() {
  const items = [
    { Icon: Trophy, title: "Hackathon Finalist", desc: "Recognized for an AI-powered medical imaging prototype." },
    { Icon: Award, title: "Top Performer", desc: "Distinction across core ML & data structures coursework." },
    { Icon: Sparkles, title: "Open Source", desc: "Active GitHub contributions to CV & ML utilities." },
    { Icon: GraduationCap, title: "Workshops Led", desc: "Conducted peer sessions on TensorFlow and OpenCV." },
  ];
  return (
    <Section id="achievements">
      <SectionTitle kicker="08 / Achievements" title="Highlights & wins." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div key={it.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass p-6 hover:border-[var(--accent)] transition-colors"
          >
            <it.Icon className="h-6 w-6 text-[var(--neon)]" />
            <h3 className="mt-3 font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Interests() {
  const tags = ["Generative AI", "Computer Vision", "Medical AI", "Edge ML", "Robotics", "Philosophy of Mind", "Reading", "Astronomy", "UI Design", "Chess"];
  return (
    <Section id="interests">
      <SectionTitle kicker="09 / Interests" title="What fuels the curiosity." />
      <div className="flex flex-wrap gap-3">
        {tags.map((t, i) => (
          <motion.span key={t}
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="glass px-5 py-2.5 text-sm hover:border-[var(--primary)] transition-colors inline-flex items-center gap-2"
          >
            <Heart className="h-3.5 w-3.5 text-[var(--violet)]" /> {t}
          </motion.span>
        ))}
      </div>
    </Section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  return (
    <Section id="contact">
      <SectionTitle kicker="10 / Contact" title="Let's build something intelligent." />
      <div className="glass-strong p-8 md:p-14 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold">
            Have an idea, role, or research collab? <span className="gradient-text">I'm listening.</span>
          </h3>
          <p className="mt-4 text-muted-foreground">
            The fastest way to reach me is email. I usually reply within 24 hours.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a href="mailto:akshaya@example.com" className="inline-flex items-center gap-3 text-foreground hover:text-[var(--neon)] transition-colors">
              <Mail className="h-5 w-5" /> akshaya@example.com
            </a>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-foreground hover:text-[var(--neon)] transition-colors">
              <Github className="h-5 w-5" /> github.com/akshayaparella
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-foreground hover:text-[var(--neon)] transition-colors">
              <Linkedin className="h-5 w-5" /> linkedin.com/in/akshayaparella
            </a>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:akshaya@example.com`; }}
          className="space-y-4"
        >
          <input required placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
          <input required type="email" placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
          <textarea required rows={5} placeholder="Tell me about it…"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors resize-none" />
          <MagneticButton><Send className="h-4 w-4" /> Send message</MagneticButton>
        </form>
      </div>

      <div className="mt-12 glass p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-[var(--neon)]" />
          <div>
            <h4 className="font-semibold">Prefer the long version?</h4>
            <p className="text-sm text-muted-foreground">Download the full résumé as PDF.</p>
          </div>
        </div>
        <MagneticButton href="/resume.pdf"><Download className="h-4 w-4" /> Download Resume</MagneticButton>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Akshaya Parella. Engineered with curiosity.</p>
        <p className="font-mono text-xs flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5" /> Built with React · Framer Motion · Lenis
        </p>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <TechStack />
      <Education />
      <Certifications />
      <Projects />
      <Experience />
      <Achievements />
      <Interests />
      <Contact />
      <Footer />
    </main>
  );
}
