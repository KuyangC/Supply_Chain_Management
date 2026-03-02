"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PasswordStrengthProps {
  password: string;
  className?: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

const PasswordStrength = React.forwardRef<
  HTMLDivElement,
  PasswordStrengthProps
>(({ password, className }, ref) => {
  const getStrength = (password: string): StrengthLevel => {
    if (!password) return "weak";

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score <= 3) return "fair";
    if (score <= 4) return "good";
    return "strong";
  };

  const strength = getStrength(password);

  const strengthConfig = {
    weak: {
      label: "Weak",
      color: "bg-red-500",
      textColor: "text-red-600",
      bars: 1,
    },
    fair: {
      label: "Fair",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bars: 2,
    },
    good: {
      label: "Good",
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bars: 3,
    },
    strong: {
      label: "Strong",
      color: "bg-green-500",
      textColor: "text-green-600",
      bars: 4,
    },
  };

  const config = strengthConfig[strength];

  if (!password) {
    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        <div className="flex gap-1 h-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 h-full rounded-full bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("space-y-1", className)}>
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-full rounded-full transition-colors duration-200",
              i <= config.bars ? config.color : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", config.textColor)}>
        Password strength: {config.label}
      </p>
    </div>
  );
});

PasswordStrength.displayName = "PasswordStrength";

export { PasswordStrength };
