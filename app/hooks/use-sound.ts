// hooks/use-sound.ts —— 使用 Web Audio API 合成音效，无需外部音频文件
"use client";

import * as React from "react";

// ---------------------------------------------------------------------------
// Sound 类型
// ---------------------------------------------------------------------------

export type SoundType = "start" | "tick" | "result" | "error" | "stop";

// ---------------------------------------------------------------------------
// useSound Hook
// ---------------------------------------------------------------------------

export function useSound() {
  const audioCtxRef = React.useRef<AudioContext | null>(null);

  const getContext = React.useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const play = React.useCallback(
    (type: SoundType) => {
      try {
        const ctx = getContext();
        switch (type) {
          case "start":
            playStart(ctx);
            break;
          case "tick":
            playTick(ctx);
            break;
          case "result":
            playResult(ctx);
            break;
          case "error":
            playError(ctx);
            break;
          case "stop":
            playStop(ctx);
            break;
        }
      } catch {
        // 音频不可用时静默失败
      }
    },
    [getContext]
  );

  return { play };
}

// ---------------------------------------------------------------------------
// 音效合成函数
// ---------------------------------------------------------------------------

/** 开始抽取：上升音 */
function playStart(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  osc.start(now);
  osc.stop(now + 0.2);
}

/** 滚动滴答声（每240ms播放一次） */
function playTick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
  osc.start(now);
  osc.stop(now + 0.04);
}

/** 抽取结果：上升琶音（C5 → E5 → G5 → C6） */
function playResult(ctx: AudioContext) {
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const t = now + i * 0.1;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}

/** 错误提示：低沉下降音 */
function playError(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** 停止抽取：下降音 */
function playStop(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(500, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  osc.start(now);
  osc.stop(now + 0.15);
}
