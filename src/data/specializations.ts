/**
 * FUENTE DE VERDAD de las especializaciones.
 *
 * Actualiza / reemplaza este archivo con la información oficial de CUN.
 * La interfaz y el motor de matching NO tienen ninguna especialización
 * escrita por dentro: todo sale de aquí.
 *
 * Cómo funcionan los vectores:
 *  - traits:    qué tanto encaja cada rasgo de personalidad (0 a 5)
 *  - interests: qué tanto encaja cada área de interés (0 a 5)
 *  - goals:     qué tanto encaja cada objetivo profesional (0 a 5)
 * Si un rasgo/interés/objetivo no aparece, cuenta como 0.
 */

export type Trait = "analitico" | "creativo" | "lider" | "colaborador" | "ejecutor";

export type Interest =
  | "tecnologia"
  | "educacion"
  | "gestion"
  | "comunicacion"
  | "innovacion_social"
  | "finanzas"
  | "salud_trabajo"
  | "operaciones";

export type Goal = "emprender" | "ascender" | "cambiar_carrera" | "profundizar";

export type ScoreVector = {
  traits?: Partial<Record<Trait, number>>;
  interests?: Partial<Record<Interest, number>>;
  goals?: Partial<Record<Goal, number>>;
};

export type Specialization = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  duration: string;
  modality: string;
  curriculum: string[];
  vector: ScoreVector;
};

