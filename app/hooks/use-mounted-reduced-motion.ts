// app/hooks/use-mounted-reduced-motion.ts v5.7.1 —— 稳定化的 reduced-motion 钩子
//
// 直接使用 motion 的 useReducedMotion() 会在 SSR（返回 null）与开启"减少动效"
// 偏好的客户端（返回 true）首次渲染时产生 DOM 差异，触发 React #418 hydration
// 不匹配（尤其 number-roller / confetti-burst 这类按偏好切换整棵 DOM 树的组件）。
//
// 本钩子用 useSyncExternalStore 区分"是否已挂载"：
//   - 服务端 & 客户端首帧：返回 false（与 SSR 完全一致，无 hydration 报错）
//   - 挂载后：返回真实的 prefers-reduced-motion 偏好
// useSyncExternalStore 正是为"服务端/客户端快照不同"设计，不会触发 set-state-in-effect 报错。
"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

const subscribe = () => () => {};

export function useMountedReducedMotion(): boolean {
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const prefersReduced = useReducedMotion();
  return mounted ? Boolean(prefersReduced) : false;
}

