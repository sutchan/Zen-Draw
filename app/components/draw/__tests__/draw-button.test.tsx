/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { DrawButton } from "../draw-button";

describe("DrawButton", () => {
  it("renders correctly when not drawing", () => {
    const { getByRole } = render(
      <DrawButton
        isDrawing={false}
        onStart={() => {}}
        onStop={() => {}}
        onContinue={() => {}}
        status="idle"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders correctly when drawing", () => {
    const { getByRole } = render(
      <DrawButton
        isDrawing={true}
        onStart={() => {}}
        onStop={() => {}}
        onContinue={() => {}}
        status="drawing"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders correctly in result state", () => {
    const { getByRole } = render(
      <DrawButton
        isDrawing={false}
        onStart={() => {}}
        onStop={() => {}}
        onContinue={() => {}}
        status="result"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    // 结果态应展示「继续抽取」文案
    expect(button.textContent).toContain("继续抽取");
  });

  it("calls onStart when clicked while idle", () => {
    const handleStart = vi.fn();
    const { getByRole } = render(
      <DrawButton
        isDrawing={false}
        onStart={handleStart}
        onStop={() => {}}
        onContinue={() => {}}
        status="idle"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    button.click();
    expect(handleStart).toHaveBeenCalledTimes(1);
  });

  it("calls onContinue when clicked in result state", () => {
    const handleContinue = vi.fn();
    const { getByRole } = render(
      <DrawButton
        isDrawing={false}
        onStart={() => {}}
        onStop={() => {}}
        onContinue={handleContinue}
        status="result"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    button.click();
    expect(handleContinue).toHaveBeenCalledTimes(1);
  });

  it("calls onStop when clicked while drawing", () => {
    const handleStop = vi.fn();
    const { getByRole } = render(
      <DrawButton
        isDrawing={true}
        onStart={() => {}}
        onStop={handleStop}
        onContinue={() => {}}
        status="drawing"
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    button.click();
    expect(handleStop).toHaveBeenCalledTimes(1);
  });
});
