import { useState } from "react";

import type { CardOption } from "@/data/questions";
import type { QuizAnswer } from "@/context/quiz-context";
import { getIcon } from "./icon-map";
import { cn } from "@/lib/utils";

export function CardsStep({
  options,
  onAnswer,
}: {
  options: CardOption[];
  onAnswer: (answer: QuizAnswer) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const choose = (option: CardOption) => {
    if (selected) return;
    setSelected(option.id);
    onAnswer({ label: option.label, vectors: [{ vector: option.vector }] });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = getIcon(option.icon);
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option)}
            className={cn(
              "group flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left transition-all duration-300",
              "hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-soft active:scale-[0.99]",
              isSelected &&
                "animate-pop border-accent bg-accent/15 ring-2 ring-accent/70 ring-offset-2 ring-offset-background",
            )}
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-accent transition-colors duration-300",
                "group-hover:bg-accent/20",
                isSelected && "bg-accent text-accent-foreground",
              )}
            >
              <Icon className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-medium leading-snug">{option.label}</span>
              {option.hint ? (
                <span className="mt-0.5 block text-sm text-muted-foreground">{option.hint}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
