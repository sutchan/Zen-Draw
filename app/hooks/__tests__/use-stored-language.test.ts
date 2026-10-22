/// <reference types="vitest/globals" />
import { renderHook, act } from "@testing-library/react";
import { useStoredLanguage } from "../use-stored-language";

const LANG_KEY = "zendraw-language";

describe("useStoredLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("无存储时默认返回 zh", () => {
    const { result } = renderHook(() => useStoredLanguage());
    expect(result.current).toBe("zh");
  });

  it("存储为 en 时返回 en", () => {
    window.localStorage.setItem(LANG_KEY, "en");
    const { result } = renderHook(() => useStoredLanguage());
    expect(result.current).toBe("en");
  });

  it("存储为非法值时回退 zh", () => {
    window.localStorage.setItem(LANG_KEY, "fr");
    const { result } = renderHook(() => useStoredLanguage());
    expect(result.current).toBe("zh");
  });

  it("storage 事件触发后同步最新偏好（跨标签页场景）", () => {
    const { result } = renderHook(() => useStoredLanguage());
    expect(result.current).toBe("zh");

    // 模拟另一标签页把语言改为 en 并触发 storage 事件
    window.localStorage.setItem(LANG_KEY, "en");
    act(() => {
      window.dispatchEvent(new Event("storage"));
    });
    expect(result.current).toBe("en");

    // 再模拟改回 zh
    window.localStorage.setItem(LANG_KEY, "zh");
    act(() => {
      window.dispatchEvent(new Event("storage"));
    });
    expect(result.current).toBe("zh");
  });

  it("unmount 后移除 storage 监听（无泄漏）", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useStoredLanguage());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    removeSpy.mockRestore();
  });
});
