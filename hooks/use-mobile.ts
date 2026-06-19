// hooks/use-mobile.ts v3.2 — 使用 useSyncExternalStore 避免 React 19 set-state-in-effect 问题
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 返回当前视口是否为移动端（< 768px）。
 * - SSR 阶段始终返回 false，避免 hydration mismatch。
 * - 客户端使用 matchMedia + useSyncExternalStore。
 */
export function useIsMobile(): boolean {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => onStoreChange();
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } else {
      // @ts-ignore legacy Safari
      mql.addListener(onChange);
      // @ts-ignore legacy Safari
      return () => mql.removeListener(onChange);
    }
  }, []);

  const getSnapshot = React.useCallback((): boolean => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
  }, []);

  const getServerSnapshot = React.useCallback((): boolean => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
