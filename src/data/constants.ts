import { 
  FileText, 
  HelpCircle, 
  Flame, 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  Zap, 
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Crosshair
} from 'lucide-react';

export interface StepConfig {
  id: string;
  field: string;
  label: string;
  title: string;
  desc: string;
  placeholder: string;
  help: string;
  type: 'text' | 'textarea';
  hatColor: string;
  icon: any;
}

export interface AcademyHat {
  id: string;
  title: string;
  color: string;
  auraColor: string;
  borderColor: string;
  icon: any;
  mantra: string;
  desc: string;
  questions: string[];
  image: string;
}

export const FLAVOR_THEMES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neón',
    gradient: 'from-amber-400 via-rose-500 to-cyan-400',
    accentColor: 'text-rose-400',
    bgBadge: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
    buttonActive: 'bg-rose-500 text-slate-950 font-black shadow-lg shadow-rose-500/30',
    aura: 'rgba(244, 63, 94, 0.25)',
  },
  lava: {
    id: 'lava',
    name: 'Lava Dragón',
    gradient: 'from-orange-400 via-rose-600 to-amber-500',
    accentColor: 'text-amber-400',
    bgBadge: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    buttonActive: 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30',
    aura: 'rgba(245, 158, 11, 0.3)',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Menta',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    accentColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    buttonActive: 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30',
    aura: 'rgba(52, 211, 153, 0.25)',
  },
  nebula: {
    id: 'nebula',
    name: 'Nébula Cósmica',
    gradient: 'from-violet-400 via-fuchsia-500 to-indigo-400',
    accentColor: 'text-violet-400',
    bgBadge: 'bg-violet-500/15 border-violet-500/40 text-violet-300',
    buttonActive: 'bg-violet-500 text-white font-black shadow-lg shadow-violet-500/30',
    aura: 'rgba(167, 139, 250, 0.3)',
  },
  gold: {
    id: 'gold',
    name: 'Oro Imperial',
    gradient: 'from-yellow-300 via-amber-400 to-yellow-600',
    accentColor: 'text-yellow-300',
    bgBadge: 'bg-yellow-400/15 border-yellow-400/40 text-yellow-200',
    buttonActive: 'bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-400/30',
    aura: 'rgba(250, 204, 21, 0.3)',
  }
} as const;

export const HATS_STEPS: StepConfig[] = [
  {
    id: 'azotea',
    field: 'azotea',
    label: 'El Problema / Conflicto',
    title: 'Definición de la Azotea',
    desc: 'Describe el conflicto, decisión o encrucijada estratégica sin filtros.',
    placeholder: 'Ej: Tenemos que decidir si expandirnos a un nuevo mercado o consolidar el producto actual...',
    help: 'La Azotea es la situación objetiva que someteremos al filtro de los 6 Sombreros.',
    type: 'textarea',
    hatColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    icon: FileText
  },
  {
    id: 'azul',
    field: 'azul',
    label: 'Sombrero Azul (Control)',
    title: 'Facilitación y Objetivos',
    desc: 'Define las reglas del juego, el tiempo límite y qué se espera lograr al final.',
    placeholder: 'Ej: El objetivo es salir con una decisión clara sobre la prioridad de los próximos 6 meses...',
    help: 'El Sombrero Azul organiza el pensamiento y marca la hoja de ruta.',
    type: 'textarea',
    hatColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    icon: Compass
  },
  {
    id: 'blanco',
    field: 'blanco',
    label: 'Sombrero Blanco (Hechos)',
    title: 'Datos Puros e Información',
    desc: 'Aporta únicamente datos verificables, cifras, antecedentes y hechos objetivos. Cero opiniones.',
    placeholder: 'Ej: Contamos con $50,000 USD de presupuesto, 3 desarrolladores y 1,200 clientes activos...',
    help: 'El Sombrero Blanco exige imparcialidad absoluta y evidencias factuales.',
    type: 'textarea',
    hatColor: 'border-slate-300/40 bg-slate-200/10 text-slate-200',
    icon: Brain
  },
  {
    id: 'rojo',
    field: 'rojo',
    label: 'Sombrero Rojo (Emociones)',
    title: 'Intuición y Corazonadas',
    desc: 'Expresa tus sensaciones viscerales, corazonadas o temores sin necesidad de justificarlos.',
    placeholder: 'Ej: Siento que si esperamos más perderemos el impulso, pero me inquieta la carga de trabajo...',
    help: 'El Sombrero Rojo valida la inteligencia emocional sin pedir explicaciones racionales.',
    type: 'textarea',
    hatColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    icon: Flame
  },
  {
    id: 'negro',
    field: 'negro',
    label: 'Sombrero Negro (Cautela)',
    title: 'Riesgos y Juicio Crítico',
    desc: 'Identifica los peligros, vulnerabilidades, costes ocultos o motivos por los que podría fallar.',
    placeholder: 'Ej: Si lanzamos antes de tiempo, la calidad sufrirá y la competencia podría reaccionar rápido...',
    help: 'El Sombrero Negro actúa como filtro de supervivencia y abogado del diablo.',
    type: 'textarea',
    hatColor: 'border-slate-600/60 bg-slate-900/80 text-slate-300',
    icon: ShieldAlert
  },
  {
    id: 'amarillo',
    field: 'amarillo',
    label: 'Sombrero Amarillo (Optimismo)',
    title: 'Beneficios y Oportunidades',
    desc: 'Explora el mejor escenario posible, el valor añadido y los beneficios a largo plazo.',
    placeholder: 'Ej: Si lo logramos, aumentaremos nuestra facturación un 40% y dominaremos el nicho...',
    help: 'El Sombrero Amarillo busca activamente el valor constructivo y la oportunidad.',
    type: 'textarea',
    hatColor: 'border-yellow-400/40 bg-yellow-400/10 text-yellow-300',
    icon: Lightbulb
  },
  {
    id: 'verde',
    field: 'verde',
    label: 'Sombrero Verde (Creatividad)',
    title: 'Alternativas e Innovación',
    desc: 'Propón ideas fuera de la caja, soluciones disruptivas o enfoques alternativos.',
    placeholder: 'Ej: ¿Y si lanzamos una beta cerrada para 100 usuarios VIP mientras desarrollamos el resto?...',
    help: 'El Sombrero Verde rompe paradigmas y genera innovación abierta.',
    type: 'textarea',
    hatColor: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    icon: Sparkles
  }
];

