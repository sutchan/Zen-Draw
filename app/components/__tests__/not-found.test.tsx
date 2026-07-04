/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "@/not-found";

describe("NotFound page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders Chinese content by default", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("页面未找到");
  });

  it("renders English content when language is en", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page Not Found");
  });

  it("has a link to home with correct aria-label", () => {
    window.localStorage.setItem("zendraw-language", JSON.stringify("en"));
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /back to home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("uses lucide icon with aria-hidden", () => {
    const { container } = render(<NotFound />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
