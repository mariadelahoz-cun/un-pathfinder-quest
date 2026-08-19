import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

export type GuideMood = "greeting" | "idle" | "curious" | "reacting" | "thinking" | "celebrating";

const SIZES = { sm: 72, md: 120, lg: 200 } as const;
const VIEW_W = 100;
const VIEW_H = 160;

const HEAD_FILL = "#F4EBD9";
const INK = "#2E4B1B";
const BLAZER = "#5B8C3A";
const BADGE = "#F4EBD9";

type MouthKind = "smile" | "flat" | "o" | "open";
type ArmPose = "idle" | "raised";

/** Pose/expresión por estado de ánimo. La boca SIEMPRE es un trazo (nunca
 * una forma rellena) — evita el efecto "hueco" de iteraciones anteriores. */
const MOOD_PARAMS: Record<GuideMood, { mouth: MouthKind; arms: ArmPose; browsUp: boolean }> = {
  greeting: { mouth: "smile", arms: "raised", browsUp: false },
  idle: { mouth: "smile", arms: "idle", browsUp: false },
  curious: { mouth: "o", arms: "idle", browsUp: true },
  reacting: { mouth: "open", arms: "raised", browsUp: false },
  thinking: { mouth: "flat", arms: "idle", browsUp: true },
  celebrating: { mouth: "open", arms: "raised", browsUp: false },
};

const MOUTH_PATHS: Record<Exclude<MouthKind, "o">, string> = {
  smile: "M44 31 Q50 35.5 56 31",
  flat: "M45 32 L55 32",
  open: "M42 30 Q50 39.5 58 30",
};

const POKE_DURATION = 550;

function GuideFigure({ mood, dim, walking }: { mood: GuideMood; dim: number; walking: boolean }) {
  const [poked, setPoked] = useState(false);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pokeTimer.current) clearTimeout(pokeTimer.current);
    },
    [],
  );

  const params = MOOD_PARAMS[mood];
  const armsRaised = poked || params.arms === "raised";
  const mouthKind: MouthKind = poked ? "open" : params.mouth;
  const browsUp = poked ? false : params.browsUp;

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setLook({
      x: Math.max(-1, Math.min(1, relX)) * 6,
      y: Math.max(-1, Math.min(1, relY)) * 3,
    });
  };

  const onPointerLeave = () => setLook({ x: 0, y: 0 });

  const onPointerDown = () => {
    setPoked(true);
    if (pokeTimer.current) clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPoked(false), POKE_DURATION);
  };

  const armStyle = (side: "left" | "right"): CSSProperties => {
    const idleAngle = side === "left" ? -8 : 8;
    const raisedAngle = side === "left" ? -128 : 128;
    return {
      transformBox: "fill-box",
      transformOrigin: "50% 0%",
      transform: walking ? undefined : `rotate(${armsRaised ? raisedAngle : idleAngle}deg)`,
      transition: walking ? undefined : "transform 0.35s ease",
    };
  };

  const legStyle: CSSProperties = {
    transformBox: "fill-box",
    transformOrigin: "50% 0%",
    transform: walking ? undefined : "rotate(0deg)",
    transition: walking ? undefined : "transform 0.35s ease",
  };

  const width = dim * (VIEW_W / VIEW_H);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={width}
      height={dim}
      className={cn("overflow-visible drop-shadow-sm", poked && "animate-pop")}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      {/* Piernas: no se bambolean con el torso, quedan "en el piso". */}
      <g style={legStyle} className={walking ? "animate-walk-phase-a" : undefined}>
        <rect x="38" y="96" width="10" height="38" rx="5" fill={BLAZER} />
        <ellipse cx="43" cy="135" rx="7" ry="3" fill={INK} opacity="0.85" />
      </g>
      <g style={legStyle} className={walking ? "animate-walk-phase-b" : undefined}>
        <rect x="52" y="96" width="10" height="38" rx="5" fill={BLAZER} />
        <ellipse cx="57" cy="135" rx="7" ry="3" fill={INK} opacity="0.85" />
      </g>

      {/* Torso + cabeza: se bambolean juntos al caminar. */}
      <g className={walking ? "animate-walk-bob" : undefined}>
        <rect x="30" y="44" width="40" height="54" rx="14" fill={BLAZER} />

        {/* Insignia de brújula, nexo con "encuentra tu rumbo". */}
        <circle cx="50" cy="62" r="6" fill={BADGE} opacity="0.9" />
        <path d="M50 58 L52.4 62 L50 66 L47.6 62 Z" fill={BLAZER} />

        <g style={armStyle("left")} className={walking ? "animate-walk-phase-b" : undefined}>
          <rect x="25" y="50" width="9" height="34" rx="4.5" fill={BLAZER} />
        </g>
        <g style={armStyle("right")} className={walking ? "animate-walk-phase-a" : undefined}>
          <rect x="66" y="50" width="9" height="34" rx="4.5" fill={BLAZER} />
        </g>

        <g
          style={{
            transform: `translate(${look.x}px, ${look.y}px)`,
            transition: "transform 0.2s ease",
          }}
        >
          <circle cx="50" cy="26" r="16" fill={HEAD_FILL} />

          <g
            stroke={INK}
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ transition: "transform 0.3s ease" }}
            transform={browsUp ? "translate(0,-1.5)" : undefined}
          >
            <line x1="41.5" y1="19.5" x2="47" y2="18.5" />
            <line x1="53" y1="18.5" x2="58.5" y2="19.5" />
          </g>

          <g
            className="animate-blink"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx="45.5" cy="25" r="2" fill={INK} />
            <circle cx="54.5" cy="25" r="2" fill={INK} />
          </g>

          {mouthKind === "o" ? (
            <circle cx="50" cy="32" r="2.4" fill="none" stroke={INK} strokeWidth="1.6" />
          ) : (
            <path
              d={MOUTH_PATHS[mouthKind]}
              fill="none"
              stroke={INK}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
    </svg>
  );
}

function GuideBubble({ message, layout }: { message: string; layout: "row" | "col" }) {
  return (
    <div
      key={message}
      className={cn(
        "animate-step-in relative max-w-[240px] rounded-2xl border border-border/70 bg-card px-3.5 py-2.5 text-sm leading-snug shadow-soft",
        layout === "col" && "max-w-[280px] text-center",
      )}
    >
      {message}
    </div>
  );
}

/**
 * Personaje guía del reto: una figura humana ilustrada en SVG/CSS (flat,
 * sin rasgos infantilizados), que camina de verdad entre nodos del
 * recorrido (`walking`), sigue el cursor/dedo y reacciona al tocarla.
 * `mood` cambia su expresión, `message` pinta una burbuja de diálogo corta.
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
  size?: keyof typeof SIZES;
  message?: string | undefined;
  layout?: "row" | "col";
  /** Activa el ciclo de caminata (piernas/brazos alternados). */
  walking?: boolean;
  /** Voltea la figura para que "camine" en la dirección real del movimiento. */
  facing?: "left" | "right";
  className?: string;
}) {
  const dim = SIZES[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3",
        layout === "col" && "flex-col text-center",
        className,
      )}
    >
      <div
        className="relative shrink-0"
        style={{
          width: dim * (VIEW_W / VIEW_H),
          height: dim,
          transform: facing === "left" ? "scaleX(-1)" : undefined,
        }}
      >
        <GuideFigure mood={mood} dim={dim} walking={walking} />
      </div>

      {message ? <GuideBubble message={message} layout={layout} /> : null}
    </div>
  );
}
