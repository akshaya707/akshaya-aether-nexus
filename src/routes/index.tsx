import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import Portfolio from "@/components/Portfolio";
import { NeuralBackground } from "@/components/NeuralBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akshaya Parella — AI Engineer & Deep Learning Specialist" },
      { name: "description", content: "Portfolio of Akshaya Parella — AI Engineer specializing in deep learning, computer vision, CNN architectures, and intelligent enterprise systems." },
      { name: "keywords", content: "Akshaya Parella, AI Engineer, Deep Learning, Computer Vision, CNN, TensorFlow, Pega, Portfolio" },
      { property: "og:title", content: "Akshaya Parella — AI Engineer" },
      { property: "og:description", content: "Ultra-premium portfolio showcasing AI, deep learning and enterprise workflow projects." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      {mounted && (
        <>
          <SmoothScroll />
          <CustomCursor />
          <NeuralBackground />
        </>
      )}
      <Portfolio />
    </>
  );
}
