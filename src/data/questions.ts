/**
 * FUENTE DE VERDAD del flujo de preguntas.
 *
 * Puedes agregar, quitar o reordenar pasos sin tocar la interfaz:
 * la pantalla del reto recorre este arreglo en orden.
 *
 * Tipos de paso disponibles:
 *  - "cards"        -> tarjetas visuales, el usuario elige una
 *  - "slider"       -> deslizador entre dos polos (mezcla los dos vectores)
 *  - "interest-map" -> arrastra íconos a "me gusta" / "no me gusta"
 *  - "wheel"        -> rueda que gira, revela una situación y el usuario elige reacción
 *
 * Cada opción trae un "vector" con puntajes de personalidad, interés y objetivo.
 * Los pesos van de 0 a 5. Ajusta libremente: el motor solo suma.
 */

import type { ScoreVector } from "./specializations";

export type CardOption = {
  id: string;
  label: string;
  hint?: string;
  icon: string; // nombre de ícono (ver src/components/quiz/icon-map.ts)
  vector: ScoreVector;
};

export type QuizStep =
  | {
      id: string;
      kind: "cards";
      prompt: string;
      helper?: string;
      options: CardOption[];
    }
  | {
      id: string;
      kind: "slider";
      prompt: string;
      helper?: string;
      leftLabel: string;
      rightLabel: string;
      leftVector: ScoreVector;
      rightVector: ScoreVector;
    }
  | {
      id: string;
      kind: "interest-map";
      prompt: string;
      helper?: string;
      items: CardOption[];
    }
  | {
      id: string;
      kind: "wheel";
      prompt: string;
      helper?: string;
      scenarios: {
        id: string;
        situation: string;
        options: { id: string; label: string; icon: string; vector: ScoreVector }[];
      }[];
    };

