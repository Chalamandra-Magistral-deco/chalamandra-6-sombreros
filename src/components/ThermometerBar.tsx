/**
 * ThermometerBar — Barras de progreso en tiempo real de los 6 sombreros / escalera.
 * Extraído de App.tsx como parte de la división del monolito.
 *
 * Props:
 *   activeTab: 'hats' | 'ladder' | 'trainer' | 'chat' — decide qué termómetros mostrar
 *   metrics:   Record<string, number> — valores calculados en App.tsx
 */

import { Sliders } from 'lucide-react';

type Tab = 'hats' | 'ladder' | 'trainer' | 'chat';

interface ThermometerBarProps {
  activeTab: Tab;
  metrics: Record<string, number>;
}

export function ThermometerBar({ activeTab, metrics }: ThermometerBarProps) {
  return (
    <div className="bg-[#0b101c]/60 p-4 rounded-xl border border-slate-850 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5" />
          Termómetros de Entrada en Tiempo Real
        </span>
        <span className="text-[10px] text-slate-500">Métricas de Complejidad</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {activeTab === 'hats' ? (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>⚪ Datos (Blanco)</span>
                <span className="font-mono">{metrics.blanco}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full transition-all duration-300" style={{ width: `${metrics.blanco}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🔴 Emoción (Rojo)</span>
                <span className="font-mono">{metrics.rojo}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${metrics.rojo}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>⚫ Riesgos (Negro)</span>
                <span className="font-mono">{metrics.negro}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full transition-all duration-300" style={{ width: `${metrics.negro}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🟡 Ganancia (Amarillo)</span>
                <span className="font-mono">{metrics.amarillo}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-300" style={{ width: `${metrics.amarillo}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🟢 Ideas (Verde)</span>
                <span className="font-mono">{metrics.verde}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${metrics.verde}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🔵 Comando (Azul)</span>
                <span className="font-mono">{metrics.azul}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${metrics.azul}%` }} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>👁️ N1 Instinto</span>
                <span className="font-mono">{metrics.instinto}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${metrics.instinto}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🛡️ N2 Trampa</span>
                <span className="font-mono">{metrics.emocion}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full transition-all duration-300" style={{ width: `${metrics.emocion}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🎯 N3 Clasificación</span>
                <span className="font-mono">{metrics.jugada}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${metrics.jugada}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>⚡ N5 Parche</span>
                <span className="font-mono">{metrics.ejecucion}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-300" style={{ width: `${metrics.ejecucion}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>📑 N6 Bitácora</span>
                <span className="font-mono">{metrics.bitacora}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${metrics.bitacora}%` }} />
              </div>
            </div>
    
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>🔵 N7 Blindaje</span>
                <span className="font-mono">{metrics.inmunidad}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${metrics.inmunidad}%` }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
