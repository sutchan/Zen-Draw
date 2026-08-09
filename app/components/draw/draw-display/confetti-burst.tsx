// components/draw/draw-display/confetti-burst.tsx v5.2.1 —— 揭晓彩屑爆发（canvas 粒子）
"use client";

import * as React from "react";
import { useMountedReducedMotion } from "@/hooks/use-mounted-reduced-motion";
import { secureRandomInt, secureRandomFloat } from "@/lib/utils";

/**
 * ConfettiBurst —— 结果揭晓时的彩色粒子爆发。
 *
 * 设计要点：
 * 1. 上升沿触发（active 由 false→true）：从中心喷射 120+ 粒子，带重力回落、旋转、淡出。
 * 2. 即使 active 很快复位（庆祝态仅 1.2s），爆发也会独立跑完再自清理。
 * 3. 尊重 prefers-reduced-motion：直接不渲染任何粒子，避免眩晕。
 * 4. canvas 按父容器尺寸 + devicePixelRatio 缩放，自清理 RAF 与上下文，无内存泄漏。
 */

const FESTIVE_COLORS = [
  "#FFD166", // 金
  "#EF476F", // 粉红
  "#06D6A0", // 绿
  "#118AB2", // 蓝
  "#F78C6B", // 橙
  "#C792EA", // 紫
  "#82AAFF", // 冰蓝
  "#FF8FA3", // 樱
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  life: number; // 1 → 0
  decay: number;
  shape: "rect" | "circle";
  wobble: number;
  wobbleSpeed: number;
}

function spawnParticles(cx: number, cy: number): Particle[] {
  const count = 130;
  const palette = FESTIVE_COLORS;
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    // 以中心为原点向四周喷射，带向上偏置（更像开香槟）
    const angle = secureRandomFloat(0, Math.PI * 2);
    const speed = secureRandomFloat(6, 15);
    const upwardBias = secureRandomFloat(3, 7);
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - upwardBias,
      size: secureRandomFloat(6, 14),
      color:
        palette[secureRandomInt(palette.length)] ?? "#FFD166",
      rotation: secureRandomFloat(0, Math.PI * 2),
      rotSpeed: secureRandomFloat(-0.2, 0.2),
      life: 1,
      decay: secureRandomFloat(0.008, 0.018),
      shape: secureRandomFloat(0, 1) > 0.7 ? "circle" : "rect",
      wobble: secureRandomFloat(0, Math.PI * 2),
      wobbleSpeed: secureRandomFloat(0.1, 0.25),
    });
  }
  return particles;
}

export function ConfettiBurst({ active }: { active: boolean }) {
  const shouldReduceMotion = useMountedReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const prevActiveRef = React.useRef(false);

  React.useEffect(() => {
    // 无障碍：减少动画偏好下完全不渲染
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 上升沿触发一次爆发
    if (active && !prevActiveRef.current) {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? window.innerWidth;
      const height = parent?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const particles = spawnParticles(width / 2, height / 2);
      const gravity = 0.28;

      const render = () => {
        ctx.clearRect(0, 0, width, height);
        let alive = 0;
        for (const p of particles) {
          if (p.life <= 0) continue;
          alive++;
          p.vy += gravity;
          p.vx *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;
          p.wobble += p.wobbleSpeed;
          p.life -= p.decay;
          const alpha = Math.max(0, Math.min(1, p.life));
          const wobbleX = Math.sin(p.wobble) * 1.5;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x + wobbleX, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          if (p.shape === "rect") {
            const w = p.size;
            const h = p.size * 0.5;
            ctx.fillRect(-w / 2, -h / 2, w, h);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        if (alive > 0) {
          rafRef.current = requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, width, height);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(render);
    }
    prevActiveRef.current = active;
  }, [active, shouldReduceMotion]);

  // 卸载时清理 RAF
  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    />
  );
}

