import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';

interface StableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  autoComplete?: string;
}

export interface StableInputRef {
  focus: () => void;
  blur: () => void;
  getValue: () => string;
}

const StableInput = React.memo(forwardRef<StableInputRef, StableInputProps>(({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  id,
  autoComplete
}, ref) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocusedRef = useRef(false);

  // Expose focus and blur methods
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    blur: () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    getValue: () => internalValue
  }));

  // Update internal value when external value changes (only when not focused)
  useEffect(() => {
    if (!isFocusedRef.current) {
      setInternalValue(value);
    }
  }, [value]);

  // Handle input change - completely isolated
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    // Use setTimeout to prevent blocking the input
    setTimeout(() => {
      onChange(newValue);
    }, 0);
  }, [onChange]);

  // Handle focus
  const handleFocus = useCallback(() => {
    isFocusedRef.current = true;
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    isFocusedRef.current = false;
    if (internalValue !== value) {
      setInternalValue(value);
    }
  }, [internalValue, value]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      className={className}
    />
  );
}));

StableInput.displayName = 'StableInput';

export default StableInput;
