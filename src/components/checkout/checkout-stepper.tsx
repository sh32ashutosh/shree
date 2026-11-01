"use client";

import React from "react";
import { CheckoutStep } from "@/types/checkout";
import { Check, Diamond } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
  canNavigateTo: (step: CheckoutStep) => boolean;
}

const STEPS: { id: CheckoutStep; label: string; number: number }[] = [
  { id: "cart", label: "1. BAG REVIEW", number: 1 },
  { id: "shipping", label: "2. SHIPPING", number: 2 },
  { id: "payment", label: "3. PAYMENT", number: 3 },
  { id: "confirm", label: "4. CONFIRMATION", number: 4 },
];

export function CheckoutStepper({
  currentStep,
  onStepClick,
  canNavigateTo,
}: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav
      aria-label="Checkout Progress"
      className="py-6 px-4 bg-[#FDFBF7] border-b border-[#E8DED1] mb-8"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = idx < currentIndex;
          const isClickable = canNavigateTo(step.id);

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isCurrent
                    ? "text-[#5E131D] font-bold"
                    : isCompleted
                    ? "text-emerald-800 hover:text-[#5E131D]"
                    : "text-[#756B62] opacity-60"
                } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    isCurrent
                      ? "bg-[#5E131D] text-[#FAF6F0]"
                      : isCompleted
                      ? "bg-emerald-800 text-white"
                      : "bg-[#E8DED1] text-[#756B62]"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>

              {/* Diamond textile separator between steps */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-2">
                  <div className="w-full h-px bg-[#E8DED1] relative">
                    <Diamond className="w-2.5 h-2.5 text-[#C5A880] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-[#C5A880]" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
