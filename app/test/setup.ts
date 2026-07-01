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
  unobserve() {}
} as any