export const specializations: Specialization[] = [
  {
    id: "gerencia-proyectos",
    name: "Especialización en Gerencia de Proyectos",
    tagline: "Para quien convierte ideas en planes que sí se ejecutan",
    description:
      "Aprendes a estructurar, presupuestar y liderar proyectos de principio a fin, con metodologías predictivas y ágiles que hoy piden las empresas y el sector público.",
    audience:
      "Profesionales de cualquier área que ya coordinan equipos o entregables y quieren hacerlo con método.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Fundamentos y ciclo de vida del proyecto",
      "Costos, tiempos y gestión del riesgo",
      "Metodologías ágiles y gestión de equipos",
      "Evaluación financiera de proyectos",
      "Proyecto aplicado de grado",
    ],
    vector: {
      traits: { ejecutor: 5, lider: 4, analitico: 3, colaborador: 2 },
      interests: { gestion: 5, operaciones: 4, finanzas: 2, tecnologia: 2 },
      goals: { ascender: 5, profundizar: 3, emprender: 2, cambiar_carrera: 2 },
    },
  },
  {
    id: "gerencia-talento-humano",
    name: "Especialización en Gerencia del Talento Humano",
    tagline: "Para quien cree que la gente es lo que hace o rompe una empresa",
    description:
      "Te formas en selección, cultura, compensación y desarrollo de equipos, con foco en normatividad laboral colombiana y en decisiones basadas en datos de personas.",
    audience:
      "Profesionales de RR.HH., líderes de equipo y psicólogos organizacionales que quieren pasar a la gerencia.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Gestión estratégica del talento",
      "Selección por competencias",
      "Cultura, clima y bienestar",
      "Compensación y normatividad laboral",
      "Analítica de personas",
    ],
    vector: {
      traits: { colaborador: 5, lider: 4, creativo: 2, analitico: 2 },
      interests: { gestion: 4, educacion: 3, comunicacion: 3, innovacion_social: 3 },
      goals: { ascender: 4, profundizar: 4, cambiar_carrera: 3, emprender: 1 },
    },
  },
  {
    id: "gerencia-financiera",
    name: "Especialización en Gerencia Financiera",
    tagline: "Para quien lee un estado financiero y ve la historia detrás",
    description:
      "Profundizas en finanzas corporativas, valoración, riesgo y decisiones de inversión para sostener el crecimiento de una organización o de tu propio negocio.",
    audience:
      "Contadores, administradores, economistas y emprendedores que manejan plata ajena o propia.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Diagnóstico y planeación financiera",
      "Valoración de empresas",
      "Gestión de riesgo y portafolios",
      "Financiación y mercado de capitales",
      "Modelación financiera aplicada",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 3, lider: 3 },
      interests: { finanzas: 5, gestion: 4, tecnologia: 2, operaciones: 2 },
      goals: { ascender: 4, emprender: 4, profundizar: 4, cambiar_carrera: 1 },
    },
  },
  {
    id: "gerencia-marketing-digital",
    name: "Especialización en Gerencia de Mercadeo Digital",
    tagline: "Para quien tiene ideas y quiere que además vendan",
    description:
      "Combinas estrategia de marca, contenido, medios pagos y analítica digital para construir campañas que se puedan medir y defender con números.",
    audience:
      "Publicistas, comunicadores, diseñadores y dueños de negocio que venden o quieren vender en digital.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Estrategia de marca y posicionamiento",
      "Contenido y narrativa digital",
      "Medios pagos y embudos de conversión",
      "Analítica digital y CRM",
      "Plan de mercadeo aplicado",
    ],
    vector: {
      traits: { creativo: 5, ejecutor: 3, analitico: 3, lider: 2 },
      interests: { comunicacion: 5, tecnologia: 3, gestion: 3, finanzas: 1 },
      goals: { emprender: 5, cambiar_carrera: 3, ascender: 3, profundizar: 2 },
    },
  },
  {
    id: "gerencia-ti",
    name: "Especialización en Gerencia de Tecnologías de la Información",
    tagline: "Para quien quiere decidir sobre tecnología, no solo operarla",
    description:
      "Pasas del rol técnico al estratégico: arquitectura, datos, ciberseguridad y gobierno de TI para alinear la tecnología con los objetivos del negocio.",
    audience:
      "Ingenieros, desarrolladores, analistas y líderes de sistemas que quieren dirigir áreas de tecnología.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Gobierno y estrategia de TI",
      "Arquitectura de soluciones",
      "Datos y analítica para la decisión",
      "Ciberseguridad y continuidad",
      "Transformación digital aplicada",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 4, lider: 3, creativo: 2 },
      interests: { tecnologia: 5, gestion: 3, operaciones: 3 },
      goals: { ascender: 5, profundizar: 4, cambiar_carrera: 2, emprender: 2 },
    },
  },
  {
    id: "pedagogia-docencia",
    name: "Especialización en Pedagogía y Docencia",
    tagline: "Para quien explica algo y ve el momento en que el otro entiende",
    description:
      "Fortaleces didáctica, evaluación y diseño curricular para enseñar en aula o en entornos virtuales, con herramientas para acompañar procesos reales de aprendizaje.",
    audience:
      "Profesionales de cualquier disciplina que enseñan, capacitan o quieren entrar al sector educativo.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Corrientes pedagógicas contemporáneas",
      "Diseño curricular y evaluación",
      "Didácticas mediadas por tecnología",
      "Investigación en el aula",
      "Práctica pedagógica",
    ],
    vector: {
      traits: { colaborador: 5, creativo: 4, lider: 2, analitico: 2 },
      interests: { educacion: 5, comunicacion: 3, innovacion_social: 3, tecnologia: 2 },
      goals: { cambiar_carrera: 4, profundizar: 4, ascender: 2, emprender: 2 },
    },
  },
  {
    id: "seguridad-salud-trabajo",
    name: "Especialización en Gerencia de la Seguridad y Salud en el Trabajo",
    tagline: "Para quien entra a un lugar y ve primero los riesgos",
    description:
      "Diseñas y administras sistemas de gestión SST bajo la normatividad colombiana, con foco en prevención, auditoría y cultura de cuidado en la operación.",
    audience:
      "Profesionales de salud, ingeniería y administración que lideran o quieren liderar áreas de SST.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Marco legal del SG-SST",
      "Identificación de peligros y control de riesgos",
      "Higiene y medicina laboral",
      "Auditoría e indicadores",
      "Proyecto de implementación SG-SST",
    ],
    vector: {
      traits: { ejecutor: 5, analitico: 4, colaborador: 3, lider: 2 },
      interests: { salud_trabajo: 5, operaciones: 4, gestion: 3, innovacion_social: 2 },
      goals: { profundizar: 4, ascender: 4, cambiar_carrera: 3, emprender: 2 },
    },
  },
  {
    id: "gerencia-logistica",
    name: "Especialización en Gerencia Logística",
    tagline: "Para quien disfruta que la cadena entera funcione sin ruido",
    description:
      "Optimizas abastecimiento, inventarios, transporte y distribución con indicadores y tecnología, pensando en costos reales y en servicio al cliente.",
    audience:
      "Profesionales de operaciones, comercio exterior, producción y compras.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Cadena de abastecimiento integral",
      "Inventarios y almacenamiento",
      "Transporte y distribución",
      "Comercio internacional",
      "Indicadores y mejora continua",
    ],
    vector: {
      traits: { ejecutor: 5, analitico: 4, lider: 3 },
      interests: { operaciones: 5, gestion: 4, tecnologia: 2, finanzas: 2 },
      goals: { ascender: 4, profundizar: 4, emprender: 3, cambiar_carrera: 2 },
    },
  },
  {
    id: "gestion-social-emprendimiento",
    name: "Especialización en Gestión Social y Emprendimiento",
    tagline: "Para quien quiere que su proyecto deje algo más que utilidades",
    description:
      "Formulas proyectos con impacto social medible: diagnóstico de territorio, modelos de negocio sostenibles, cooperación y evaluación de resultados.",
    audience:
      "Líderes comunitarios, gestores públicos, fundaciones y emprendedores de impacto.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Diagnóstico social y de territorio",
      "Modelos de negocio con impacto",
      "Financiación y cooperación",
      "Evaluación de impacto",
      "Proyecto social aplicado",
    ],
    vector: {
      traits: { creativo: 4, colaborador: 5, lider: 4, ejecutor: 2 },
      interests: { innovacion_social: 5, gestion: 3, comunicacion: 3, educacion: 2 },
      goals: { emprender: 5, cambiar_carrera: 3, profundizar: 2, ascender: 2 },
    },
  },
];

export const getSpecialization = (id: string) =>
  specializations.find((program) => program.id === id);
