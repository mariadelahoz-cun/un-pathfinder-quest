import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer } from "@/context/quiz-context";
import type { MatchResult, Profile } from "@/lib/matching";

/**
 * Todo el recorrido de un estudiante vive en una sola fila de `students`
 * (ver supabase/migrations/20260923100000_add_students.sql), identificada
 * por un id generado en el cliente (crypto.randomUUID()) desde el momento
 * en que deja nombre/correo en el landing. Las etapas siguientes solo
 * actualizan esa misma fila — no crean filas nuevas.
 */

/** Crea la fila del estudiante al capturar nombre/correo en el landing. */
export async function createStudent(input: { id: string; fullName: string; email: string }) {
  const { error } = await supabase.from("students").insert({
    id: input.id,
    full_name: input.fullName,
    email: input.email,
    stage: "brochure",
  });
  if (error) throw error;
}

/** Guarda el resultado del reto en la fila del estudiante. */
export async function saveQuizResult(
  studentId: string,
  ranking: MatchResult[],
  profile: Profile,
  answers: Record<string, QuizAnswer>,
) {
  const top = ranking[0];
  const second = ranking[1];
  if (!top) return;

  const { error } = await supabase
    .from("students")
    .update({
      top_program_id: top.program.id,
      top_program_name: top.program.name,
      top_score: top.affinity,
      second_program_id: second?.program.id ?? null,
      second_program_name: second?.program.name ?? null,
      second_score: second?.affinity ?? null,
      traits: JSON.parse(JSON.stringify(profile)),
      answers: Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, value.label]),
      ),
      stage: "result",
    })
    .eq("id", studentId);

  if (error) throw error;
}

/** Guarda teléfono/ciudad del estudiante para que un asesor lo contacte. */
export async function saveLead(studentId: string, input: { phone: string; city: string }) {
  const { error } = await supabase
    .from("students")
    .update({ phone: input.phone, city: input.city, stage: "lead" })
    .eq("id", studentId);
  if (error) throw error;
}
