/**
 * FUENTE DE VERDAD de los diálogos del guía (GuideAvatar).
 *
 * `stepIntro` debe tener una entrada por cada `id` de paso presente en
 * src/data/questions.ts. Si agregas o quitas pasos, actualiza este mapa.
 * Todo lo demás es texto libre: ajústalo sin tocar componentes.
 */

export const GUIDE_MESSAGES = {
  landing: "¡Hola! Yo te acompaño en el recorrido. Vamos a descubrir tu especialización.",

  stepIntro: {
    arranque: "Empecemos por cómo piensas.",
    "mapa-intereses": "Ahora arrastra lo que de verdad te llama.",
    "rueda-crisis": "Este te va a gustar: gira la rueda.",
    "rol-equipo": "¿Cuál eres tú cuando trabajas con otros?",
    "eje-riesgo": "Sin pensarlo tanto, mueve el deslizador.",
    objetivo: "Última pregunta, y es la que más importa.",
  } as Record<string, string>,

  reacting: [
    "Anotado.",
    "Me gusta cómo piensas.",
    "Buena elección.",
    "Eso dice mucho de ti.",
    "Vamos bien.",
  ],

  processing: [
    "Leyendo tus respuestas...",
    "Cruzando tu perfil con los posgrados de CUN...",
    "Ordenando por afinidad...",
    "Listo. Mira esto.",
  ],

  result: (programName: string) =>
    `¡Encontré tu especialización! ${programName} te queda como anillo al dedo.`,

  lead: "Cuéntame quién eres y te mando el detalle completo.",

  leadDone: "Quedaste registrado. Ya casi te contactamos.",
} as const;
