import { supabase } from "@/integrations/supabase/client";
import type { QuizAnswer } from "@/context/quiz-context";
import type { MatchResult, Profile } from "@/lib/matching";

/** Guarda el resultado del reto (sin datos personales todavía). */
export async function saveQuizResult(
  ranking: MatchResult[],
  profile: Profile,
  answers: Record<string, QuizAnswer>,
) {
  const top = ranking[0];
  const second = ranking[1];
  if (!top) return null;

  const { data, error } = await supabase
    .from("quiz_results")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

/** Guarda una solicitud de brochure (nombre + correo), capturada al arranque. */
export async function saveBrochureRequest(input: { fullName: string; email: string }) {
  const { error } = await supabase.from("quiz_brochure_requests").insert({
    full_name: input.fullName,
    email: input.email,
  });
  if (error) throw error;
}

/** Guarda los datos de contacto del prospecto ligados a su resultado. */
export async function saveLead(input: {
  resultId: string | null;
  fullName: string;
  email: string;
  phone: string;
  city: string;
}) {
  const { error } = await supabase.from("quiz_leads").insert({
    result_id: input.resultId,
    full_name: input.fullName,
    email: input.email,
    phone: input.phone,
    city: input.city,
  });
  if (error) throw error;
}
