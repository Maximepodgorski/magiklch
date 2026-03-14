"use client";

import { useState, useCallback, useRef, useEffect, useId } from "react";
import { Input, InputField, InputHint } from "@/components/ui/input";
import { parseColor } from "@/lib/color-parser";

const DEBOUNCE_MS = 300;

export function ColorInput({
  defaultValue,
  externalValue,
  onColorChange,
  className,
}: {
  defaultValue?: string;
  externalValue?: string;
  onColorChange: (color: string) => boolean;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const errorId = useId();

  // Show external value when not focused, local value when editing
  const value = isFocused ? localValue : (externalValue || localValue);
  const setValue = setLocalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setValue(raw);

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (!raw.trim()) {
          setError(false);
          return;
        }

        const parsed = parseColor(raw);
        if (!parsed) {
          setError(true);
          return;
        }

        setError(false);
        onColorChange(raw);
      }, DEBOUNCE_MS);
    },
    [onColorChange]
  );

  // Cleanup
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <InputField className={className}>
      <Input
        id="color-input"
        variant={error ? "destructive" : "default"}
        size="md"
        value={value}
        onChange={handleChange}
        onFocus={() => { setIsFocused(true); setLocalValue(value); }}
        onBlur={() => { setIsFocused(false); }}
        placeholder="#3B82F6"
        aria-label="Seed color"
        aria-invalid={error || undefined}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        spellCheck={false}
      />
      {error && (
        <InputHint id={errorId} variant="destructive">
          Invalid color format
        </InputHint>
      )}
    </InputField>
  );
}
