// hooks/draw-reducer.ts — 抽签状态 Reducer

import type { DrawState, DrawAction, DrawSettings } from "./draw-types";

export function createInitialState(settings: DrawSettings): DrawState {
  return {
    ...settings,
    currentResults: [],
    rollingValues: [],
    status: "idle",
    errorMessage: "",
    history: [],
    isRolling: false,
  };
}

export function drawReducer(state: DrawState, action: DrawAction): DrawState {
  switch (action.type) {
    case "START_DRAW":
      return { ...state, status: "drawing", isRolling: true, errorMessage: "" };
    case "UPDATE_ROLLING":
      return { ...state, rollingValues: action.values, currentResults: action.values };
    case "FINALIZE_DRAW": {
      const newHistory = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        results: action.results,
      };
      return {
        ...state,
        status: "result",
        isRolling: false,
        currentResults: action.results,
        rollingValues: [],
        history: [newHistory, ...state.history].slice(0, 100),
      };
    }
    case "CANCEL":
      return { ...state, status: "idle", isRolling: false, rollingValues: [] };
    case "ERROR":
      return { ...state, status: "error", errorMessage: action.message, isRolling: false };
    case "DISMISS_ERROR":
      return { ...state, status: "idle", errorMessage: "" };
    case "SET_MIN":
      return { ...state, min: action.value };
    case "SET_MAX":
      return { ...state, max: action.value };
    case "SET_COUNT":
      return { ...state, count: action.value };
    case "SET_DURATION":
      return { ...state, duration: action.value };
    case "SET_DIGITS":
      return { ...state, digits: action.value };
    case "SET_PREFIX":
      return { ...state, prefix: action.value };
    case "SET_SUFFIX":
      return { ...state, suffix: action.value };
    case "SET_ALLOW_DUPLICATES":
      return { ...state, allowDuplicates: action.value };
    case "SET_AUTO_HIDE":
      return { ...state, autoHide: action.value };
    case "SET_USE_CUSTOM_LIST":
      return { ...state, useCustomList: action.value };
    case "SET_CUSTOM_LIST":
      return { ...state, customList: action.value };
    case "SET_LANGUAGE":
      return { ...state, language: action.value };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    case "SET_HISTORY":
      return { ...state, history: action.value };
    default:
      return state;
  }
}
