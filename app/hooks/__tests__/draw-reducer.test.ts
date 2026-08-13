/// <reference types="vitest/globals" />
import { describe, it, expect } from "vitest";
import { createInitialState, drawReducer } from "../draw-reducer";
import { DEFAULT_SETTINGS } from "../draw-helpers";
import type { DrawState, DrawAction } from "../draw-types";

function init(): DrawState {
  return createInitialState(DEFAULT_SETTINGS);
}

function apply(state: DrawState, actions: DrawAction[]): DrawState {
  return actions.reduce((s, a) => drawReducer(s, a), state);
}

describe("createInitialState", () => {
  it("初始化为 idle 且历史为空", () => {
    const s = init();
    expect(s.status).toBe("idle");
    expect(s.history).toEqual([]);
    expect(s.isRolling).toBe(false);
  });
});

describe("drawReducer 设置更新", () => {
  it("更新数值字段", () => {
    const s = apply(init(), [
      { type: "SET_MIN", value: 3 },
      { type: "SET_MAX", value: 9 },
      { type: "SET_COUNT", value: 2 },
      { type: "SET_DIGITS", value: 4 },
    ]);
    expect(s.min).toBe(3);
    expect(s.max).toBe(9);
    expect(s.count).toBe(2);
    expect(s.digits).toBe(4);
  });

  it("更新布尔与文本字段", () => {
    const s = apply(init(), [
      { type: "SET_ALLOW_DUPLICATES", value: false },
      { type: "SET_PREFIX", value: "P" },
      { type: "SET_SUFFIX", value: "S" },
      { type: "SET_LANGUAGE", value: "en" },
    ]);
    expect(s.allowDuplicates).toBe(false);
    expect(s.prefix).toBe("P");
    expect(s.suffix).toBe("S");
    expect(s.language).toBe("en");
  });
});

describe("drawReducer 抽取生命周期", () => {
  it("START_DRAW 进入 drawing 并滚动", () => {
    const s = drawReducer(init(), { type: "START_DRAW" });
    expect(s.status).toBe("drawing");
    expect(s.isRolling).toBe(true);
  });

  it("UPDATE_ROLLING 更新滚动值与当前结果", () => {
    const s = apply(init(), [
      { type: "START_DRAW" },
      { type: "UPDATE_ROLLING", values: ["1", "2"] },
    ]);
    expect(s.rollingValues).toEqual(["1", "2"]);
    expect(s.currentResults).toEqual(["1", "2"]);
  });

  it("FINALIZE_DRAW 写入结果并记录历史", () => {
    const s = apply(init(), [
      { type: "START_DRAW" },
      { type: "FINALIZE_DRAW", results: ["42"] },
    ]);
    expect(s.status).toBe("result");
    expect(s.isRolling).toBe(false);
    expect(s.currentResults).toEqual(["42"]);
    expect(s.history).toHaveLength(1);
    expect(s.history[0]?.results).toEqual(["42"]);
    expect(s.rollingValues).toEqual([]);
  });

  it("CANCEL 回到 idle 并清空滚动", () => {
    const s = apply(init(), [
      { type: "START_DRAW" },
      { type: "UPDATE_ROLLING", values: ["9"] },
      { type: "CANCEL" },
    ]);
    expect(s.status).toBe("idle");
    expect(s.rollingValues).toEqual([]);
  });

  it("ERROR 记录错误信息", () => {
    const s = drawReducer(init(), { type: "ERROR", message: "坏了" });
    expect(s.status).toBe("error");
    expect(s.errorMessage).toBe("坏了");
  });

  it("DISMISS_ERROR 回到 idle 并清空错误", () => {
    const s = apply(init(), [
      { type: "ERROR", message: "e" },
      { type: "DISMISS_ERROR" },
    ]);
    expect(s.status).toBe("idle");
    expect(s.errorMessage).toBe("");
  });
});

describe("drawReducer 历史与重置", () => {
  it("FINALIZE_DRAW 历史限制在 100 条", () => {
    let s = init();
    for (let i = 0; i < 120; i++) {
      s = drawReducer(s, { type: "FINALIZE_DRAW", results: [`${i}`] });
    }
    expect(s.history).toHaveLength(100);
  });

  it("CLEAR_HISTORY 清空历史", () => {
    const withHistory = drawReducer(init(), { type: "FINALIZE_DRAW", results: ["1"] });
    const s = drawReducer(withHistory, { type: "CLEAR_HISTORY" });
    expect(s.history).toEqual([]);
  });

  it("RESET_SETTINGS 恢复默认但保留语言", () => {
    const changed = apply(init(), [
      { type: "SET_MIN", value: 99 },
      { type: "SET_LANGUAGE", value: "en" },
    ]);
    const s = drawReducer(changed, { type: "RESET_SETTINGS" });
    expect(s.min).toBe(DEFAULT_SETTINGS.min);
    expect(s.language).toBe("en");
  });

  it("未知 action 返回原状态", () => {
    const s = init();
    // @ts-expect-error 故意传入非法的 action 类型以覆盖 reducer 默认分支
    expect(drawReducer(s, { type: "UNKNOWN" })).toBe(s);
  });
});
