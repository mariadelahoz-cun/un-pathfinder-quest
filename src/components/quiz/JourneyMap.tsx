import { useEffect, useRef, useState } from "react";

import { useQuiz } from "@/context/quiz-context";
import { quizSteps } from "@/data/questions";
import { GUIDE_MESSAGES } from "@/data/guide-messages";
import { cn } from "@/lib/utils";
import { getIcon } from "./icon-map";
import { GuideAvatar, type GuideMood } from "./GuideAvatar";

/** Ícono del nodo del mapa por cada paso del reto (ver src/data/questions.ts). */
const STEP_NODE_ICON: Record<string, string> = {
  arranque: "sparkles",
  "mapa-intereses": "heart",
  "rueda-crisis": "refresh",
  "rol-equipo": "users",
  "eje-riesgo": "trending",
  objetivo: "target",
};

const NODE_ICONS = [
  "compass",
  ...quizSteps.map((step) => STEP_NODE_ICON[step.id] ?? "sparkles"),
  "sparkles",
  "users",
];

/**
 * Recorrido persistente del reto: una tira de nodos conectados por la que el
 * personaje-guía avanza a medida que se progresa. Se monta una sola vez en
 * RetoPage (no por pantalla), así el personaje viaja sin recargarse y es el
 * único dueño de qué mood/mensaje mostrar en cada etapa.
 */
export function JourneyMap({ reaction }: { reaction: string | null }) {
  const { stage, stepIndex, totalSteps, ranking } = useQuiz();
  const [processingIndex, setProcessingIndex] = useState(0);

  useEffect(() => {
    if (stage !== "processing") {
      setProcessingIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setProcessingIndex((current) => Math.min(current + 1, GUIDE_MESSAGES.processing.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, [stage]);

  const activeIndex =
    stage === "landing"
      ? 0
      : stage === "quiz"
        ? 1 + Math.min(stepIndex, totalSteps - 1)
        : stage === "processing" || stage === "result"
          ? 1 + totalSteps
          : 2 + totalSteps;

  const step = stage === "quiz" ? quizSteps[stepIndex] : undefined;
  const topName = ranking[0]?.program.name;

  let mood: GuideMood = "idle";
  let message: string | undefined;
  if (reaction) {
    mood = "reacting";
    message = reaction;
  } else {
    switch (stage) {
      case "landing":
        mood = "greeting";
        message = GUIDE_MESSAGES.landing;
        break;
      case "quiz":
        mood = "curious";
        message = step ? GUIDE_MESSAGES.stepIntro[step.id] : undefined;
        break;
      case "processing":
        mood = "thinking";
        message = GUIDE_MESSAGES.processing[processingIndex] ?? GUIDE_MESSAGES.processing[0];
        break;
      case "result":
        mood = "celebrating";
        message = topName ? GUIDE_MESSAGES.result(topName) : undefined;
        break;
      case "lead":
        mood = "idle";
        message = GUIDE_MESSAGES.lead;
        break;
      case "done":
        mood = "celebrating";
        message = GUIDE_MESSAGES.leadDone;
        break;
    }
  }

  const characterSize = stage === "landing" || stage === "result" ? "lg" : "sm";
  const travelDurationMs = stage === "processing" ? 3400 : 700;
  const total = NODE_ICONS.length;

  const prevActiveIndex = useRef(activeIndex);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [walking, setWalking] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    if (activeIndex === prevActiveIndex.current) return;
    setDirection(activeIndex > prevActiveIndex.current ? "forward" : "backward");
    prevActiveIndex.current = activeIndex;
    setWalking(true);
    if (walkTimer.current) clearTimeout(walkTimer.current);
    walkTimer.current = setTimeout(() => setWalking(false), travelDurationMs);
  }, [activeIndex, travelDurationMs]);

  useEffect(
    () => () => {
      if (walkTimer.current) clearTimeout(walkTimer.current);
    },
    [],
  );

  return (
    <div className="mb-6">
      <div className="relative h-28 sm:h-32">
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{
            left: `${((activeIndex + 0.5) / total) * 100}%`,
            transform: "translateX(-50%)",
            transition: `left ${travelDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          <GuideAvatar
            mood={mood}
            size={characterSize}
            message={message}
            layout="col"
            walking={walking}
            facing={direction === "backward" ? "left" : "right"}
          />
        </div>
      </div>

      <div className="relative pt-1">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-border/70" />
        <div className="relative flex items-center justify-between">
          {NODE_ICONS.map((iconName, index) => {
            const Icon = getIcon(iconName);
            const done = index < activeIndex;
            const current = index === activeIndex;
            return (
              <span
                key={index}
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-card transition-all duration-300 sm:size-7",
                  current &&
                    "size-8 border-accent bg-accent-gradient text-accent-foreground shadow-glow sm:size-9",
                  done && !current && "border-accent/60 bg-accent/25 text-accent",
                  !done && !current && "border-border/70 text-muted-foreground",
                )}
              >
                <Icon className="size-3 sm:size-3.5" strokeWidth={2.5} />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
