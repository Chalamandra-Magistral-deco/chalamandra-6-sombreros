/**
 * Lista visual de los 6 sombreros para la "Armería de Sombreros".
 * Extraída de App.tsx como parte de la división del monolito.
 *
 * Iconos: FileText, Heart, Lightbulb, ShieldAlert, Sun, Terminal
 */

import {
  FileText,
  Heart,
  Lightbulb,
  ShieldAlert,
  Sun,
  Terminal,
} from 'lucide-react';

// Imágenes de cada sombrero (1200x630 aprox, generadas por IA)
export const WHITE_HAT_IMAGE = '/src/assets/images/white_hat_icon_1784029192992.jpg';
export const RED_HAT_IMAGE = '/src/assets/images/red_hat_icon_1784029203966.jpg';
export const BLACK_HAT_IMAGE = '/src/assets/images/black_hat_icon_1784029215508.jpg';
export const YELLOW_HAT_IMAGE = '/src/assets/images/yellow_hat_icon_1784029226659.jpg';
export const GREEN_HAT_IMAGE = '/src/assets/images/green_hat_icon_1784029237771.jpg';
export const BLUE_HAT_IMAGE = '/src/assets/images/blue_hat_icon_1784029248993.jpg';

// Visual helper lists for the interactive grid (La Armería de Sombreros)
export const academyHats = [
  {
    id: 'blanco',
    title: 'Sombrero Blanco',
    icon: FileText,
    image: WHITE_HAT_IMAGE,
    color: 'bg-slate-300 text-slate-900',
    borderColor: 'border-slate-300/40',
    auraColor: 'shadow-slate-300/20',
    mantra: 'La verdad objetiva no tiene partido.',
    desc: 'Enfocado en recopilar hechos medibles, datos históricos, cifras y transacciones reales. Se despoja de opiniones y asunciones.',
    questions: ['¿Cuáles son los números exactos?', '¿Qué pruebas tangibles existen?', '¿Qué dijo textualmente la otra persona?']
  },
  {
    id: 'rojo',
    title: 'Sombrero Rojo',
    icon: Heart,
    image: RED_HAT_IMAGE,
    color: 'bg-rose-600 text-white',
    borderColor: 'border-rose-500/40',
    auraColor: 'shadow-rose-600/30',
    mantra: 'Las corazonadas mandan sobre el plano oculto.',
    desc: 'Libera la intuición visceral, el pánico, el odio, la ilusión o el rencor sin filtros lógicos ni justificaciones de ningún tipo.',
    questions: ['¿Qué me dice el estómago?', '¿Qué emoción me provoca esta situación?', '¿Tengo sospechas intuitivas?']
  },
  {
    id: 'negro',
    title: 'Sombrero Negro',
    icon: ShieldAlert,
    image: BLACK_HAT_IMAGE,
    color: 'bg-violet-700 text-white',
    borderColor: 'border-violet-500/40',
    auraColor: 'shadow-violet-600/30',
    mantra: 'Prevenir la catástrofe es asegurar la supervivencia.',
    desc: 'El evaluador de riesgos más quirúrgico. Encuentra los agujeros en el plan, pérdidas máximas y contingencias críticas.',
    questions: ['¿Qué es lo peor que puede pasar?', '¿Cuánto dinero o reputación arriesgamos?', '¿Dónde está la trampa?']
  },
  {
    id: 'amarillo',
    title: 'Sombrero Amarillo',
    icon: Sun,
    image: YELLOW_HAT_IMAGE,
    color: 'bg-yellow-500 text-slate-950',
    borderColor: 'border-yellow-400/40',
    auraColor: 'shadow-yellow-500/30',
    mantra: 'La oportunidad brilla hasta en la fractura.',
    desc: 'Pensamiento constructivo. Encuentra los beneficios colaterales, los aprendizajes forzados y el valor oculto del dilema.',
    questions: ['¿Cómo capitalizo esta crisis?', '¿Qué fortalezas nuevas me da?', '¿Dónde hay un billete flotando?']
  },
  {
    id: 'verde',
    title: 'Sombrero Verde',
    icon: Lightbulb,
    image: GREEN_HAT_IMAGE,
    color: 'bg-emerald-500 text-slate-950',
    borderColor: 'border-emerald-400/40',
    auraColor: 'shadow-emerald-500/30',
    mantra: 'Si la regla te atrapa, rompe la mesa.',
    desc: 'Creatividad extrema y pensamiento disruptivo. Soluciones locas, humor absurdo o movimientos laterales inesperados.',
    questions: ['¿Qué haría un loco en mi lugar?', '¿Cómo puedo alterar las reglas drásticamente?', '¿Qué salida graciosa existe?']
  },
  {
    id: 'azul',
    title: 'Sombrero Azul',
    icon: Terminal,
    image: BLUE_HAT_IMAGE,
    color: 'bg-cyan-500 text-slate-950',
    borderColor: 'border-cyan-400/40',
    auraColor: 'shadow-cyan-500/30',
    mantra: 'El general no analiza, ordena la marcha.',
    desc: 'El control ejecutivo de salida. Toma las riendas, destila todo el escaneo y establece un comando de acción de choque.',
    questions: ['¿Cuál es la primera acción concreta?', '¿Qué paso irreversible daré hoy?', '¿Cómo mido el cumplimiento?']
  }
];
