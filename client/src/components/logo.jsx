import { PiggyBankIcon as Piggy } from "lucide-react";

export function Logo({ variant = "default", className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Piggy className={`h-8 w-8 ${variant === "default" ? "text-primary" : "text-secondary"}`} />
      <span className={`text-xl font-bold ${variant === "default" ? "text-primary" : "text-secondary"}`}>
        Piggy AI
      </span>
    </div>
  );
}
