import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { QuizProvider, useQuiz } from "@/context/quiz-context";
import { quizSteps } from "@/data/questions";
import { GUIDE_MESSAGES } from "@/data/guide-messages";
import { CardsStep } from "@/components/quiz/CardsStep";
import { SliderStep } from "@/components/quiz/SliderStep";
import { InterestMapStep } from "@/components/quiz/InterestMapStep";
import { WheelStep } from "@/components/quiz/WheelStep";
import { Landing } from "@/components/quiz/Landing";
import { Processing } from "@/components/quiz/Processing";
import { ResultView } from "@/components/quiz/ResultView";
import { LeadForm } from "@/components/quiz/LeadForm";
import { JourneyMap } from "@/components/quiz/JourneyMap";
import { saveQuizResult } from "@/lib/quiz-api";

const title = "Descubre tu Especialización CUN | Reto Semana CUN";
const description =
  "En menos de 5 minutos descubre qué especialización de posgrado CUN encaja con tu personalidad y tus metas profesionales. Reto interactivo de la Semana CUN.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <QuizProvider>
      <RetoPage />
    </QuizProvider>
  ),
});

function StepRenderer({ onReact }: { onReact: (message: string | null) => void }) {
  const { stepIndex, answerStep, next, back } = useQuiz();
  const step = quizSteps[stepIndex];
  if (!step) return null;

  const onAnswer = (answer: Parameters<typeof answerStep>[1]) => {
    answerStep(step.id, answer);
    const pool = GUIDE_MESSAGES.reacting;
    onReact(pool[Math.floor(Math.random() * pool.length)] ?? pool[0]);
    setTimeout(() => {
      onReact(null);
      next();
    }, 650);
  };

  return (
    <div className="space-y-6">
      {stepIndex > 0 ? (
        <button
          type="button"
          onClick={back}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Atrás
        </button>
      ) : null}

      <div key={step.id} className="animate-step-in space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{step.prompt}</h2>
          {step.helper ? <p className="text-sm text-muted-foreground">{step.helper}</p> : null}
        </div>

        {step.kind === "cards" ? <CardsStep options={step.options} onAnswer={onAnswer} /> : null}
        {step.kind === "slider" ? (
          <SliderStep
            leftLabel={step.leftLabel}
            rightLabel={step.rightLabel}
            leftVector={step.leftVector}
            rightVector={step.rightVector}
            onAnswer={onAnswer}
          />
        ) : null}
        {step.kind === "interest-map" ? (
          <InterestMapStep items={step.items} onAnswer={onAnswer} />
        ) : null}
        {step.kind === "wheel" ? (
          <WheelStep scenarios={step.scenarios} onAnswer={onAnswer} />
        ) : null}
      </div>
    </div>
  );
}

function RetoPage() {
  const { stage, setStage, restart, ranking, profile, answers, resultId, setResultId, lead } =
    useQuiz();
  const [saving, setSaving] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const finishProcessing = useCallback(() => setStage("result"), [setStage]);

  // Guarda el resultado (sin datos personales) cuando se revela.
  useEffect(() => {
    if (stage !== "result" || resultId || saving) return;
    setSaving(true);
    saveQuizResult(ranking, profile, answers)
      .then((id) => setResultId(id))
      .catch(() => undefined)
      .finally(() => setSaving(false));
  }, [stage, resultId, saving, ranking, profile, answers, setResultId]);

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-4 pb-16 pt-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
          color: "var(--accent)",
        }}
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute -left-24 -top-16 size-72 rounded-full bg-accent opacity-[0.14] blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute -right-20 top-1/3 size-80 rounded-full bg-primary opacity-[0.16] blur-3xl"
        style={{ animationDelay: "-2.5s" }}
        aria-hidden
      />
      <div
        className="animate-float-slow pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-accent opacity-[0.12] blur-3xl"
        style={{ animationDelay: "-4s" }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-xl">
        <JourneyMap reaction={reaction} />

        {stage === "landing" ? <Landing /> : null}
        {stage === "quiz" ? <StepRenderer onReact={setReaction} /> : null}
        {stage === "processing" ? <Processing onDone={finishProcessing} /> : null}
        {stage === "result" ? (
          <ResultView ranking={ranking} profile={profile} onContinue={() => setStage("lead")} />
        ) : null}
        {(stage === "lead" || stage === "done") && lead ? (
          <div className="space-y-5">
            <LeadForm
              lead={lead}
              resultId={resultId}
              specialization={ranking[0]?.program}
              affinity={ranking[0]?.affinity}
              onDone={() => setStage("done")}
            />
            <button
              type="button"
              onClick={restart}
              className="w-full rounded-2xl border border-border/70 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Hacer el reto otra vez
            </button>
          </div>
        ) : null}

        {stage !== "landing" ? null : (
          <p className="mt-10 text-center text-xs text-muted-foreground">
            <Link to="/admin" className="hover:text-foreground">
              Acceso equipo CUN
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
