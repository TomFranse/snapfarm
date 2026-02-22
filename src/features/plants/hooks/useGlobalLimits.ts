import { useState, useEffect, useCallback } from "react";
import { DEFAULT_GLOBAL_LIMITS } from "../types/globalLimitsDefaults";
import type { GlobalLimits } from "../types/plants.types";

const STORAGE_KEY = "plants-global-limits";

function loadFromStorage(): GlobalLimits | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GlobalLimits>;
    return { ...DEFAULT_GLOBAL_LIMITS, ...parsed };
  } catch {
    return null;
  }
}

function saveToStorage(limits: GlobalLimits): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limits));
  } catch {
    // ignore storage errors
  }
}

export function useGlobalLimits() {
  const [limits, setLimits] = useState<GlobalLimits>(() => {
    const stored = loadFromStorage();
    return stored ?? DEFAULT_GLOBAL_LIMITS;
  });

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) setLimits(stored);
  }, []);

  const update = useCallback((next: Partial<GlobalLimits>) => {
    setLimits((prev) => {
      const merged = { ...prev, ...next };
      saveToStorage(merged);
      return merged;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setLimits(DEFAULT_GLOBAL_LIMITS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const isCustom = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  })();

  return { limits, update, resetToDefaults, isCustom };
}
