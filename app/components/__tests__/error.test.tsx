/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorPage from "@/error";

describe("Error page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders Chinese content by default", () => {
    const error = new Error("test error") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("出了点问题");
  });

  it("renders English content when language is en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test error") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Something Went Wrong");
  });

  it("shows error digest when present", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test") as Error & { digest?: string };
    error.digest = "abc123";
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("does not show digest section when absent", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const error = new Error("test") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(screen.queryByText(/Error ID/)).not.toBeInTheDocument();
  });

  it("calls reset when retry button clicked", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    const reset = vi.fn();
    const error = new Error("test") as Error & { digest?: string };
    render(<ErrorPage error={error} reset={reset} />);
    screen.getByRole("button", { name: /retry/i }).click();
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("logs error to console.error on mount", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("logged error");
    render(<ErrorPage error={error} reset={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith("ZenDraw Error:", error);
    consoleSpy.mockRestore();
  });
});
