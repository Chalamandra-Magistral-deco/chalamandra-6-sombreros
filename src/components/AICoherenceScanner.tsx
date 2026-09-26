import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  EyeOff, 
  Compass, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { HatsData } from './HatsEvolutionChart';

export interface CoherenceAnalysisResult {
  overallCoherence: 'Alta' | 'Media' | 'Baja';
  coherenceScore: number;
  summary: string;
  comparisons: {
    blancoVsRojo: string;
    negroVsAmarillo: string;
    verdeVsAzul: string;
  };
  blindspots: string[];
  verdict: string;
}

interface AICoherenceScannerProps {
  hatsData: HatsData;
}

export const AICoherenceScanner: React.FC<AICoherenceScannerProps> = ({ hatsData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CoherenceAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!hatsData.azotea.trim()) {
      setError('Primero define tu "Azotea" (Paso 1) para que Gemini pueda auditar la coherencia de tus sombreros.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-coherence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hatsData)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Ocurrió un error al contactar el servidor.');
      }

      if (data.coherenceAnalysis) {
        setAnalysis(data.coherenceAnalysis);
      }
    } catch (err: any) {
      console.error('Error in coherence analysis:', err);
      setError(err.message || 'No se pudo generar el análisis de coherencia.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'alta':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'media':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-amber-500/20 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <span>Auditoría Comparativa de Coherencia</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluación cruzada inteligente de los 6 sombreros: contrastes, equilibrio y detección de puntos ciegos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:via-rose-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Auditando Sombreros...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{analysis ? 'Re-auditar Sombreros' : 'Generar Análisis Comparativo'}</span>
            </>
          )}
        </button>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-bounce">
            <Scale className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-200">
            Cruzando información entre hechos, emociones, riesgos y creatividad...
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Gemini está contrastando tu Sombrero Blanco contra el Rojo y verificando que tu Comando Azul rompa el bucle de la Azotea.
          </p>
        </div>
      )}

      {/* Empty State before running */}
      {!analysis && !isLoading && !error && (
        <div className="p-5 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-300 font-medium">
            ¿Quieres saber si tus emociones contradicen tus hechos o si tus riesgos están bloqueando tus oportunidades?
          </p>
          <p className="text-[11px] text-slate-400">
            Haz clic en <strong className="text-amber-400">"Generar Análisis Comparativo"</strong> para que la IA audite la congruencia de tus 6 sombreros.
          </p>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && !isLoading && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 border border-slate-800 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-slate-400">Nivel de Coherencia:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getBadgeColor(analysis.overallCoherence)}`}>
                  {analysis.overallCoherence} ({analysis.coherenceScore}/100)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {analysis.summary}
              </p>
            </div>

            {/* Score pill */}
            <div className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-slate-950/80 border border-slate-700/60 min-w-[90px] text-center">
              <div>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {analysis.coherenceScore}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Índice Táctico
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Cross-Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Blanco vs Rojo */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <span className="text-sm">⚪</span> vs <span className="text-sm">🔴</span>
                  <span>Datos vs Emociones</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.comparisons?.blancoVsRojo}
              </p>
            </div>

            {/* Negro vs Amarillo */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="text-sm">⚫</span> vs <span className="text-sm">🟡</span>
                  <span>Riesgos vs Oportunidades</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.comparisons?.negroVsAmarillo}
              </p>
            </div>

            {/* Verde vs Azul */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="text-sm">🟢</span> vs <span className="text-sm">🔵</span>
                  <span>Creatividad vs Ejecución</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.comparisons?.verdeVsAzul}
              </p>
            </div>
          </div>

          {/* Blindspots detected */}
          {analysis.blindspots && analysis.blindspots.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wide">
                <EyeOff className="w-4 h-4" />
                <span>Puntos Ciegos y Contradicciones Detectadas</span>
              </div>
              <ul className="space-y-1.5">
                {analysis.blindspots.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verdict and Tactical Directive */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border border-amber-500/30 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                Directiva Táctica Final (Chalamandra Magistral decoX)
              </div>
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                {analysis.verdict}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
