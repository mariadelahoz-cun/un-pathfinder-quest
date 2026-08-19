import { useEffect, useState } from "react";

const messages = [
  "Leyendo tus respuestas...",
  "Cruzando tu perfil con los posgrados de CUN...",
  "Ordenando por afinidad...",
  "Listo. Mira esto.",
];

export function Processing({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 900);
    const timeout = setTimeout(onDone, 3600);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onDone]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      <div className="relative flex size-40 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
        <span className="absolute inset-4 rounded-full border-2 border-accent/40" />
        <div className="animate-float-slow flex size-24 items-center justify-center rounded-full bg-accent-gradient text-2xl font-bold text-accent-foreground">
          {Math.min(25 * (index + 1), 100)}%
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-display text-3xl text-accent">Armando tu perfil</p>
        <p key={index} className="animate-step-in text-base text-muted-foreground">
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
