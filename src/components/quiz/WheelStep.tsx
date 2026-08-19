import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { QuizStep } from "@/data/questions";
import type { QuizAnswer } from "@/context/quiz-context";
import { getIcon } from "./icon-map";
import { cn } from "@/lib/utils";

type WheelScenarios = Extract<QuizStep, { kind: "wheel" }>["scenarios"];

export function WheelStep({
  scenarios,
  onAnswer,
}: {
  scenarios: WheelScenarios;
  onAnswer: (answer: QuizAnswer) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = () => {
    if (spinning || revealed !== null) return;
    const index = Math.floor(Math.random() * scenarios.length);
    const slice = 360 / scenarios.length;
    const target = 360 * 4 + (360 - (index * slice + slice / 2));
    setSpinning(true);
    setRotation((current) => current + target);
    timer.current = setTimeout(() => {
      setSpinning(false);
      setRevealed(index);
    }, 2600);
  };

  const scenario = revealed !== null ? scenarios[revealed] : null;

  return (
    <div className="space-y-5">
      {revealed === null ? (
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border/70 bg-card p-6">
          <div className="relative">
            {spinning ? (
              <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-accent/30 blur-xl" />
            ) : null}
            <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-accent">▼</span>
            <div
              className="size-48 rounded-full border-4 border-accent/70 shadow-soft sm:size-56"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)",
                background: `conic-gradient(${scenarios
                  .map((_, index) => {
                    const slice = 100 / scenarios.length;
                    const from = index * slice;
                    const to = (index + 1) * slice;
                    const color =
                      index % 2 === 0
                        ? "var(--accent)"
                        : "color-mix(in oklab, var(--primary) 80%, black)";
                    return `${color} ${from}% ${to}%`;
                  })
                  .join(", ")})`,
              }}
            />
          </div>
          <Button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
          >
            {spinning ? "Girando..." : "Girar la rueda"}
          </Button>
        </div>
      ) : (
        <div className="animate-step-in space-y-4">
          <div className="rounded-3xl border border-accent/50 bg-accent/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Te tocó esta situación
            </p>
            <p className="mt-2 text-base leading-relaxed">{scenario?.situation}</p>
          </div>
          <p className="text-sm text-muted-foreground">¿Qué haces?</p>
          <div className="grid gap-3">
            {scenario?.options.map((option) => {
              const Icon = getIcon(option.icon);
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    if (selected) return;
                    setSelected(option.id);
                    if (timer.current) clearTimeout(timer.current);
                    onAnswer({ label: option.label, vectors: [{ vector: option.vector }] });
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-3xl border border-border/70 bg-card p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/70",
                    isSelected &&
                      "animate-pop border-accent bg-accent/15 ring-2 ring-accent/70 ring-offset-2 ring-offset-background",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-accent",
                      isSelected && "bg-accent text-accent-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-base font-medium leading-snug">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
