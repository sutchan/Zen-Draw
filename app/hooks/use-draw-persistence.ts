// hooks/use-draw-persistence.ts — localStorage 持久化设置管理
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DEFAULT_SETTINGS } from "./draw-helpers";
import type { HistoryEntry } from "./draw-types";

export function usePersistedSettings() {
  const [persistedMin, setPersistedMin] = useLocalStorage<number>("zendraw-min", DEFAULT_SETTINGS.min);
  const [persistedMax, setPersistedMax] = useLocalStorage<number>("zendraw-max", DEFAULT_SETTINGS.max);
  const [persistedCount, setPersistedCount] = useLocalStorage<number>("zendraw-count", DEFAULT_SETTINGS.count);
  const [persistedAllowDup, setPersistedAllowDup] = useLocalStorage<boolean>("zendraw-duplicates", DEFAULT_SETTINGS.allowDuplicates);
  const [persistedAutoHide, setPersistedAutoHide] = useLocalStorage<boolean>("zendraw-autohide", DEFAULT_SETTINGS.autoHide);
  const [persistedDuration, setPersistedDuration] = useLocalStorage<number>("zendraw-duration", DEFAULT_SETTINGS.duration);
  const [persistedCustomList, setPersistedCustomList] = useLocalStorage<string[]>("zendraw-custom-list", DEFAULT_SETTINGS.customList);
  const [persistedUseCustom, setPersistedUseCustom] = useLocalStorage<boolean>("zendraw-use-custom", DEFAULT_SETTINGS.useCustomList);
  const [persistedDigits, setPersistedDigits] = useLocalStorage<number>("zendraw-digits", DEFAULT_SETTINGS.digits);
  const [persistedPrefix, setPersistedPrefix] = useLocalStorage<string>("zendraw-prefix", DEFAULT_SETTINGS.prefix);
  const [persistedSuffix, setPersistedSuffix] = useLocalStorage<string>("zendraw-suffix", DEFAULT_SETTINGS.suffix);
  const [persistedLanguage, setPersistedLanguage] = useLocalStorage<"zh" | "en">("zendraw-language", DEFAULT_SETTINGS.language);
  const [persistedHistory, setPersistedHistory] = useLocalStorage<HistoryEntry[]>("zendraw-history", []);

  return {
    persistedMin, setPersistedMin,
    persistedMax, setPersistedMax,
    persistedCount, setPersistedCount,
    persistedAllowDup, setPersistedAllowDup,
    persistedAutoHide, setPersistedAutoHide,
    persistedDuration, setPersistedDuration,
    persistedCustomList, setPersistedCustomList,
    persistedUseCustom, setPersistedUseCustom,
    persistedDigits, setPersistedDigits,
    persistedPrefix, setPersistedPrefix,
    persistedSuffix, setPersistedSuffix,
    persistedLanguage, setPersistedLanguage,
    persistedHistory, setPersistedHistory,
  };
}
