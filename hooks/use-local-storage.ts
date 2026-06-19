// hooks/use-local-storage.ts v3.2 — 使用 useSyncExternalStore 避免 React 19 set-state-in-effect 问题
import * as React from 'react';

/**
 * SSR-safe localStorage Hook。
 * - 服务器渲染：始终返回 initialValue，避免 hydration mismatch。
 * - 客户端：通过 useSyncExternalStore 读取并订阅 storage 变化。
 * - 捕获 QuotaExceededError / SecurityError，避免隐私模式下崩溃。
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [value: T, setValue: (value: T | ((val: T) => T)) => void] {
  // 订阅 storage 事件（跨 Tab 同步）
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined') return () => {};
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) onStoreChange();
      };
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    },
    [key]
  );

  // 从 localStorage 读取当前值
  const getSnapshot = React.useCallback((): string => {
    if (typeof window === 'undefined') return '__SSR__';
    try {
      return window.localStorage.getItem(key) ?? '__NONE__';
    } catch {
      return '__SSR__';
    }
  }, [key]);

  // SSR 快照
  const getServerSnapshot = React.useCallback((): string => '__SSR__', []);

  const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 解析快照值为真实类型
  const value = React.useMemo<T>(() => {
    if (snapshot === '__SSR__' || snapshot === '__NONE__') return initialValue;
    try {
      return JSON.parse(snapshot) as T;
    } catch {
      return initialValue;
    }
  }, [snapshot, initialValue]);

  // setter：更新 localStorage，这会触发同一 Tab 的 storage 事件回调到 snapshot 读取
  const setValue = React.useCallback(
    (newVal: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') return;
      try {
        const current = (() => {
          if (snapshot === '__SSR__' || snapshot === '__NONE__') return initialValue;
          try {
            return JSON.parse(snapshot) as T;
          } catch {
            return initialValue;
          }
        })();
        const next = newVal instanceof Function ? (newVal as (v: T) => T)(current) : newVal;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (writeErr) {
          if (typeof console !== 'undefined') {
            console.warn(`[useLocalStorage] failed to write key "${key}":`, writeErr);
          }
        }
      } catch (err) {
        if (typeof console !== 'undefined') {
          console.error(`[useLocalStorage] unexpected error writing "${key}":`, err);
        }
      }
    },
    [key, snapshot, initialValue]
  );

  return [value, setValue];
}
