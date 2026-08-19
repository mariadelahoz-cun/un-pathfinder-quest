import { useState } from "react";
import { Heart, ThumbsDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CardOption } from "@/data/questions";
import type { QuizAnswer } from "@/context/quiz-context";
import { getIcon } from "./icon-map";
import { cn } from "@/lib/utils";

type Zone = "like" | "dislike";

export function InterestMapStep({
  items,
  onAnswer,
}: {
  items: CardOption[];
  onAnswer: (answer: QuizAnswer) => void;
}) {
  const [placed, setPlaced] = useState<Record<string, Zone>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoverZone, setHoverZone] = useState<Zone | null>(null);
  const [locked, setLocked] = useState(false);

  const pending = items.filter((item) => !placed[item.id]);

  const place = (itemId: string, zone: Zone) => {
    setPlaced((current) => ({ ...current, [itemId]: zone }));
  };

  const confirm = () => {
    if (locked) return;
    setLocked(true);
    const liked = items.filter((item) => placed[item.id] === "like");
    const disliked = items.filter((item) => placed[item.id] === "dislike");
    onAnswer({
      label: `Me gusta: ${liked.map((i) => i.label).join(", ") || "—"} | No me gusta: ${
        disliked.map((i) => i.label).join(", ") || "—"
      }`,
      vectors: [
        // Lo que le gusta suma; lo que no le gusta resta (peso negativo suave).
        ...liked.map((item) => ({ vector: item.vector, weight: 1.2 })),
        ...disliked.map((item) => ({ vector: item.vector, weight: -0.7 })),
      ],
    });
  };

  const zone = (kind: Zone) => {
    const isLike = kind === "like";
    const inZone = items.filter((item) => placed[item.id] === kind);
    const Icon = isLike ? Heart : ThumbsDown;
    return (
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setHoverZone(kind);
        }}
        onDragLeave={() => setHoverZone(null)}
        onDrop={(event) => {
          event.preventDefault();
          setHoverZone(null);
          if (dragging) place(dragging, kind);
          setDragging(null);
        }}
        className={cn(
          "min-h-28 rounded-3xl border-2 border-dashed p-3 transition-colors duration-200",
          isLike ? "border-accent/50 bg-accent/10" : "border-border bg-secondary/60",
          hoverZone === kind && "border-accent bg-accent/20",
        )}
      >
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Icon className={cn("size-4", isLike ? "text-accent" : "text-muted-foreground")} />
          {isLike ? "Me gusta" : "No me gusta"}
        </p>
        <div className="flex flex-wrap gap-2">
          {inZone.map((item) => {
            const ItemIcon = getIcon(item.icon);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setPlaced((current) => {
                    const next = { ...current };
                    delete next[item.id];
                    return next;
                  })
                }
                className="animate-pop flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium"
              >
                <ItemIcon className="size-3.5 text-accent" />
                {item.label}
              </button>
            );
          })}
          {inZone.length === 0 ? (
            <span className="text-xs text-muted-foreground">Suelta temas aquí</span>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-3xl border border-border/70 bg-card p-3">
        {pending.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Ya clasificaste todo. Toca un tema para devolverlo.
          </span>
        ) : (
          pending.map((item) => {
            const ItemIcon = getIcon(item.icon);
            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragging(item.id)}
                onDragEnd={() => setDragging(null)}
                className={cn(
                  "flex cursor-grab items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 active:cursor-grabbing",
                  dragging === item.id && "opacity-50",
                )}
              >
                <ItemIcon className="size-4 text-accent" />
                <span>{item.label}</span>
                <span className="ml-1 flex gap-1">
                  <button
                    type="button"
                    aria-label={`Me gusta ${item.label}`}
                    onClick={() => place(item.id, "like")}
                    className="rounded-full bg-accent/20 p-1 text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Heart className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`No me gusta ${item.label}`}
                    onClick={() => place(item.id, "dislike")}
                    className="rounded-full bg-background/40 p-1 text-muted-foreground transition-colors hover:bg-background"
                  >
                    <ThumbsDown className="size-3.5" />
                  </button>
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {zone("like")}
        {zone("dislike")}
      </div>

      <Button
        type="button"
        onClick={confirm}
        disabled={locked || Object.keys(placed).length === 0}
        className="h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
      >
        Continuar
      </Button>
    </div>
  );
}
