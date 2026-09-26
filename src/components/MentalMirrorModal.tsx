import { useState } from 'react';
import { PlayerCognitiveProfile, MENTAL_LEVEL_TITLES, TRAINER_HATS } from '../data/trainerData';
import { generateMirror } from '../lib/cognitiveEngine';
import { sound } from '../lib/audio';
import { 
  X, 
  Copy, 
  Check, 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  RotateCcw,
  ShieldAlert,
  Award
} from 'lucide-react';

interface Props {
  profile: PlayerCognitiveProfile;
  isOpen: boolean;
  onClose: () => void;
  onResetProfile: () => void;
}

export const MentalMirrorModal = ({ profile, isOpen, onClose, onResetProfile }: Props) => {
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const mirror = generateMirror(profile);
  const levelInfo = MENTAL_LEVEL_TITLES[profile.nivelMental] || MENTAL_LEVEL_TITLES[1];

  const handleCopy = () => {
    const report = `
🪞 ESPEJO MENTAL DECOX - DIAGNÓSTICO COGNITIVO
=============================================
Nivel Mental: ${levelInfo.badge}
Arquetipo: ${mirror.archetype}

EQUILIBRIO HEXAGONAL DE SOMBREROS:
- Blanco (Datos & Hechos): ${profile.blanco} pts
- Rojo (Instinto & Emoción): ${profile.rojo} pts
- Negro (Riesgo & Crítica): ${profile.negro} pts
- Amarillo (Optimismo & Ventaja): ${profile.amarillo} pts
- Verde (Creatividad & Hack): ${profile.verde} pts
- Azul (Control & Prioridad): ${profile.azul} pts

ANÁLISIS DE SESGO:
• Sombrero Dominante: ${TRAINER_HATS[mirror.dominantHat].name}
• Punto Ciego Suprimido: ${TRAINER_HATS[mirror.suppressedHat].name}

OBSERVACIÓN PSICOLÓGICA:
${mirror.psychologicalObservation}

PRESCRIPCIÓN ESTRATÉGICA:
${mirror.strategicPrescription}

Métricas: ${profile.rondasCompletadas} rondas | Mejor racha: ${profile.mejorRacha} | Bloqueos detectados: ${profile.bloqueos}
=============================================
Generado por Escáner de 6 Sombreros • Chalamandra Magistral DecoX
    `.trim();

    navigator.clipboard.writeText(report);
    sound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0e1626] to-[#090d16] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/50 p-6 md:p-8 text-slate-100 scrollbar-thin scrollbar-thumb-slate-700"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  Espejo Mental Cognitivo
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {levelInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Auditoría algorítmica de sesgos de pensamiento y puntos ciegos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Archetype banner */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                Arquetipo Detectado
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{mirror.archetype}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400">Rondas</span>
              <p className="text-lg font-black text-cyan-300">{profile.rondasCompletadas}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {levelInfo.desc}
          </p>
        </div>

        {/* Cognitive Balance Radar (Hexagonal Bars) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Balance de Energía Cognitiva (6 Sombreros)</span>
          </h4>

          <div className="space-y-2.5">
            {mirror.radarData.map(item => {
              const isDominant = item.hat === mirror.dominantHat;
              const isSuppressed = item.hat === mirror.suppressedHat;

              return (
                <div key={item.hat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/40" 
                        style={{ backgroundColor: item.hex }} 
                      />
                      <span className={isDominant ? 'text-cyan-300 font-black' : isSuppressed ? 'text-rose-300' : 'text-slate-200'}>
                        {item.name}
                      </span>
                      {isDominant && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">
                          DOMINANTE
                        </span>
                      )}
                      {isSuppressed && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-rose-500/20 text-rose-300 rounded border border-rose-500/40">
                          PUNTO CIEGO
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.score} pts ({item.percent}%)
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.hex,
                        boxShadow: `0 0 8px ${item.hex}60`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Psychological Observation & Strategic Prescription */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Observación de Comportamiento</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {mirror.psychologicalObservation}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Prescripción Estratégica</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {mirror.strategicPrescription}
            </p>
          </div>
        </div>

        {/* Behavioral Metrics Footer */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center mb-6 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Racha Actual</span>
            <span className="text-sm font-black text-emerald-400">{profile.rachaActual} 🔥</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Mejor Racha</span>
            <span className="text-sm font-black text-amber-400">{profile.mejorRacha} ⭐</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Bloqueos Registrados</span>
            <span className="text-sm font-black text-rose-400">{profile.bloqueos} ⚠️</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Diagnóstico Copiado!' : 'Copiar Diagnóstico Completo'}</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalibrar Perfil</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400 font-bold">¿Borrar historial?</span>
              <button
                onClick={() => {
                  onResetProfile();
                  setShowResetConfirm(false);
                }}
                className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-500"
              >
                Sí, reiniciar
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
