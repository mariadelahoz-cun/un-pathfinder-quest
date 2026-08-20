import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Sprites CC0 de Kenney ("Toon Characters", kenney.nl) — PNG individuales
// con transparencia real, sin fondo. No requieren canvas/WASM: es solo
// cambiar el src de una <img>, así que no depende de que cargue ningún
// runtime aparte.
import idleSprite from "@/assets/guide-sprites/character_malePerson_idle.png";
import talkSprite from "@/assets/guide-sprites/character_malePerson_talk.png";
import thinkSprite from "@/assets/guide-sprites/character_malePerson_think.png";
import cheer0Sprite from "@/assets/guide-sprites/character_malePerson_cheer0.png";
import cheer1Sprite from "@/assets/guide-sprites/character_malePerson_cheer1.png";
import jumpSprite from "@/assets/guide-sprites/character_malePerson_jump.png";
import walk0Sprite from "@/assets/guide-sprites/character_malePerson_walk0.png";
import walk1Sprite from "@/assets/guide-sprites/character_malePerson_walk1.png";
import walk2Sprite from "@/assets/guide-sprites/character_malePerson_walk2.png";
import walk3Sprite from "@/assets/guide-sprites/character_malePerson_walk3.png";
import walk4Sprite from "@/assets/guide-sprites/character_malePerson_walk4.png";
import walk5Sprite from "@/assets/guide-sprites/character_malePerson_walk5.png";
import walk6Sprite from "@/assets/guide-sprites/character_malePerson_walk6.png";
import walk7Sprite from "@/assets/guide-sprites/character_malePerson_walk7.png";

export type GuideMood = "greeting" | "idle" | "curious" | "reacting" | "thinking" | "celebrating";

export const GUIDE_SIZES = { sm: 96, md: 148, lg: 240 } as const;
const SPRITE_ASPECT = 96 / 128;

const WALK_FRAMES = [
  walk0Sprite,
  walk1Sprite,
  walk2Sprite,
  walk3Sprite,
  walk4Sprite,
  walk5Sprite,
  walk6Sprite,
  walk7Sprite,
];
const CHEER_FRAMES = [cheer0Sprite, cheer1Sprite];
const POKE_FRAMES = [jumpSprite];

/** Cada mood usa una o varias poses reales del set (no geometría propia) —
 * las de varios cuadros se alternan para dar sensación de movimiento. */
const MOOD_FRAMES: Record<GuideMood, string[]> = {
  greeting: [talkSprite],
  idle: [idleSprite],
  curious: [thinkSprite],
  reacting: CHEER_FRAMES,
  thinking: [thinkSprite],
  celebrating: CHEER_FRAMES,
};

/** Animación de "vida" del contenedor entre cuadros, para las poses de un
 * solo cuadro (idle/talk/think no tienen ciclo propio). */
const MOOD_ANIMATION: Record<GuideMood, string> = {
  greeting: "animate-float-slow",
  idle: "animate-float-slow",
  curious: "animate-guide-tilt",
  reacting: "",
  thinking: "animate-guide-pulse",
  celebrating: "",
};

const WALK_FRAME_MS = 100;
const CHEER_FRAME_MS = 280;
const POKE_DURATION = 550;

export function GuideBubble({ message, layout }: { message: string; layout: "row" | "col" }) {
  return (
    <div
      key={message}
      className={cn(
        "animate-step-in relative max-w-[min(240px,85vw)] rounded-2xl border border-border/70 bg-card px-3.5 py-2.5 text-sm leading-snug shadow-soft",
        layout === "col" && "max-w-[min(300px,88vw)] text-center",
      )}
    >
      {message}
    </div>
  );
}

/**
 * Personaje guía del reto: sprites PNG de cuerpo completo (sin fondo) de
 * Kenney "Toon Characters" (CC0). Camina de verdad con un ciclo de 8
 * cuadros, cambia de pose por `mood` (saludo, pensando, celebrando, etc.)
 * y reacciona con un salto al tocarlo. `message` pinta una burbuja de
 * diálogo corta junto al personaje.
 */
export function GuideAvatar({
  mood,
  size = "md",
  message,
  layout = "row",
  walking = false,
  facing = "right",
  className,
}: {
  mood: GuideMood;
  size?: keyof typeof GUIDE_SIZES;
  message?: string | undefined;
  layout?: "row" | "col";
  /** Activa el ciclo de caminata (8 cuadros) mientras viaja por el camino. */
  walking?: boolean;
  /** Voltea el sprite para que "camine" en la dirección real del movimiento. */
  facing?: "left" | "right";
  className?: string;
}) {
  const dim = GUIDE_SIZES[size];
  const [poked, setPoked] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const frames = poked ? POKE_FRAMES : walking ? WALK_FRAMES : MOOD_FRAMES[mood];
  const frameMs = walking ? WALK_FRAME_MS : CHEER_FRAME_MS;

  useEffect(() => {
    setFrameIndex(0);
    if (frames.length <= 1) return;
    const interval = setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, frameMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poked, walking, mood]);

  useEffect(
    () => () => {
      if (pokeTimer.current) clearTimeout(pokeTimer.current);
    },
    [],
  );

  const onPointerDown = () => {
    setPoked(true);
    if (pokeTimer.current) clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPoked(false), POKE_DURATION);
  };

  const animation = poked || walking ? "" : MOOD_ANIMATION[mood];
  const width = dim * SPRITE_ASPECT;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3",
        layout === "col" && "flex-col text-center",
        className,
      )}
    >
      <div
        className={cn("shrink-0 cursor-pointer drop-shadow-sm", animation)}
        style={{
          width,
          height: dim,
          transform: facing === "left" ? "scaleX(-1)" : undefined,
        }}
        onPointerDown={onPointerDown}
      >
        <img
          src={frames[frameIndex % frames.length]}
          alt=""
          width={width}
          height={dim}
          className="size-full object-contain"
          draggable={false}
        />
      </div>

      {message ? <GuideBubble message={message} layout={layout} /> : null}
    </div>
  );
}
