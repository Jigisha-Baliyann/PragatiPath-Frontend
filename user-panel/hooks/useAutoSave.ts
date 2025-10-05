import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoSaveOptions {
  delay?: number; // Debounce delay in milliseconds
  onSave: (data: any) => void;
  enabled?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  saveError: string | null;
}

export const useAutoSave = <T>(
  data: T,
  options: UseAutoSaveOptions
): AutoSaveState => {
  const { delay = 1000, onSave, enabled = true } = options;
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isInitialMount = useRef(true);

  // Check if data has changed
  const hasDataChanged = useCallback(() => {
    return JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
  }, [data]);

  // Save function
  const save = useCallback(async () => {
    if (!enabled || !hasDataChanged()) return;

    setIsSaving(true);
    setSaveError(null);
    setHasUnsavedChanges(false);

    try {
      await onSave(data);
      setLastSaved(new Date());
      previousDataRef.current = data;
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Save failed');
      setHasUnsavedChanges(true);
    } finally {
      setIsSaving(false);
    }
  }, [data, enabled, hasDataChanged, onSave]);

  // Debounced save effect
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousDataRef.current = data;
      return;
    }

    // Check if data has changed
    if (!hasDataChanged()) return;

    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save, hasDataChanged]);

  // Manual save function (for immediate save)
  const manualSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveError,
    manualSave, // Expose manual save function
  };
};
