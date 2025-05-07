import { PiggyBankIcon as Piggy } from "lucide-react";

export function Logo({ variant = "default", className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Piggy className={`h-11 w-11 ${variant === "default" ? "text-primary" : "text-secondary"}`} />
      <span className={`text-2xl font-bold ${variant === "default" ? "text-primary" : "text-secondary"}`}>
        Piggy AI
      </span>
    </div>
  );
}
