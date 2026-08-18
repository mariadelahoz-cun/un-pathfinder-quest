/**
 * MOTOR DE MATCHING
 *
 * Cómo funciona, en corto:
 *  1. Cada respuesta del usuario aporta uno o varios vectores (rasgos, intereses, objetivos).
 *  2. Se suman todos en un perfil único y se normaliza (0 a 1) por dimensión.
 *  3. Para cada especialización se calcula la similitud entre su vector y el perfil.
 *  4. Se pondera por categoría con los pesos de CATEGORY_WEIGHTS.
 *  5. Se convierte a un porcentaje de afinidad "legible" y se ordena de mayor a menor.
 *
 * Para ajustar el resultado sin tocar la interfaz:
 *  - Cambia CATEGORY_WEIGHTS (qué pesa más: personalidad, intereses u objetivos).
 *  - Cambia AFFINITY_FLOOR / AFFINITY_CEIL (rango del porcentaje mostrado).
 *  - Cambia los vectores en src/data/questions.ts y src/data/specializations.ts.
 */

import {
  specializations,
  type Goal,
  type Interest,
  type ScoreVector,
  type Specialization,
  type Trait,
} from "@/data/specializations";

/** Peso relativo de cada categoría en el puntaje final. Debe sumar 1. */
export const CATEGORY_WEIGHTS = {
  traits: 0.4,
  interests: 0.4,
  goals: 0.2,
};

/** Rango del porcentaje de afinidad que se muestra al usuario. */
export const AFFINITY_FLOOR = 58;
export const AFFINITY_CEIL = 97;

export type Profile = {
  traits: Record<string, number>;
  interests: Record<string, number>;
  goals: Record<string, number>;
};

export type MatchResult = {
  program: Specialization;
  affinity: number;
  raw: number;
};

const emptyProfile = (): Profile => ({ traits: {}, interests: {}, goals: {} });

/** Suma un vector (con un multiplicador opcional) dentro del perfil acumulado. */
export function addVector(profile: Profile, vector: ScoreVector, weight = 1): Profile {
  (["traits", "interests", "goals"] as const).forEach((category) => {
    const source = vector[category] as Record<string, number> | undefined;
    if (!source) return;
    Object.entries(source).forEach(([key, value]) => {
      profile[category][key] = (profile[category][key] ?? 0) + value * weight;
    });
  });
  return profile;
}

/** Construye el perfil del usuario a partir de todos los vectores de sus respuestas. */
export function buildProfile(vectors: { vector: ScoreVector; weight?: number }[]): Profile {
  return vectors.reduce(
    (profile, entry) => addVector(profile, entry.vector, entry.weight ?? 1),
    emptyProfile(),
  );
}

/** Normaliza cada categoría entre 0 y 1 usando su valor máximo. */
function normalize(values: Record<string, number>): Record<string, number> {
  const max = Math.max(0, ...Object.values(values));
  if (max <= 0) return {};
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Math.max(0, value) / max]),
  );
}

function categorySimilarity(
  userValues: Record<string, number>,
  programValues: Record<string, number> | undefined,
): number {
  if (!programValues) return 0;
  const normalizedUser = normalize(userValues);
  const programTotal = Object.values(programValues).reduce((sum, value) => sum + value, 0);
  if (programTotal <= 0) return 0;

  // Similitud = cuánto del "peso" del programa está cubierto por el interés del usuario.
  const matched = Object.entries(programValues).reduce(
    (sum, [key, weight]) => sum + weight * (normalizedUser[key] ?? 0),
    0,
  );
  return matched / programTotal;
}

/** Calcula el ranking completo de especializaciones para un perfil. */
export function rankSpecializations(profile: Profile): MatchResult[] {
  const scored = specializations.map((program) => {
    const raw =
      CATEGORY_WEIGHTS.traits *
        categorySimilarity(profile.traits, program.vector.traits as Record<string, number>) +
      CATEGORY_WEIGHTS.interests *
        categorySimilarity(profile.interests, program.vector.interests as Record<string, number>) +
      CATEGORY_WEIGHTS.goals *
        categorySimilarity(profile.goals, program.vector.goals as Record<string, number>);
    return { program, raw };
  });

  const max = Math.max(...scored.map((entry) => entry.raw), 0.0001);
  const min = Math.min(...scored.map((entry) => entry.raw));
  const span = Math.max(max - min, 0.0001);

  return scored
    .map(({ program, raw }) => ({
      program,
      raw,
      // Reescala el puntaje crudo al rango legible de afinidad.
      affinity: Math.round(AFFINITY_FLOOR + ((raw - min) / span) * (AFFINITY_CEIL - AFFINITY_FLOOR)),
    }))
    .sort((a, b) => b.raw - a.raw);
}

/** Los 2-3 rasgos más fuertes del perfil, para el texto del resultado. */
export function topKeys(values: Record<string, number>, count = 2): string[] {
  return Object.entries(values)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => key);
}

export const TRAIT_LABELS: Record<Trait, string> = {
  analitico: "analítico",
  creativo: "creativo",
  lider: "líder",
  colaborador: "colaborador",
  ejecutor: "ejecutor",
};

export const INTEREST_LABELS: Record<Interest, string> = {
  tecnologia: "tecnología y datos",
  educacion: "formación y enseñanza",
  gestion: "gestión y equipos",
  comunicacion: "marca y comunicación",
  innovacion_social: "impacto social",
  finanzas: "finanzas",
  salud_trabajo: "seguridad y salud en el trabajo",
  operaciones: "operación y logística",
};

export const GOAL_LABELS: Record<Goal, string> = {
  emprender: "quieres emprender",
  ascender: "quieres ascender donde estás",
  cambiar_carrera: "quieres cambiar de área",
  profundizar: "quieres profundizar en lo tuyo",
};

/** Arma las frases de "por qué esta especialización" a partir del perfil. */
export function buildReasons(profile: Profile, match: MatchResult): string[] {
  const traits = topKeys(profile.traits, 2).map(
    (key) => TRAIT_LABELS[key as Trait] ?? key,
  );
  const interests = topKeys(profile.interests, 2).map(
    (key) => INTEREST_LABELS[key as Interest] ?? key,
  );
  const goal = topKeys(profile.goals, 1)[0];

  const reasons = [
    `Tus respuestas dibujan un perfil ${traits.join(" y ")}: así es exactamente como se trabaja en ${match.program.name.replace("Especialización en ", "")}.`,
    `Marcaste ${interests.join(" y ")} como lo que de verdad te mueve, y ese es el centro del programa.`,
    goal
      ? `Dijiste que ${GOAL_LABELS[goal as Goal] ?? "quieres crecer"}: este posgrado está armado para ese salto, no para llenar una hoja de vida.`
      : `Este posgrado está armado para dar un salto concreto, no para llenar una hoja de vida.`,
    `${match.program.tagline}. Dura ${match.program.duration} y se ofrece en modalidad ${match.program.modality.toLowerCase()}.`,
  ];

  return reasons;
}
