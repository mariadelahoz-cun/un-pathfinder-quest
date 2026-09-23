import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { quizSteps } from "@/data/questions";
import type { ScoreVector } from "@/data/specializations";
import { buildProfile, rankSpecializations, type MatchResult, type Profile } from "@/lib/matching";

/**
 * Estado del reto en memoria (React state, sin localStorage).
 * Si el usuario recarga la página el reto empieza de nuevo, por diseño.
 */

export type QuizAnswer = {
  label: string;
  vectors: { vector: ScoreVector; weight?: number }[];
};

export type Stage = "landing" | "quiz" | "processing" | "result" | "lead" | "done";

/** `id` es la fila en `students` (Supabase) que se va completando durante
 * todo el recorrido — ver src/lib/quiz-api.ts. */
export type QuizLead = { id: string; fullName: string; email: string };

type QuizContextValue = {
  stage: Stage;
  setStage: (stage: Stage) => void;
  stepIndex: number;
  totalSteps: number;
  answers: Record<string, QuizAnswer>;
  answerStep: (stepId: string, answer: QuizAnswer) => void;
  next: () => void;
  back: () => void;
  start: () => void;
  restart: () => void;
  profile: Profile;
  ranking: MatchResult[];
  lead: QuizLead | null;
  setLead: (lead: QuizLead) => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [lead, setLead] = useState<QuizLead | null>(null);

  const answerStep = useCallback((stepId: string, answer: QuizAnswer) => {
    setAnswers((current) => ({ ...current, [stepId]: answer }));
  }, []);

  const next = useCallback(() => {
    setStepIndex((current) => {
      if (current >= quizSteps.length - 1) {
        setStage("processing");
        return current;
      }
      return current + 1;
    });
  }, []);

  const back = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const start = useCallback(() => {
    setStage("quiz");
    setStepIndex(0);
  }, []);

  const restart = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setLead(null);
    setStage("landing");
  }, []);

  const profile = useMemo(
    () => buildProfile(Object.values(answers).flatMap((answer) => answer.vectors)),
    [answers],
  );

  const ranking = useMemo(() => rankSpecializations(profile), [profile]);

  const value = useMemo(
    () => ({
      stage,
      setStage,
      stepIndex,
      totalSteps: quizSteps.length,
      answers,
      answerStep,
      next,
      back,
      start,
      restart,
      profile,
      ranking,
      lead,
      setLead,
    }),
    [stage, stepIndex, answers, answerStep, next, back, start, restart, profile, ranking, lead],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz debe usarse dentro de <QuizProvider>");
  return context;
}
