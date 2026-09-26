export type HatKey = 'blanco' | 'rojo' | 'negro' | 'amarillo' | 'verde' | 'azul';

export interface HatDescriptor {
  id: HatKey;
  name: string;
  colorName: string;
  bgHex: string;
  glowHex: string;
  borderClass: string;
  badgeClass: string;
  focusArea: string;
  iconName: string;
  mantra: string;
}

export const TRAINER_HATS: Record<HatKey, HatDescriptor> = {
  blanco: {
    id: 'blanco',
    name: 'Sombrero Blanco',
    colorName: 'Blanco Objetivo',
    bgHex: '#f8fafc',
    glowHex: 'rgba(248, 250, 252, 0.3)',
    borderClass: 'border-slate-200',
    badgeClass: 'bg-slate-200/20 text-slate-100 border-slate-300/40',
    focusArea: 'Datos puros, cifras y hechos sin juicio',
    iconName: 'FileText',
    mantra: 'Solo lo que puede ser verificado en una hoja de cálculo.'
  },
  rojo: {
    id: 'rojo',
    name: 'Sombrero Rojo',
    colorName: 'Rojo Fuego',
    bgHex: '#ef4444',
    glowHex: 'rgba(239, 68, 68, 0.3)',
    borderClass: 'border-rose-500',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    focusArea: 'Intuición cruda, rabia, miedo y emociones sin filtro',
    iconName: 'Heart',
    mantra: 'Nombra al monstruo sin pedir perdón ni buscar justificaciones.'
  },
  negro: {
    id: 'negro',
    name: 'Sombrero Negro',
    colorName: 'Negro Abogado del Diablo',
    bgHex: '#0f172a',
    glowHex: 'rgba(51, 65, 85, 0.4)',
    borderClass: 'border-slate-700',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-600',
    focusArea: 'Riesgos fatales, costos ocultos y vulnerabilidades',
    iconName: 'AlertTriangle',
    mantra: '¿Qué se romperá primero si todo sale exactamente como planeas?'
  },
  amarillo: {
    id: 'amarillo',
    name: 'Sombrero Amarillo',
    colorName: 'Amarillo Solar',
    bgHex: '#eab308',
    glowHex: 'rgba(234, 179, 8, 0.3)',
    borderClass: 'border-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    focusArea: 'Beneficios tangibles, ventajas competitivas y retorno',
    iconName: 'Lightbulb',
    mantra: 'El mejor escenario posible sostenido por razones lógicas.'
  },
  verde: {
    id: 'verde',
    name: 'Sombrero Verde',
    colorName: 'Verde Mutación',
    bgHex: '#10b981',
    glowHex: 'rgba(16, 185, 129, 0.3)',
    borderClass: 'border-emerald-500',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    focusArea: 'Creatividad disruptiva, hacks y alternativas ilógicas',
    iconName: 'Sparkles',
    mantra: 'La regla número uno es que la regla anterior ya no aplica.'
  },
  azul: {
    id: 'azul',
    name: 'Sombrero Azul',
    colorName: 'Azul Comando',
    bgHex: '#0284c7',
    glowHex: 'rgba(2, 132, 199, 0.3)',
    borderClass: 'border-cyan-500',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    focusArea: 'Metacognición, orden de prioridades y control táctico',
    iconName: 'Compass',
    mantra: 'El director de orquesta que manda callar los ruidos parásitos.'
  }
};

export type CharacterKey = 'chola' | 'fresa' | 'malandra';

export interface CharacterProfile {
  id: CharacterKey;
  name: string;
  alias: string;
  tagline: string;
  avatarBg: string;
  accentColor: string;
  favoriteHats: HatKey[];
  voiceStyle: string;
  introLines: string[];
  blockReaction: string;
  successReaction: string;
  criticalPrompt: string;
}

