import { Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-reto-cun.png";

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto flex min-h-[85vh] max-w-2xl flex-col items-center justify-center gap-8 py-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
        <Sparkles className="size-3.5" /> Semana CUN
      </span>

      <div className="space-y-4">
        <h1 className="font-display text-5xl leading-[1.05] text-accent sm:text-6xl">
          Descubre tu Especialización CUN
        </h1>
        <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Diez pasos rápidos, entre preguntas y juegos, para ver cuál de nuestras
          especializaciones encaja con tu forma de pensar y con lo que quieres lograr. Al final te
          decimos el porcentaje de afinidad y por qué.
        </p>
      </div>

      <img
        src={heroImage}
        alt="Ilustración de tres personas eligiendo entre tarjetas con íconos de gestión, datos, ideas y estudio"
        width={1024}
        height={1024}
        className="animate-float-slow w-64 sm:w-80"
      />

      <div className="w-full space-y-4">
        <Button
          type="button"
          onClick={onStart}
          className="h-14 w-full rounded-2xl bg-accent-gradient text-lg font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-[1.02] hover:opacity-95"
        >
          Comenzar el reto
        </Button>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" /> Toma menos de 5 minutos
        </p>
      </div>
    </section>
  );
}
