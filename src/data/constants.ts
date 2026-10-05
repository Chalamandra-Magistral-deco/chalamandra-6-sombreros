/**
 * Constantes visuales del proyecto.
 * FLAVOR_THEMES define los 5 temas cromáticos seleccionables.
 */

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
