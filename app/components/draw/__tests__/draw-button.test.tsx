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
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls onStart when clicked while idle", () => {
    const handleStart = vi.fn();
    const { getByRole } = render(
      <DrawButton
        isDrawing={false}
        onStart={handleStart}
        onStop={() => {}}
        canDraw={true}
        language="zh"
      />
    );

    const button = getByRole("button");
    button.click();
    expect(handleStart).toHaveBeenCalledTimes(1);
  });
});
