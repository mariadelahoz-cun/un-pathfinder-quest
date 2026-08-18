import { useState } from "react";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { QuizAnswer } from "@/context/quiz-context";
import type { ScoreVector } from "@/data/specializations";

export function SliderStep({
  leftLabel,
  rightLabel,
  leftVector,
  rightVector,
  onAnswer,
}: {
  leftLabel: string;
  rightLabel: string;
  leftVector: ScoreVector;
  rightVector: ScoreVector;
  onAnswer: (answer: QuizAnswer) => void;
}) {
  const [value, setValue] = useState(50);
  const [locked, setLocked] = useState(false);

  const confirm = () => {
    if (locked) return;
    setLocked(true);
    const right = value / 100;
    const left = 1 - right;
    onAnswer({
      label: `${Math.round(left * 100)}% ${leftLabel} / ${Math.round(right * 100)}% ${rightLabel}`,
      // El deslizador mezcla los dos polos: cada extremo pesa según la posición.
      vectors: [
        { vector: leftVector, weight: left * 1.6 },
        { vector: rightVector, weight: right * 1.6 },
      ],
    });
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5">
      <div className="mb-6 flex items-start justify-between gap-4 text-sm">
        <span className="max-w-[45%] font-medium">{leftLabel}</span>
        <span className="max-w-[45%] text-right font-medium">{rightLabel}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(next) => setValue(next[0] ?? 50)}
        min={0}
        max={100}
        step={1}
        aria-label="Deslizador de perfil"
        className="[&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:border-accent [&_[data-slot=slider-thumb]]:bg-accent [&_[data-slot=slider-track]]:h-2.5 [&_[data-slot=slider-track]]:bg-secondary"
      />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {value < 35
          ? "Bien marcado hacia la izquierda"
          : value > 65
            ? "Bien marcado hacia la derecha"
            : "En el medio, con un pie en cada lado"}
      </div>
      <Button
        type="button"
        onClick={confirm}
        disabled={locked}
        className="mt-5 h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground transition-transform hover:scale-[1.01] hover:opacity-95"
      >
        Confirmar
      </Button>
    </div>
  );
}
