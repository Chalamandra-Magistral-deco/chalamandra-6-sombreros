import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart3, Info, TrendingUp, History } from 'lucide-react';
import { SavedHatsRitual } from '../lib/storageService';

export interface HatsData {
  azotea: string;
  blanco: string;
  rojo: string;
  negro: string;
  amarillo: string;
  verde: string;
  azul: string;
}

interface HatsEvolutionChartProps {
  savedRituals: SavedHatsRitual[];
  currentHatsData: HatsData;
}

const HAT_COLORS = {
  blanco: '#cbd5e1',   // Slate 300
  rojo: '#f43f5e',     // Rose 500
  negro: '#a78bfa',    // Violet 400 (visible and distinctive in dark theme)
  amarillo: '#eab308', // Yellow 500
  verde: '#10b981',    // Emerald 500
  azul: '#06b6d4'      // Cyan 500
};

const HAT_NAMES: Record<string, string> = {
  blanco: 'Blanco (Hechos)',
  rojo: 'Rojo (Emociones)',
  negro: 'Negro (Riesgos)',
  amarillo: 'Amarillo (Oportunidades)',
  verde: 'Verde (Creatividad)',
  azul: 'Azul (Comando)'
};

export const HatsEvolutionChart: React.FC<HatsEvolutionChartProps> = ({
  savedRituals,
  currentHatsData
}) => {
  const [viewMode, setViewMode] = useState<'bySession' | 'byHat'>('bySession');

  // Build dataset for "bySession" (Evolution across saved rituals + current)
  const sessionData = useMemo(() => {
    // Reverse or sort chronologically so oldest is first, newest last
    const chronologicalSaved = [...savedRituals].reverse();

    const items = chronologicalSaved.map((r, idx) => {
      const label = r.title 
        ? (r.title.length > 14 ? r.title.slice(0, 12) + '…' : r.title)
        : `Ritual #${idx + 1}`;

      return {
        name: label,
        fullName: r.title || `Ritual #${idx + 1}`,
        blanco: r.blanco ? r.blanco.trim().length : 0,
        rojo: r.rojo ? r.rojo.trim().length : 0,
        negro: r.negro ? r.negro.trim().length : 0,
        amarillo: r.amarillo ? r.amarillo.trim().length : 0,
        verde: r.verde ? r.verde.trim().length : 0,
        azul: r.azul ? r.azul.trim().length : 0,
        total: (r.blanco?.length || 0) + (r.rojo?.length || 0) + (r.negro?.length || 0) + (r.amarillo?.length || 0) + (r.verde?.length || 0) + (r.azul?.length || 0)
      };
    });

    // Add current session
    items.push({
      name: 'Actual (Hoy)',
      fullName: currentHatsData.azotea ? `Actual: ${currentHatsData.azotea.slice(0, 20)}…` : 'Sesión Actual',
      blanco: currentHatsData.blanco.trim().length,
      rojo: currentHatsData.rojo.trim().length,
      negro: currentHatsData.negro.trim().length,
      amarillo: currentHatsData.amarillo.trim().length,
      verde: currentHatsData.verde.trim().length,
      azul: currentHatsData.azul.trim().length,
      total: currentHatsData.blanco.length + currentHatsData.rojo.length + currentHatsData.negro.length + currentHatsData.amarillo.length + currentHatsData.verde.length + currentHatsData.azul.length
    });

    return items;
  }, [savedRituals, currentHatsData]);

  // Build dataset for "byHat" (Compare Current vs Historical Average)
  const hatComparisonData = useMemo(() => {
    const hatsList: (keyof typeof HAT_COLORS)[] = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'];

    return hatsList.map((hatKey) => {
      const currentLen = currentHatsData[hatKey]?.trim().length || 0;
      
      let historicalAvg = 0;
      if (savedRituals.length > 0) {
        const sum = savedRituals.reduce((acc, r) => acc + (r[hatKey]?.trim().length || 0), 0);
        historicalAvg = Math.round(sum / savedRituals.length);
      }

      return {
        hat: HAT_NAMES[hatKey],
        shortName: hatKey.charAt(0).toUpperCase() + hatKey.slice(1),
        current: currentLen,
        historicalAvg,
        color: HAT_COLORS[hatKey]
      };
    });
  }, [savedRituals, currentHatsData]);

  // Total characters in current session
  const currentTotal = useMemo(() => {
    return (
      (currentHatsData.blanco?.length || 0) +
      (currentHatsData.rojo?.length || 0) +
      (currentHatsData.negro?.length || 0) +
      (currentHatsData.amarillo?.length || 0) +
      (currentHatsData.verde?.length || 0) +
      (currentHatsData.azul?.length || 0)
    );
  }, [currentHatsData]);

  return (
    <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Evolución de Longitud de Sombreros</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono lowercase">
                {savedRituals.length} {savedRituals.length === 1 ? 'guardado' : 'guardados'} + actual
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Métricas de caracteres y profundidad expresiva por cada sombrero a lo largo del tiempo.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 rounded-xl self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setViewMode('bySession')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'bySession'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Por Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('byHat')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'byHat'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Por Sombrero</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'bySession' ? (
            <BarChart
              data={sessionData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                interval={0}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
                unit="c"
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataItem = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[180px]">
                        <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">
                          {dataItem.fullName}
                        </p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                          <span style={{ color: HAT_COLORS.blanco }}>⚪ Blanco: {dataItem.blanco} car.</span>
                          <span style={{ color: HAT_COLORS.rojo }}>🔴 Rojo: {dataItem.rojo} car.</span>
                          <span style={{ color: HAT_COLORS.negro }}>⚫ Negro: {dataItem.negro} car.</span>
                          <span style={{ color: HAT_COLORS.amarillo }}>🟡 Amarillo: {dataItem.amarillo} car.</span>
                          <span style={{ color: HAT_COLORS.verde }}>🟢 Verde: {dataItem.verde} car.</span>
                          <span style={{ color: HAT_COLORS.azul }}>🔵 Azul: {dataItem.azul} car.</span>
                        </div>
                        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                          Total acumulado: {dataItem.total} caracteres
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
                formatter={(value: string) => {
                  const map: Record<string, string> = {
                    blanco: 'Blanco',
                    rojo: 'Rojo',
                    negro: 'Negro',
                    amarillo: 'Amarillo',
                    verde: 'Verde',
                    azul: 'Azul'
                  };
                  return <span className="text-slate-300 font-medium">{map[value] || value}</span>;
                }}
              />
              <Bar dataKey="blanco" name="blanco" fill={HAT_COLORS.blanco} radius={[3, 3, 0, 0]} />
              <Bar dataKey="rojo" name="rojo" fill={HAT_COLORS.rojo} radius={[3, 3, 0, 0]} />
              <Bar dataKey="negro" name="negro" fill={HAT_COLORS.negro} radius={[3, 3, 0, 0]} />
              <Bar dataKey="amarillo" name="amarillo" fill={HAT_COLORS.amarillo} radius={[3, 3, 0, 0]} />
              <Bar dataKey="verde" name="verde" fill={HAT_COLORS.verde} radius={[3, 3, 0, 0]} />
              <Bar dataKey="azul" name="azul" fill={HAT_COLORS.azul} radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={hatComparisonData}
              margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="shortName" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
                unit="c"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataItem = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                        <p className="font-bold text-slate-100 flex items-center gap-1.5" style={{ color: dataItem.color }}>
                          <span>●</span> {dataItem.hat}
                        </p>
                        <p className="text-slate-200">
                          Sesión Actual: <strong className="text-amber-400 font-mono">{dataItem.current}</strong> caracteres
                        </p>
                        {savedRituals.length > 0 ? (
                          <p className="text-slate-400">
                            Promedio Histórico: <strong className="text-cyan-400 font-mono">{dataItem.historicalAvg}</strong> caracteres
                          </p>
                        ) : (
                          <p className="text-slate-500 italic text-[10px]">
                            (Sin promedio histórico aún)
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="rect"
                formatter={(value: string) => (
                  <span className="text-slate-300 font-medium">
                    {value === 'current' ? 'Sesión Actual' : 'Promedio Histórico'}
                  </span>
                )}
              />
              <Bar dataKey="current" name="current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              {savedRituals.length > 0 && (
                <Bar dataKey="historicalAvg" name="historicalAvg" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Mini Insight Footer */}
      <div className="flex items-start sm:items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          {savedRituals.length === 0 ? (
            <span>
              Mostrando la sesión actual (<strong className="text-slate-200">{currentTotal} caracteres</strong>). Guarda este ritual en Firestore para habilitar la comparativa cronológica y el análisis de progresión.
            </span>
          ) : (
            <span>
              Tienes <strong className="text-amber-400">{savedRituals.length} rituales</strong> registrados en la nube. Observa cómo cambia la profundidad de análisis entre la prudencia (Negro) y tus ideas de disrupción (Verde).
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
