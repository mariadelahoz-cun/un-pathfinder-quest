import { Lock } from "lucide-react";

import type { Specialization } from "@/data/specializations";
import { cn } from "@/lib/utils";
import { getIcon } from "./icon-map";

const SIZES = {
  sm: { dim: 56, stroke: 4, icon: "size-5" },
  md: { dim: 88, stroke: 6, icon: "size-9" },
  lg: { dim: 148, stroke: 8, icon: "size-16" },
} as const;

export function SpecializationAvatar({
  specialization,
  affinity,
  size = "md",
  locked = false,
  className,
}: {
  specialization: Specialization;
  /** 0-100. Cuando se omite, el anillo se muestra lleno (sin progreso animado). */
  affinity?: number | undefined;
  size?: keyof typeof SIZES;
  /** Muestra una versión bloqueada/en escala de grises con un candado encima. */
  locked?: boolean;
  className?: string | undefined;
}) {
  const Icon = getIcon(specialization.avatarIcon);
  const [from, to] = specialization.avatarColors;
  const { dim, stroke, icon } = SIZES[size];
  const r = dim / 2 - stroke;
  const circumference = 2 * Math.PI * r;
  const progress =
    affinity !== undefined
      ? (Math.min(100, Math.max(0, affinity)) / 100) * circumference
      : circumference;
  const gradientId = `avatar-ring-${specialization.id}-${size}`;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: dim, height: dim }}
    >
      <svg width={dim} height={dim} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={locked ? "var(--muted-foreground)" : `url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          opacity={locked ? 0.35 : 1}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>

      <div
        className={cn(
          "flex items-center justify-center rounded-full shadow-soft transition-all duration-500",
          locked && "grayscale",
        )}
        style={{
          width: dim - stroke * 2.6,
          height: dim - stroke * 2.6,
          backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
          opacity: locked ? 0.5 : 1,
        }}
      >
        <Icon className={cn(icon, "text-white drop-shadow-sm")} strokeWidth={2.2} />
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-[38%] items-center justify-center rounded-full bg-card/90 shadow-soft">
            <Lock className="size-[45%] text-muted-foreground" strokeWidth={2.5} />
          </div>
        </div>
      ) : null}

      {!locked && affinity !== undefined ? (
        <span className="absolute -bottom-1 right-0 rounded-full border border-border/70 bg-card px-2 py-0.5 text-[11px] font-bold text-accent shadow-soft">
          {affinity}%
        </span>
      ) : null}
    </div>
  );
}
