// app/test/setup.ts v5.7.13 —— Vitest 全局测试环境配置
import '@testing-library/jest-dom'
import { expect } from 'vitest'

// 扩展 Vitest 的 expect 以使用 jest-dom 匹配器
expect.extend({})

// Mock Next.js Router
Object.defineProperty(window, 'nextRouter', {
  value: {
    push: () => {},
    prefetch: () => {},
    replace: () => {},
  },
  writable: false,
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
} as any

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
} as any

// localStorage polyfill：本机 Node 26 下 jsdom 未提供 window.localStorage，
// 导致依赖持久化 hooks 的用例（use-stored-language.test.ts）全部失败；
// CI（Node 22）原生可用，此处 polyfill 对其无影响
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = new Map<string, string>()
  const localStorageMock = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value))
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  })
}