export const LADDER_STEPS: StepConfig[] = [
  {
    id: 'problema',
    field: 'problema',
    label: 'Nivel 1: Problema Raíz',
    title: 'Diagnóstico Crucial',
    desc: 'Describe el problema real de fondo, más allá de los síntomas superficiales.',
    placeholder: 'Ej: Alta rotación de clientes debido a falta de soporte en tiempo real...',
    help: 'Sin un diagnóstico preciso, la estrategia apuntará a la meta equivocada.',
    type: 'textarea',
    hatColor: 'border-red-500/40 bg-red-500/10 text-red-400',
    icon: AlertTriangle
  },
  {
    id: 'instinto',
    field: 'instinto',
    label: 'Nivel 2: Reacción Instintiva',
    title: 'Impulso Inicial',
    desc: '¿Cuál fue tu primera reacción o impulso inmediato ante este problema?',
    placeholder: 'Ej: Reducir los precios inmediatamente para retenerlos a toda costa...',
    help: 'Reconocer el instinto evita actuar por pánico sin un filtro analítico.',
    type: 'textarea',
    hatColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    icon: Zap
  },
  {
    id: 'filtros',
    field: 'filtros',
    label: 'Nivel 3: Filtros de Evaluación',
    title: 'Criterios de Validación',
    desc: '¿Qué condiciones debe cumplir cualquier solución para ser considerada viable?',
    placeholder: 'Ej: No debe aumentar nuestros costos operativos más de un 10% y debe implementarse en 30 días...',
    help: 'Los filtros delimitan el terreno de juego estratégico.',
    type: 'textarea',
    hatColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    icon: Crosshair
  },
  {
    id: 'estrategia',
    field: 'estrategia',
    label: 'Nivel 4: Estrategia Maestra',
    title: 'Plan de Acción Diseñado',
    desc: 'Define el plan concreto respaldado por los filtros y el análisis de los Sombreros.',
    placeholder: 'Ej: Implementar un chatbot híbrido con IA y capacitar a 2 agentes para casos complejos...',
    help: 'La estrategia conecta el diagnóstico con los resultados medibles.',
    type: 'textarea',
    hatColor: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
    icon: Compass
  },
  {
    id: 'ejecucion',
    field: 'ejecucion',
    label: 'Nivel 5: Ejecución y Hitos',
    title: 'Puntos de Control',
    desc: '¿Cuáles son los pasos inmediatos y las fechas límite para medir el avance?',
    placeholder: 'Ej: Semana 1: Configurar bot. Semana 2: Pruebas internas. Semana 3: Despliegue...',
    help: 'Una estrategia sin hitos de ejecución es solo un deseo.',
    type: 'textarea',
    hatColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    icon: CheckCircle2
  },
  {
    id: 'inmunidad',
    field: 'inmunidad',
    label: 'Nivel 6: Inmunidad a Fallos',
    title: 'Plan de Contingencia',
    desc: '¿Qué harás si el plan principal falla o sufre retrasos imprevistos?',
    placeholder: 'Ej: Si la adopción del bot cae del 60%, activaremos soporte directo vía WhatsApp temporal...',
    help: 'La inmunidad garantiza la resiliencia operativa de la decisión.',
    type: 'textarea',
    hatColor: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    icon: ShieldAlert
  }
];

