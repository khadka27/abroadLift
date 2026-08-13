"use client";

import React, { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export default function OTPInput({
  value,
  onChange,
  isError = false,
  autoFocus = true,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [fallingDigits, setFallingDigits] = useState<string[] | null>(null);

  // Format value into array of 6 digits
  const otpArray = value.split("").slice(0, 6);
  while (otpArray.length < 6) otpArray.push("");

  // Handle wrong OTP error: trigger falling text effect & auto-remove text
  useEffect(() => {
    if (isError && value && value.trim().length > 0) {
      // Capture current digits to perform falling animation
      const digitsToFall = value.split("").slice(0, 6);
      while (digitsToFall.length < 6) digitsToFall.push("");
      setFallingDigits(digitsToFall);

      // Clear main input value and reset falling effect after animation completes
      const timer = setTimeout(() => {
        onChange("");
        setFallingDigits(null);
        inputRefs.current[0]?.focus();
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  // Auto focus the first empty input box on mount
  useEffect(() => {
    if (!autoFocus || disabled) return;
    const timer = setTimeout(() => {
      const firstEmptyIndex = otpArray.findIndex((digit) => digit === "");
      const indexToFocus = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      inputRefs.current[indexToFocus]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [autoFocus, disabled]);

  const handleChange = (index: number, newVal: string) => {
    if (disabled) return;

    // Extract the last entered digit
    const digit = newVal.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const newOtpArray = [...otpArray];
    newOtpArray[index] = digit;
    const finalOtp = newOtpArray.join("");
    onChange(finalOtp);

    // Auto focus next input if digit entered
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (otpArray[index]) {
        // Clear current digit box
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      } else if (index > 0) {
        // Clear previous digit box and focus it
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        onChange(newOtpArray.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      const formEl = (e.target as HTMLElement).closest("form");
      if (formEl) {
        e.preventDefault();
        formEl.requestSubmit();
      }
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;
    const clipboard = e.clipboardData;
    if (!clipboard) return;

    const pastedData = clipboard
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (pastedData.length === 0) return;
    e.preventDefault();

    const newOtpArray = [...otpArray];
    pastedData.forEach((char, i) => {
      if (index + i < 6) {
        newOtpArray[index + i] = char;
      }
    });

    onChange(newOtpArray.join(""));
    const lastFocusedIndex = Math.min(index + pastedData.length, 5);
    inputRefs.current[lastFocusedIndex]?.focus();
  };

  // If container clicked, focus the first empty input or current active box
  const handleContainerClick = () => {
    if (disabled) return;
    const firstEmptyIndex = otpArray.findIndex((digit) => digit === "");
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 5;
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="w-full space-y-2">
      {/* Keyframe animations for shake container & falling text */}
      <style jsx global>{`
        @keyframes otp-shake-anim {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-7px); }
          30%, 60%, 90% { transform: translateX(7px); }
        }

        @keyframes otp-fall-anim {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          50% {
            transform: translateY(20px) scale(0.9);
            opacity: 0.6;
            filter: blur(1px);
          }
          100% {
            transform: translateY(38px) scale(0.6);
            opacity: 0;
            filter: blur(4px);
          }
        }

        .animate-otp-shake {
          animation: otp-shake-anim 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .animate-otp-fall {
          animation: otp-fall-anim 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div
        onClick={handleContainerClick}
        className={`flex justify-between items-center w-full gap-2 sm:gap-3 cursor-pointer py-1 ${
          isError ? "animate-otp-shake" : ""
        }`}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isFocused = focusedIndex === index;
          const hasValue = Boolean(otpArray[index]);

          return (
            <div key={`otp-box-${index}`} className="relative flex-1">
              {/* Falling Digit Animated Overlay on Error */}
              {fallingDigits && fallingDigits[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-otp-fall text-[22px] font-extrabold text-rose-600">
                  {fallingDigits[index]}
                </div>
              )}

              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={fallingDigits ? "" : otpArray[index]}
                disabled={disabled}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(index, e)}
                className={`w-full h-12 sm:h-14 text-center text-[22px] font-extrabold rounded-2xl outline-none transition-all duration-200 select-none caret-transparent ${
                  isError
                    ? "border-2 border-rose-500 bg-rose-50/90 text-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.25)]"
                    : isFocused
                    ? "border-2 border-[#3366FF] bg-blue-50/50 text-[#3366FF] shadow-[0_0_12px_rgba(51,102,255,0.25)] ring-2 ring-[#3366FF]/30 z-10"
                    : hasValue
                    ? "border-2 border-[#3366FF]/60 bg-white text-slate-900 shadow-sm"
                    : "border border-slate-200 bg-[#F8FAFC] text-slate-900 hover:border-slate-300 shadow-sm"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