export const quizSteps: QuizStep[] = [
  {
    id: "arranque",
    kind: "cards",
    prompt: "Cuando te dan un problema nuevo, ¿qué haces primero?",
    helper: "Elige la que más se parece a ti, sin pensarlo mucho.",
    options: [
      {
        id: "datos",
        label: "Busco datos y los ordeno",
        icon: "chart",
        vector: { traits: { analitico: 5 }, interests: { tecnologia: 2, finanzas: 2 } },
      },
      {
        id: "ideas",
        label: "Lanzo ideas, después filtro",
        icon: "sparkles",
        vector: { traits: { creativo: 5 }, interests: { comunicacion: 2 } },
      },
      {
        id: "equipo",
        label: "Reúno a la gente involucrada",
        icon: "users",
        vector: { traits: { colaborador: 5, lider: 2 }, interests: { gestion: 2 } },
      },
      {
        id: "manos",
        label: "Empiezo a hacerlo y ajusto en camino",
        icon: "wrench",
        vector: { traits: { ejecutor: 5 }, interests: { operaciones: 2 } },
      },
    ],
  },
  {
    id: "mapa-intereses",
    kind: "interest-map",
    prompt: "Arrastra cada tema a la zona que te corresponde",
    helper: "Lo que dejes sin mover simplemente no cuenta.",
    items: [
      {
        id: "tecnologia",
        label: "Tecnología y datos",
        icon: "cpu",
        vector: { interests: { tecnologia: 5 } },
      },
      {
        id: "personas",
        label: "Equipos y talento",
        icon: "users",
        vector: { interests: { gestion: 3 }, traits: { colaborador: 3 } },
      },
      {
        id: "dinero",
        label: "Finanzas e inversión",
        icon: "coins",
        vector: { interests: { finanzas: 5 } },
      },
      {
        id: "ensenar",
        label: "Enseñar y formar",
        icon: "graduation",
        vector: { interests: { educacion: 5 } },
      },
      {
        id: "marca",
        label: "Marca y contenido",
        icon: "megaphone",
        vector: { interests: { comunicacion: 5 } },
      },
      {
        id: "operacion",
        label: "Logística y operación",
        icon: "truck",
        vector: { interests: { operaciones: 5 } },
      },
      {
        id: "riesgos",
        label: "Prevención y riesgos",
        icon: "shield",
        vector: { interests: { salud_trabajo: 5 } },
      },
      {
        id: "comunidad",
        label: "Impacto social",
        icon: "heart",
        vector: { interests: { innovacion_social: 5 } },
      },
    ],
  },
  {
    id: "rueda-crisis",
    kind: "wheel",
    prompt: "Gira la rueda y mira qué te toca",
    helper: "Cada giro revela una situación real de trabajo.",
    scenarios: [
      {
        id: "cliente",
        situation:
          "El cliente cambia todo el alcance a tres días de la entrega. El equipo te mira esperando instrucciones.",
        options: [
          {
            id: "replanear",
            label: "Rehago el cronograma y renegocio el alcance",
            icon: "calendar",
            vector: { traits: { ejecutor: 4, lider: 3 }, interests: { gestion: 4 } },
          },
          {
            id: "numeros",
            label: "Calculo cuánto cuesta el cambio y lo sustento",
            icon: "chart",
            vector: { traits: { analitico: 4 }, interests: { finanzas: 4 } },
          },
          {
            id: "equipo",
            label: "Hablo primero con el equipo para no quemarlo",
            icon: "users",
            vector: { traits: { colaborador: 5 }, interests: { gestion: 2 } },
          },
        ],
      },
      {
        id: "caida",
        situation:
          "Se cae el sistema en plena jornada de ventas. Nadie sabe por qué y el jefe pide una respuesta ya.",
        options: [
          {
            id: "diagnostico",
            label: "Reviso registros y aíslo la causa",
            icon: "cpu",
            vector: { traits: { analitico: 5 }, interests: { tecnologia: 5 } },
          },
          {
            id: "plan-b",
            label: "Activo un plan B manual mientras se resuelve",
            icon: "wrench",
            vector: { traits: { ejecutor: 5 }, interests: { operaciones: 4 } },
          },
          {
            id: "comunicar",
            label: "Armo el mensaje para clientes y equipo",
            icon: "megaphone",
            vector: { traits: { creativo: 3 }, interests: { comunicacion: 5 } },
          },
        ],
      },
      {
        id: "rotacion",
        situation:
          "Tres personas clave renunciaron el mismo mes y el clima del área está pesado.",
        options: [
          {
            id: "cultura",
            label: "Diagnostico clima y rediseño la experiencia del equipo",
            icon: "heart",
            vector: { traits: { colaborador: 5, lider: 3 }, interests: { gestion: 4 } },
          },
          {
            id: "formar",
            label: "Armo un plan de formación interna",
            icon: "graduation",
            vector: { interests: { educacion: 5 }, traits: { colaborador: 3 } },
          },
          {
            id: "procesos",
            label: "Documento procesos para que no dependan de personas",
            icon: "shield",
            vector: { traits: { ejecutor: 4, analitico: 3 }, interests: { operaciones: 3 } },
          },
        ],
      },
    ],
  },
  {
    id: "rol-equipo",
    kind: "cards",
    prompt: "En un equipo, el rol que siempre termina siendo tuyo:",
    options: [
      {
        id: "timon",
        label: "Quien toma la decisión final",
        icon: "compass",
        vector: { traits: { lider: 5 }, goals: { ascender: 3 } },
      },
      {
        id: "puente",
        label: "Quien conecta y calma tensiones",
        icon: "users",
        vector: { traits: { colaborador: 5 }, interests: { educacion: 2 } },
      },
      {
        id: "motor",
        label: "Quien empuja hasta que salga",
        icon: "wrench",
        vector: { traits: { ejecutor: 5 }, interests: { operaciones: 3 } },
      },
      {
        id: "chispa",
        label: "Quien propone lo que nadie pensó",
        icon: "sparkles",
        vector: { traits: { creativo: 5 }, interests: { comunicacion: 3 } },
      },
    ],
  },
  {
    id: "eje-riesgo",
    kind: "slider",
    prompt: "¿Cómo te llevas con el riesgo?",
    leftLabel: "Prefiero estructura y reglas claras",
    rightLabel: "Prefiero terreno nuevo y apostar",
    leftVector: {
      traits: { ejecutor: 4, analitico: 3 },
      interests: { salud_trabajo: 4, operaciones: 3, gestion: 2 },
      goals: { profundizar: 3 },
    },
    rightVector: {
      traits: { creativo: 4, lider: 3 },
      interests: { innovacion_social: 3, comunicacion: 3 },
      goals: { emprender: 4, cambiar_carrera: 2 },
    },
  },
  {
    id: "objetivo",
    kind: "cards",
    prompt: "¿Para qué quieres el posgrado, siendo honesto?",
    options: [
      {
        id: "ascender",
        label: "Ascender donde estoy hoy",
        icon: "trending",
        vector: { goals: { ascender: 5 }, traits: { lider: 2 } },
      },
      {
        id: "emprender",
        label: "Montar o hacer crecer mi negocio",
        icon: "rocket",
        vector: { goals: { emprender: 5 }, traits: { creativo: 2, ejecutor: 2 } },
      },
      {
        id: "cambiar",
        label: "Cambiar de área o de carrera",
        icon: "refresh",
        vector: { goals: { cambiar_carrera: 5 } },
      },
      {
        id: "profundizar",
        label: "Volverme experto en lo mío",
        icon: "target",
        vector: { goals: { profundizar: 5 }, traits: { analitico: 2 } },
      },
    ],
  },
];
