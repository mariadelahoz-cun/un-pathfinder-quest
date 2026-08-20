/**
 * FUENTE DE VERDAD de las especializaciones.
 *
 * Lista real de programas de posgrado de la CUN (24). El copy (tagline,
 * descripción, audiencia, currículo) es un borrador razonable a partir del
 * nombre de cada programa — ajústalo con la información oficial de cada
 * especialización cuando la tengas (duración/modalidad reales, pénsum
 * oficial, etc.). La interfaz y el motor de matching NO tienen ninguna
 * especialización escrita por dentro: todo sale de aquí.
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
  | "operaciones"
  | "moda"
  | "sector_publico"
  | "energia";

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
  /** Ícono del avatar de recompensa (clave de src/components/quiz/icon-map.ts). */
  avatarIcon: string;
  /** Par de colores (inicio, fin) del degradado del avatar de recompensa. */
  avatarColors: [string, string];
};

export const specializations: Specialization[] = [
  {
    id: "paz-desarrollo-territorial",
    name: "Especialización en Paz y Desarrollo Territorial",
    tagline: "Para quien quiere construir país desde el territorio, no solo opinar de él",
    description:
      "Formulas y gestionas proyectos de paz, reconciliación y desarrollo territorial, con herramientas de análisis de conflicto, participación comunitaria y política pública aplicada.",
    audience:
      "Profesionales de ciencias sociales, gestores públicos y líderes comunitarios que trabajan o quieren trabajar en construcción de paz y desarrollo regional.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Análisis de conflicto y contexto territorial",
      "Política pública y paz territorial",
      "Participación comunitaria y diálogo social",
      "Formulación de proyectos de desarrollo",
      "Proyecto aplicado en territorio",
    ],
    vector: {
      traits: { colaborador: 5, lider: 4, creativo: 2, analitico: 2 },
      interests: { innovacion_social: 5, sector_publico: 4, gestion: 2, educacion: 2 },
      goals: { cambiar_carrera: 3, profundizar: 4, ascender: 2, emprender: 2 },
    },
    avatarIcon: "globe",
    avatarColors: ["#84BD00", "#1F5E33"],
  },
  {
    id: "gerencia-industria-moda",
    name: "Especialización en Gerencia de la Industria de la Moda",
    tagline: "Para quien ve una colección y ya está pensando en el negocio detrás",
    description:
      "Gestionas toda la cadena de la moda —producto, marca, retail y mercados— combinando visión creativa con números reales de rentabilidad y expansión.",
    audience:
      "Diseñadores, administradores y emprendedores del sector moda y textil que quieren liderar marcas o unidades de negocio.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Gerencia de marca y producto de moda",
      "Cadena de abastecimiento textil",
      "Retail y experiencia de compra",
      "Finanzas para la industria de la moda",
      "Plan de negocio de moda aplicado",
    ],
    vector: {
      traits: { creativo: 5, ejecutor: 3, lider: 3, analitico: 2 },
      interests: { moda: 5, gestion: 3, comunicacion: 3, finanzas: 2 },
      goals: { emprender: 5, ascender: 3, cambiar_carrera: 2, profundizar: 2 },
    },
    avatarIcon: "shirt",
    avatarColors: ["#e279c7", "#84BD00"],
  },
  {
    id: "gerencia-marca",
    name: "Especialización en Gerencia de la Marca",
    tagline: "Para quien entiende que una marca es una promesa que hay que cumplir",
    description:
      "Diseñas y gestionas estrategia de marca de punta a punta: posicionamiento, arquitectura de marca, experiencia y métricas de valor de marca.",
    audience:
      "Publicistas, comunicadores y profesionales de mercadeo que quieren liderar marca a nivel estratégico.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Estrategia y arquitectura de marca",
      "Investigación de marca y consumidor",
      "Experiencia de marca y punto de contacto",
      "Métricas y valor de marca",
      "Plan de marca aplicado",
    ],
    vector: {
      traits: { creativo: 5, lider: 3, analitico: 3, ejecutor: 2 },
      interests: { comunicacion: 5, gestion: 3, moda: 1 },
      goals: { ascender: 4, emprender: 3, cambiar_carrera: 3, profundizar: 2 },
    },
    avatarIcon: "palette",
    avatarColors: ["#FF8C6B", "#84BD00"],
  },
  {
    id: "analitica-datos",
    name: "Especialización en Analítica de Datos",
    tagline: "Para quien no se conforma con una respuesta hasta ver los datos",
    description:
      "Conviertes datos en decisiones: estadística aplicada, visualización, modelos predictivos y storytelling con datos para el negocio.",
    audience:
      "Ingenieros, administradores y profesionales analíticos que quieren especializarse en datos.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Estadística aplicada a negocios",
      "Visualización y storytelling de datos",
      "Modelos predictivos",
      "Bases de datos y business intelligence",
      "Proyecto de analítica aplicado",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 3, creativo: 2 },
      interests: { tecnologia: 5, finanzas: 3, gestion: 2 },
      goals: { ascender: 4, profundizar: 5, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "chart",
    avatarColors: ["#4FD1C5", "#2E7D32"],
  },
  {
    id: "transformacion-digital",
    name: "Especialización en Transformación Digital",
    tagline: "Para quien quiere liderar el cambio antes de que lo obliguen",
    description:
      "Lideras procesos de transformación digital en organizaciones: estrategia, cultura, tecnología y gestión del cambio.",
    audience:
      "Líderes y profesionales de cualquier área que impulsan la digitalización de su organización.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Estrategia de transformación digital",
      "Gestión del cambio organizacional",
      "Tecnologías emergentes aplicadas",
      "Cultura digital y nuevas formas de trabajo",
      "Proyecto de transformación aplicado",
    ],
    vector: {
      traits: { lider: 4, ejecutor: 4, analitico: 3, creativo: 2 },
      interests: { tecnologia: 5, gestion: 4 },
      goals: { ascender: 5, profundizar: 3, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "refresh",
    avatarColors: ["#8FD3F4", "#5B8C3A"],
  },
  {
    id: "gestion-tecnologias-informacion",
    name: "Especialización en Gestión de Tecnologías de la Información",
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
      interests: { tecnologia: 5, gestion: 3 },
      goals: { ascender: 5, profundizar: 4, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "cpu",
    avatarColors: ["#4FD1C5", "#1F5E33"],
  },
  {
    id: "gestion-negocios-digitales",
    name: "Especialización en Gestión de Negocios Digitales",
    tagline: "Para quien quiere montar o escalar un negocio 100% digital",
    description:
      "Diseñas, lanzas y escalas modelos de negocio digital: e-commerce, monetización, growth y operación de producto digital.",
    audience: "Emprendedores y profesionales que quieren crear o crecer negocios digitales.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Modelos de negocio digital",
      "E-commerce y monetización",
      "Growth y adquisición digital",
      "Operación de producto digital",
      "Plan de negocio digital aplicado",
    ],
    vector: {
      traits: { creativo: 4, ejecutor: 5, analitico: 3 },
      interests: { tecnologia: 4, gestion: 3, comunicacion: 3, finanzas: 2 },
      goals: { emprender: 5, cambiar_carrera: 3, ascender: 3, profundizar: 2 },
    },
    avatarIcon: "rocket",
    avatarColors: ["#FFD166", "#84BD00"],
  },
  {
    id: "gerencia-educativa",
    name: "Especialización en Gerencia Educativa",
    tagline: "Para quien quiere transformar una institución, no solo un aula",
    description:
      "Lideras instituciones y proyectos educativos: gestión, calidad, innovación pedagógica y liderazgo directivo.",
    audience:
      "Docentes, coordinadores y directivos que quieren asumir cargos de dirección educativa.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Gestión y calidad educativa",
      "Liderazgo directivo",
      "Innovación pedagógica",
      "Gestión de talento docente",
      "Proyecto de mejora institucional",
    ],
    vector: {
      traits: { lider: 5, colaborador: 4, creativo: 2, analitico: 2 },
      interests: { educacion: 5, gestion: 4 },
      goals: { ascender: 5, profundizar: 3, cambiar_carrera: 2, emprender: 1 },
    },
    avatarIcon: "graduation",
    avatarColors: ["#B7E778", "#5B8C3A"],
  },
  {
    id: "desarrollo-organizacional-talento-humano",
    name: "Especialización en Desarrollo Organizacional y Gestión del Talento Humano",
    tagline: "Para quien cree que la gente es lo que hace o rompe una empresa",
    description:
      "Te formas en cultura, desarrollo organizacional, selección y compensación, con foco en normatividad laboral colombiana y decisiones basadas en datos de personas.",
    audience:
      "Profesionales de RR.HH., líderes de equipo y psicólogos organizacionales que quieren pasar a la gerencia.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Desarrollo organizacional",
      "Selección por competencias",
      "Cultura, clima y bienestar",
      "Compensación y normatividad laboral",
      "Analítica de personas",
    ],
    vector: {
      traits: { colaborador: 5, lider: 4, creativo: 2, analitico: 2 },
      interests: { gestion: 4, educacion: 2, comunicacion: 2, innovacion_social: 2 },
      goals: { ascender: 4, profundizar: 4, cambiar_carrera: 3, emprender: 1 },
    },
    avatarIcon: "users",
    avatarColors: ["#84BD00", "#3FA796"],
  },
  {
    id: "prospectiva-estrategica",
    name: "Especialización en Prospectiva Estratégica",
    tagline: "Para quien piensa en lo que viene, no solo en lo que hay",
    description:
      "Aprendes a construir escenarios futuros y decisiones estratégicas de largo plazo para organizaciones y territorios.",
    audience:
      "Profesionales de planeación, estrategia y gestión pública o privada que piensan a largo plazo.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Métodos de prospectiva",
      "Construcción de escenarios",
      "Planeación estratégica",
      "Analítica para la decisión",
      "Proyecto prospectivo aplicado",
    ],
    vector: {
      traits: { analitico: 5, lider: 3, creativo: 3 },
      interests: { gestion: 4, sector_publico: 2, innovacion_social: 2 },
      goals: { ascender: 3, profundizar: 5, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "compass",
    avatarColors: ["#8FD3F4", "#2E7D32"],
  },
  {
    id: "inteligencia-negocios",
    name: "Especialización en Inteligencia de Negocios",
    tagline: "Para quien convierte reportes en decisiones de verdad",
    description:
      "Diseñas sistemas de inteligencia de negocios: modelado de datos, dashboards y análisis para apoyar decisiones estratégicas.",
    audience:
      "Profesionales de finanzas, sistemas y gestión que trabajan con información para decidir.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Modelado de datos para negocio",
      "Dashboards y visualización",
      "Data warehouse",
      "Analítica avanzada",
      "Proyecto de BI aplicado",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 3, lider: 2 },
      interests: { tecnologia: 4, finanzas: 4, gestion: 2 },
      goals: { ascender: 4, profundizar: 4, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "chart",
    avatarColors: ["#F2C94C", "#2E7D32"],
  },
  {
    id: "marketing-digital",
    name: "Especialización en Marketing Digital",
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
      interests: { comunicacion: 5, tecnologia: 3, gestion: 2 },
      goals: { emprender: 5, cambiar_carrera: 3, ascender: 3, profundizar: 2 },
    },
    avatarIcon: "megaphone",
    avatarColors: ["#FF8C6B", "#84BD00"],
  },
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
    avatarIcon: "target",
    avatarColors: ["#FFD166", "#84BD00"],
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
    avatarIcon: "coins",
    avatarColors: ["#F2C94C", "#5B8C3A"],
  },
  {
    id: "contratacion-estatal",
    name: "Especialización en Contratación Estatal",
    tagline: "Para quien conoce las reglas del Estado y sabe jugar bien con ellas",
    description:
      "Dominas el marco normativo de la contratación pública colombiana: procesos, riesgos, supervisión e interventoría de contratos estatales.",
    audience:
      "Abogados, administradores e ingenieros que participan en procesos de contratación con el Estado.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Marco normativo de contratación estatal",
      "Modalidades de selección",
      "Gestión de riesgo contractual",
      "Supervisión e interventoría",
      "Litigios y solución de controversias",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 3, lider: 2 },
      interests: { sector_publico: 5, gestion: 3 },
      goals: { ascender: 4, profundizar: 4, cambiar_carrera: 2, emprender: 1 },
    },
    avatarIcon: "scale",
    avatarColors: ["#8FD3F4", "#1F5E33"],
  },
  {
    id: "alta-gerencia",
    name: "Especialización en Alta Gerencia",
    tagline: "Para quien ya lidera y quiere pensar como quien decide el rumbo",
    description:
      "Desarrollas visión estratégica integral: liderazgo, finanzas, mercadeo y operaciones para asumir posiciones de alta dirección.",
    audience: "Profesionales con experiencia en liderazgo que aspiran a cargos de alta dirección.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Pensamiento estratégico",
      "Liderazgo de alto nivel",
      "Finanzas para directivos",
      "Mercadeo estratégico",
      "Proyecto de dirección aplicado",
    ],
    vector: {
      traits: { lider: 5, ejecutor: 4, analitico: 3, colaborador: 2 },
      interests: { gestion: 5, finanzas: 3 },
      goals: { ascender: 5, profundizar: 3, emprender: 2, cambiar_carrera: 1 },
    },
    avatarIcon: "compass",
    avatarColors: ["#FFD166", "#5B8C3A"],
  },
  {
    id: "gerencia-transformacion-energetica",
    name: "Especialización en Gerencia para la Transformación Energética",
    tagline: "Para quien quiere estar donde se está jugando el futuro de la energía",
    description:
      "Gestionas proyectos y estrategia en el sector energético en transición: energías renovables, eficiencia y regulación.",
    audience:
      "Ingenieros y profesionales del sector energético e industrial interesados en la transición energética.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Fundamentos de transición energética",
      "Energías renovables y eficiencia",
      "Regulación y mercado energético",
      "Gestión de proyectos energéticos",
      "Proyecto aplicado de transformación energética",
    ],
    vector: {
      traits: { analitico: 4, ejecutor: 4, lider: 3 },
      interests: { energia: 5, gestion: 3, tecnologia: 2 },
      goals: { ascender: 4, profundizar: 4, cambiar_carrera: 2, emprender: 2 },
    },
    avatarIcon: "zap",
    avatarColors: ["#F2C94C", "#1F5E33"],
  },
  {
    id: "gestion-innovacion-sistema-moda",
    name: "Especialización en Gestión de la Innovación del Sistema Moda",
    tagline: "Para quien quiere que la moda colombiana innove de verdad",
    description:
      "Lideras procesos de innovación en el sistema moda: producto, materiales, procesos y modelos de negocio sostenibles.",
    audience:
      "Diseñadores, ingenieros y gestores de la cadena textil-moda que buscan innovar en su sector.",
    duration: "2 semestres",
    modality: "Virtual y presencial (según sede)",
    curriculum: [
      "Innovación en el sistema moda",
      "Sostenibilidad y materiales",
      "Gestión de la innovación",
      "Modelos de negocio de moda",
      "Proyecto de innovación aplicado",
    ],
    vector: {
      traits: { creativo: 5, analitico: 2, ejecutor: 2, lider: 2 },
      interests: { moda: 5, innovacion_social: 2, gestion: 2 },
      goals: { emprender: 4, profundizar: 4, cambiar_carrera: 2, ascender: 2 },
    },
    avatarIcon: "shirt",
    avatarColors: ["#e279c7", "#5B8C3A"],
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
    avatarIcon: "shield",
    avatarColors: ["#84BD00", "#1F5E33"],
  },
  {
    id: "diseno-desarrollo-videojuegos",
    name: "Especialización en Diseño y Desarrollo de Videojuegos",
    tagline: "Para quien quiere crear mundos que la gente de verdad quiera jugar",
    description:
      "Diseñas y desarrollas videojuegos de punta a punta: narrativa, mecánicas, arte y programación de producto jugable.",
    audience:
      "Diseñadores, comunicadores e ingenieros interesados en la industria de los videojuegos.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Diseño de mecánicas y niveles",
      "Narrativa y worldbuilding",
      "Arte y animación para videojuegos",
      "Programación de videojuegos",
      "Proyecto de videojuego aplicado",
    ],
    vector: {
      traits: { creativo: 5, ejecutor: 3, analitico: 2 },
      interests: { tecnologia: 4, comunicacion: 3 },
      goals: { emprender: 4, cambiar_carrera: 4, profundizar: 3, ascender: 2 },
    },
    avatarIcon: "gamepad",
    avatarColors: ["#8FD3F4", "#84BD00"],
  },
  {
    id: "ciberseguridad",
    name: "Especialización en Ciberseguridad",
    tagline: "Para quien piensa como el atacante para proteger mejor",
    description:
      "Proteges infraestructura y datos: análisis de riesgo, arquitectura segura, respuesta a incidentes y normatividad de seguridad de la información.",
    audience:
      "Ingenieros y profesionales de TI que quieren especializarse en seguridad informática.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Fundamentos de ciberseguridad",
      "Arquitectura de seguridad",
      "Gestión de riesgo y cumplimiento",
      "Respuesta a incidentes",
      "Proyecto de ciberseguridad aplicado",
    ],
    vector: {
      traits: { analitico: 5, ejecutor: 3, lider: 2 },
      interests: { tecnologia: 5, gestion: 2, sector_publico: 1 },
      goals: { ascender: 4, profundizar: 5, cambiar_carrera: 2, emprender: 1 },
    },
    avatarIcon: "lock",
    avatarColors: ["#4FD1C5", "#1F5E33"],
  },
  {
    id: "marketing-politico",
    name: "Especialización en Marketing Político",
    tagline: "Para quien quiere que las buenas ideas también sepan comunicarse y ganar",
    description:
      "Diseñas estrategias de comunicación y campaña política: mensaje, opinión pública, redes y gestión de imagen.",
    audience:
      "Comunicadores, politólogos y profesionales que trabajan en campañas o comunicación pública.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Estrategia de campaña",
      "Opinión pública y mensaje político",
      "Comunicación digital y redes",
      "Gestión de imagen y crisis",
      "Proyecto de campaña aplicado",
    ],
    vector: {
      traits: { creativo: 4, lider: 4, ejecutor: 3, analitico: 2 },
      interests: { comunicacion: 5, sector_publico: 3, innovacion_social: 2 },
      goals: { cambiar_carrera: 3, ascender: 3, emprender: 3, profundizar: 2 },
    },
    avatarIcon: "landmark",
    avatarColors: ["#FF8C6B", "#2E7D32"],
  },
  {
    id: "inteligencia-artificial",
    name: "Especialización en Inteligencia Artificial",
    tagline: "Para quien quiere construir con IA, no solo usarla",
    description:
      "Diseñas y aplicas soluciones de inteligencia artificial y machine learning para resolver problemas reales de negocio.",
    audience: "Ingenieros, analistas y profesionales técnicos que quieren especializarse en IA.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Fundamentos de machine learning",
      "Procesamiento de datos para IA",
      "Modelos de IA aplicada",
      "Ética y gestión de proyectos de IA",
      "Proyecto de IA aplicado",
    ],
    vector: {
      traits: { analitico: 5, creativo: 3, ejecutor: 2 },
      interests: { tecnologia: 5 },
      goals: { profundizar: 5, ascender: 4, cambiar_carrera: 3, emprender: 2 },
    },
    avatarIcon: "brain",
    avatarColors: ["#4FD1C5", "#84BD00"],
  },
  {
    id: "gobernanza-inteligencia-artificial",
    name: "Especialización en Gobernanza de la Inteligencia Artificial",
    tagline: "Para quien quiere poner reglas donde la tecnología va más rápido que la ley",
    description:
      "Formulas política, regulación y marcos éticos para el uso responsable de la inteligencia artificial en organizaciones y el Estado.",
    audience:
      "Abogados, gestores públicos y profesionales de tecnología interesados en regulación y ética de IA.",
    duration: "2 semestres",
    modality: "Virtual",
    curriculum: [
      "Fundamentos de IA para no técnicos",
      "Marcos regulatorios de IA",
      "Ética y riesgo algorítmico",
      "Gobernanza de datos",
      "Proyecto de gobernanza de IA aplicado",
    ],
    vector: {
      traits: { analitico: 4, lider: 3, colaborador: 2 },
      interests: { tecnologia: 3, sector_publico: 4, gestion: 2 },
      goals: { profundizar: 4, cambiar_carrera: 3, ascender: 3, emprender: 1 },
    },
    avatarIcon: "brain",
    avatarColors: ["#8FD3F4", "#5B8C3A"],
  },
];

export const getSpecialization = (id: string) =>
  specializations.find((program) => program.id === id);
