/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-themes to avoid SSR issues
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: () => {} }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock motion/react to avoid animation complexity
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

// Mock Web Audio API
vi.mock("@/hooks/use-sound", () => ({
  useSound: () => ({ play: () => {} }),
}));

// Mock child components to isolate page.tsx a11y tests
vi.mock("@/components/draw/draw-display", () => ({
  DrawDisplay: () => <div data-testid="draw-display-mock" />,
}));
vi.mock("@/components/draw/draw-button", () => ({
  DrawButton: () => <button data-testid="draw-button-mock" />,
}));
vi.mock("@/components/draw/settings-panel", () => ({
  SettingsPanel: () => <div data-testid="settings-panel-mock" />,
}));
vi.mock("@/components/draw/history-list", () => ({
  HistoryList: () => <div data-testid="history-list-mock" />,
}));

import HomePage from "@/page";

describe("HomePage accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does NOT use role=application on root div", () => {
    const { container } = render(<HomePage />);
    const appRoot = container.querySelector('[role="application"]');
    expect(appRoot).toBeNull();
  });

  it("has a skip-to-content link as first focusable element", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<HomePage />);
    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("has main element with id=main-content", () => {
    render(<HomePage />);
    const main = document.querySelector("main");
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("uses dynamic footer info (10 themes, 3 fonts)", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<HomePage />);
    // footerInfo template: "{0} themes · {1} fonts · stored locally"
    expect(screen.getByText(/10 themes · 3 fonts/i)).toBeInTheDocument();
  });

  it("settings SheetTrigger is a real button", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<HomePage />);
    const settingsButton = screen.getByRole("button", { name: /^settings$/i });
    expect(settingsButton.tagName).toBe("BUTTON");
  });
});
