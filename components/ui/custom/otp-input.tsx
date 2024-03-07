"use client";
import { useMemo } from "react";
import { Input } from "../input";
import { useRef, useEffect } from "react";

export const RE_DIGIT = new RegExp(/^\d+$/);

export default function OTPInput({
  verifying,
  value,
  valueLength,
  onChange,
}: {
  verifying: boolean;
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
}) {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }

    return items;
  }, [value, valueLength]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value;
    const isValueDigit = RE_DIGIT.test(targetValue);

    if (!isValueDigit && targetValue !== "") {
      return;
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    // only delete digit if next input element has no value
    if (!isValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    targetValue = isValueDigit ? targetValue : " ";
    const newValue =
      value.substring(0, idx) + targetValue + value.substring(idx + 1);
    onChange(newValue);

    if (!isValueDigit) {
      return;
    }

    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    target.setSelectionRange(0, target.value.length);

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {valueItems.map((digit, idx) => {
        return (
          <Input
            ref={idx === 0 ? firstInputRef : undefined}
            disabled={verifying}
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={valueLength}
            autoComplete="one-time-code"
            pattern="\d{1}"
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          />
        );
      })}
    </div>
  );
}
