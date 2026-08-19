import { useEffect, useState } from "react";
import { ChevronDown, Clock, MonitorSmartphone, Share2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buildReasons, type MatchResult, type Profile } from "@/lib/matching";
import { buildStoryCard } from "@/lib/share-card";
import { cn } from "@/lib/utils";
import { SpecializationAvatar } from "./SpecializationAvatar";

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, index) => index);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={piece}
          className="animate-confetti absolute top-0 size-2 rounded-sm"
          style={{
            left: `${(piece * 37) % 100}%`,
            backgroundColor: piece % 2 === 0 ? "var(--accent)" : "var(--primary)",
            animationDelay: `${(piece % 8) * 0.12}s`,
            ["--confetti-x" as string]: `${((piece % 5) - 2) * 30}px`,
          }}
        />
      ))}
    </div>
  );
}

export function ResultView({
  ranking,
  profile,
  onContinue,
}: {
  ranking: MatchResult[];
  profile: Profile;
  onContinue: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const top = ranking[0];
  const second = ranking[1];

  useEffect(() => {
    const timeout = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(timeout);
  }, []);

  if (!top) return null;
  const reasons = buildReasons(profile, top);

  const share = async () => {
    try {
      const blob = await buildStoryCard({
        programName: top.program.name,
        affinity: top.affinity,
        tagline: top.program.tagline,
      });
      const file = new File([blob], "mi-especializacion-cun.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Descubre tu Especialización CUN",
          text: `Mi match es ${top.program.name} con ${top.affinity}% de afinidad.`,
        });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mi-especializacion-cun.png";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Descargamos tu tarjeta para que la subas a tu historia.");
    } catch {
      toast.error("No pudimos generar la tarjeta en este dispositivo.");
    }
  };

  return (
    <div className="relative space-y-5">
      {revealed ? <Confetti /> : null}

      <div
        className={cn(
          "rounded-3xl border border-accent/50 bg-card p-6 shadow-soft",
          revealed ? "animate-reveal" : "opacity-0",
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <SpecializationAvatar
            specialization={top.program}
            affinity={revealed ? top.affinity : 0}
            size="lg"
            className="animate-pop"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Tu match es</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight sm:text-3xl">
              {top.program.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{top.program.tagline}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium">Afinidad con tu perfil</p>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-accent-gradient transition-[width] duration-1000"
              style={{ width: revealed ? `${top.affinity}%` : "0%" }}
            />
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="mt-5 flex w-full items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/70"
        >
          Ver más de esta especialización
          <ChevronDown className={cn("size-4 transition-transform", showDetails && "rotate-180")} />
        </button>

        {showDetails ? (
          <div className="animate-step-in mt-4 space-y-4 rounded-2xl border border-border/70 p-4 text-sm">
            <p className="leading-relaxed text-muted-foreground">{top.program.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-accent" /> {top.program.duration}
              </p>
              <p className="flex items-center gap-2">
                <MonitorSmartphone className="size-4 text-accent" /> {top.program.modality}
              </p>
              <p className="flex items-center gap-2">
                <Users className="size-4 text-accent" /> Dirigido a
              </p>
            </div>
            <p className="leading-relaxed text-muted-foreground">{top.program.audience}</p>
            <div>
              <p className="mb-2 font-semibold">Pénsum</p>
              <ul className="space-y-1.5 text-muted-foreground">
                {top.program.curriculum.map((module) => (
                  <li key={module} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {module}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {second ? (
        <div className="rounded-3xl border border-border/70 bg-card/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            También te podría interesar
          </p>
          <div className="mt-2 flex items-center gap-4">
            <SpecializationAvatar specialization={second.program} size="sm" locked />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-snug">{second.program.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{second.program.tagline}</p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-accent">
              {second.affinity}%
            </span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={share}
          className="h-12 rounded-2xl border-accent/50 bg-transparent text-base font-semibold text-accent hover:bg-accent/15 hover:text-accent"
        >
          <Share2 className="size-4" /> Compartir mi resultado
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="h-12 rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
        >
          Recibir el detalle completo
        </Button>
      </div>
    </div>
  );
}
