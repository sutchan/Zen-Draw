/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLanguage } from "../use-language";

describe("useLanguage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns default zh on server snapshot", () => {
    const { result } = renderHook(() => useLanguage());
    // jsdom is client-side; default zh when storage empty
    expect(result.current).toBe("zh");
  });

  it("returns en when localStorage has en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("en");
  });

  it("returns zh when localStorage has zh", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("zh"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });

  it("returns zh fallback for invalid value", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("fr"));
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });

  it("returns zh fallback for malformed JSON", () => {
    window.localStorage.setItem("zendraw-language", "not-json");
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("zh");
  });
});