export const ACADEMY_HATS: AcademyHat[] = [
  {
    id: 'azul',
    title: 'Sombrero Azul',
    color: 'bg-blue-600 text-white',
    auraColor: 'shadow-blue-500/40',
    borderColor: 'border-blue-500',
    icon: Compass,
    mantra: 'El Director de Orquesta',
    desc: 'Controla el proceso de pensamiento. Define las reglas del juego, establece la agenda, modera los tiempos y sintetiza las conclusiones.',
    questions: [
      '¿Cuál es el problema exacto que estamos tratando de resolver?',
      '¿Qué sombrero debemos usar a continuación?',
      '¿Cuáles son nuestras conclusiones definitivas?'
    ],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'blanco',
    title: 'Sombrero Blanco',
    color: 'bg-slate-100 text-slate-900',
    auraColor: 'shadow-slate-300/40',
    borderColor: 'border-slate-300',
    icon: Brain,
    mantra: 'El Científico Neutral',
    desc: 'Se centra en los datos factuales, cifras e información objetiva disponible. No emite opiniones ni juicios de valor.',
    questions: [
      '¿Qué información verificable tenemos sobre este caso?',
      '¿Qué datos nos faltan y dónde podemos conseguirlos?',
      '¿Qué hechos son totalmente irrefutables?'
    ],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'rojo',
    title: 'Sombrero Rojo',
    color: 'bg-rose-600 text-white',
    auraColor: 'shadow-rose-500/40',
    borderColor: 'border-rose-500',
    icon: Flame,
    mantra: 'El Espejo Emocional',
    desc: 'Aporta la intuición, los sentimientos y las sensaciones viscerales sin necesidad de justificarlas racionalmente.',
    questions: [
      '¿Qué me dice mi corazonada sobre esta propuesta?',
      '¿Qué emociones me despierta este proyecto?',
      '¿Qué temores viscerales existen en el equipo?'
    ],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'negro',
    title: 'Sombrero Negro',
    color: 'bg-slate-900 text-slate-100 border border-slate-700',
    auraColor: 'shadow-slate-900/60',
    borderColor: 'border-slate-700',
    icon: ShieldAlert,
    mantra: 'El Abogado del Diablo',
    desc: 'Evalúa los riesgos, debilidades, obstáculos y posibles consecuencias negativas de forma estrictamente lógica.',
    questions: [
      '¿Qué podría salir mal si ejecutamos esta decisión?',
      '¿Cuáles son las fallas de seguridad o costes ocultos?',
      '¿Por qué esto podría no funcionar?'
    ],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'amarillo',
    title: 'Sombrero Amarillo',
    color: 'bg-amber-400 text-slate-950',
    auraColor: 'shadow-amber-400/40',
    borderColor: 'border-amber-400',
    icon: Lightbulb,
    mantra: 'El Visionario Optimista',
    desc: 'Busca el valor, los beneficios, las oportunidades y las ventajas de cada idea sobre una base lógica y constructiva.',
    questions: [
      '¿Cuáles son los mayores beneficios a largo plazo?',
      '¿Cómo podemos hacer que esta idea funcione?',
      '¿Qué valor único aporta a nuestros usuarios?'
    ],
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'verde',
    title: 'Sombrero Verde',
    color: 'bg-emerald-500 text-slate-950',
    auraColor: 'shadow-emerald-500/40',
    borderColor: 'border-emerald-400',
    icon: Sparkles,
    mantra: 'El Alquimista Creativo',
    desc: 'Representa la creatividad, las nuevas alternativas, las soluciones fuera de lo común y la innovación sin restricciones.',
    questions: [
      '¿Qué alternativas locas no hemos considerado?',
      '¿Cómo podemos abordar esto de forma disruptiva?',
      '¿Existe una forma radicalmente distinta de solucionarlo?'
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80'
  }
];