export const CHARACTERS: Record<CharacterKey, CharacterProfile> = {
  chola: {
    id: 'chola',
    name: 'La Chola',
    alias: 'Criterio de Calle & Sentido Común',
    tagline: 'Directa, sin adornos corporativos ni justificaciones blandas.',
    avatarBg: 'from-amber-600 to-rose-700',
    accentColor: 'text-amber-400',
    favoriteHats: ['negro', 'rojo'],
    voiceStyle: 'Caló urbano, honestidad brutal y pragmatismo de supervivencia.',
    introLines: [
      '¡Órale carnal! Déjate de rodeos teóricos y dime la neta de lo que está pasando.',
      'Aquí no venimos a aplaudirte las dudas; venimos a ver si aguantas vara con la verdad.',
      'Si me sales con excusas tibias, te regreso el sombrero de inmediato.'
    ],
    blockReaction: '¿Ya te me congelaste, mi reina? Suelta la sopa, nadie te va a juzgar pero no te me hagas güey.',
    successReaction: '¡Esa es la actitud, firme y al grano! Así es como se resuelven los tiros de a de veras.',
    criticalPrompt: 'Dime sin filtro qué es lo que más te da miedo que se rompa en este momento.'
  },
  fresa: {
    id: 'fresa',
    name: 'La Fresa',
    alias: 'Optimización de Estatus & Auditoría de ROI',
    tagline: 'Elegancia despiadada, números fríos y costo de oportunidad.',
    avatarBg: 'from-rose-500 to-purple-700',
    accentColor: 'text-pink-400',
    favoriteHats: ['blanco', 'azul'],
    voiceStyle: 'Tono sofisticado, ironía fina, enfoque en resultados medibles y reputación.',
    introLines: [
      'O sea, literal: o me das números y contratos o es un oso total perder tanto tiempo.',
      'A ver, cero drama innecesario. Muéstrame la estructura ejecutiva o next.',
      'Holis. Vine a auditar tu proyecto antes de que sigas quemando presupuesto como si nada.'
    ],
    blockReaction: 'O sea, ¿hello? ¿Te quedaste en shock con la pregunta? Es super básica, despierta.',
    successReaction: 'Ok, me sorprendiste, súper pulido y con clase. Esto sí vale la pena monetizar.',
    criticalPrompt: '¿Cuánto dinero o reputación estás perdiendo cada semana que dejas esto sin resolver?'
  },
  malandra: {
    id: 'malandra',
    name: 'La Malandra',
    alias: 'Hacker de Reglas & Caos Constructivo',
    tagline: 'Estratega disidente, atajos creativos y visión anti-sistema.',
    avatarBg: 'from-emerald-500 to-cyan-600',
    accentColor: 'text-emerald-400',
    favoriteHats: ['verde', 'amarillo'],
    voiceStyle: 'Cínica, brillante, buscando la trampa en el sistema y la ventaja oculta.',
    introLines: [
      '¿Para qué seguir el manual aburrido si podemos patear el tablero y ganar antes?',
      'Basta de pensar dentro de la caja. La caja ni siquiera existe, te la inventaron.',
      'Si el camino normal está bloqueado, abrimos un boquete en la pared. Venga esa idea loca.'
    ],
    blockReaction: '¿Te asustó salirte del guión? Relaja el hombro y suelta lo más absurdo que se te ocurra.',
    successReaction: '¡Uff, finísimo atraco intelectual! Nadie se esperaba esa jugada, me gusta tu estilo.',
    criticalPrompt: 'Si estuvieras 100% seguro de no ser atrapado ni juzgado, ¿cuál sería tu jugada maestra?'
  }
};

export interface CognitiveChallenge {
  id: string;
  hat: HatKey;
  mode: 'normal' | 'modo_suave' | 'combinado_verde_negro' | 'modo_caos' | 'inversion';
  title: string;
  prompt: string;
  characterDialogue: string;
  timeLimitSeconds: number;
  keywords: string[];
  minimumChars: number;
}

export interface CognitiveEvaluation {
  id: string;
  hat: HatKey;
  character: CharacterKey;
  mode: string;
  prompt: string;
  userResponse: string;
  timeTaken: number;
  score: number; // 0 to 100
  stars: number; // 1 to 5
  feedback: string;
  dominantInsight: string;
  timestamp: string;
}

export interface PlayerCognitiveProfile {
  verde: number;
  negro: number;
  rojo: number;
  azul: number;
  blanco: number;
  amarillo: number;
  tiempoPromedio: number[];
  bloqueos: number;
  creatividadScore: number;
  criticaScore: number;
  emocionScore: number;
  rondasCompletadas: number;
  rachaActual: number;
  mejorRacha: number;
  nivelMental: number; // 1: Iniciado (1-2), 2: Calibrador (3-5), 3: Analista Táctico (6-10), 4: Estratega Multidimensional (11-18), 5: Maestro Hexagonal (19+)
  historialEvaluaciones: CognitiveEvaluation[];
}

export const INITIAL_PLAYER_PROFILE: PlayerCognitiveProfile = {
  verde: 0,
  negro: 0,
  rojo: 0,
  azul: 0,
  blanco: 0,
  amarillo: 0,
  tiempoPromedio: [],
  bloqueos: 0,
  creatividadScore: 0,
  criticaScore: 0,
  emocionScore: 0,
  rondasCompletadas: 0,
  rachaActual: 0,
  mejorRacha: 0,
  nivelMental: 1,
  historialEvaluaciones: []
};

export const MENTAL_LEVEL_TITLES: Record<number, { title: string; desc: string; badge: string }> = {
  1: {
    title: 'Iniciado Monofocal',
    desc: 'Tu pensamiento depende de un solo sombrero habitual. Empiezas a sentir las incomodidades de los puntos ciegos.',
    badge: 'Nivel 1 • Conciencia de Sesgo'
  },
  2: {
    title: 'Calibrador de Contrastes',
    desc: 'Logras alternar entre datos (Blanco) y emociones (Rojo) sin que una contamine a la otra.',
    badge: 'Nivel 2 • Disociación Activa'
  },
  3: {
    title: 'Analista Táctico',
    desc: 'Equilibras la crítica implacable (Negro) con la oportunidad de negocio (Amarillo). Tomas decisiones sin pánico.',
    badge: 'Nivel 3 • Filtro de Riesgo'
  },
  4: {
    title: 'Estratega Multidimensional',
    desc: 'Eres capaz de ejecutar Sombrero Verde en modo caos y ordenar el entregable con Sombrero Azul en minutos.',
    badge: 'Nivel 4 • Agilidad Hexagonal'
  },
  5: {
    title: 'Maestro Hexagonal',
    desc: 'Equilibrio cognitivo pleno. Ningún sombrero te domina; los utilizas como herramientas quirúrgicas a voluntad.',
    badge: 'Nivel 5 • Maestro de Criterio'
  }
};
