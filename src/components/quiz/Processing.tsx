import { useEffect, useState } from "react";

import { GUIDE_MESSAGES } from "@/data/guide-messages";

const messages = GUIDE_MESSAGES.processing;

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
      <p className="font-display text-3xl text-accent">Armando tu perfil</p>
    </div>
  );
}
