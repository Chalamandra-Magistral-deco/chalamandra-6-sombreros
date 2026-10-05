import { useState, useEffect, useRef } from 'react';
import { 
  CharacterKey, 
  HatKey, 
  PlayerCognitiveProfile, 
  CognitiveChallenge, 
  CognitiveEvaluation,
  CHARACTERS, 
  TRAINER_HATS, 
  INITIAL_PLAYER_PROFILE,
  MENTAL_LEVEL_TITLES
} from '../data/trainerData';
import { 
  evaluateResponse, 
  adaptNextChallenge, 
  computeMentalLevel 
} from '../lib/cognitiveEngine';
import { CognitiveRouletteWheel } from './CognitiveRouletteWheel';
import { MentalMirrorModal } from './MentalMirrorModal';
import { sound } from '../lib/audio';
import { 
  Brain, 
  Sparkles, 
  Timer, 
  Send, 
  RotateCw, 
  HelpCircle, 
  Compass, 
  FileText, 
  Heart, 
  AlertTriangle, 
  Lightbulb
} from 'lucide-react';

export const CognitiveTrainerTab = () => {
  // Load player profile from localStorage
  const [profile, setProfile] = useState<PlayerCognitiveProfile>(() => {
    const saved = localStorage.getItem('decox_cognitive_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PLAYER_PROFILE;
      }
    }
    return INITIAL_PLAYER_PROFILE;
  });

  // Selected character
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterKey>(() => {
    const saved = localStorage.getItem('decox_selected_character');
    return (saved as CharacterKey) || 'chola';
  });

  // Trainer workflow states: 'ready' | 'spinning' | 'challenging' | 'evaluated'
  const [stage, setStage] = useState<'ready' | 'spinning' | 'challenging' | 'evaluated'>('ready');
  const [targetHat, setTargetHat] = useState<HatKey | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<CognitiveChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [latestEvaluation, setLatestEvaluation] = useState<CognitiveEvaluation | null>(null);
  const [showMirrorModal, setShowMirrorModal] = useState<boolean>(false);
  const [hintRequested, setHintRequested] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('decox_cognitive_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('decox_selected_character', selectedCharacter);
  }, [selectedCharacter]);

  // Handle countdown during challenging stage
  useEffect(() => {
    if (stage === 'challenging' && currentChallenge) {
      setTimeLeft(currentChallenge.timeLimitSeconds);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          if (prev === 10) {
            sound.playStepChime(1);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, currentChallenge]);

  // Start the smart roulette spin
  const handleStartSpin = () => {
    sound.playClick();
    setUserAnswer('');
    setHintRequested(false);

    // Compute the adaptive challenge using the cognitive engine
    const nextChallenge = adaptNextChallenge(profile, selectedCharacter);
    setTargetHat(nextChallenge.hat);
    setCurrentChallenge(nextChallenge);
    setStage('spinning');
  };

  // Wheel finished spinning
  const handleSpinEnd = (landedHat: HatKey) => {
    sound.playPreset();
    setStage('challenging');
  };

  // Handle evaluation of player response
  const handleEvaluate = () => {
    if (!currentChallenge || !userAnswer.trim()) return;

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    setTimeTaken(elapsedSeconds);

    const result = evaluateResponse(
      userAnswer,
      elapsedSeconds,
      currentChallenge.hat,
      selectedCharacter,
      currentChallenge.mode
    );

    sound.playScoreChime(result.stars);

    const newEval: CognitiveEvaluation = {
      id: `eval-${Date.now()}`,
      hat: currentChallenge.hat,
      character: selectedCharacter,
      mode: currentChallenge.mode,
      prompt: currentChallenge.prompt,
      userResponse: userAnswer,
      timeTaken: elapsedSeconds,
      score: result.score,
      stars: result.stars,
      feedback: result.feedback,
      dominantInsight: result.dominantInsight,
      timestamp: new Date().toISOString()
    };

    setLatestEvaluation(newEval);

    // Update player profile memory
    setProfile(prev => {
      const isWin = result.stars >= 3;
      const newStreak = isWin ? prev.rachaActual + 1 : 0;
      const newBestStreak = Math.max(newStreak, prev.mejorRacha);

      // Points gained for this hat
      const pointsGained = result.stars >= 4 ? 3 : result.stars >= 3 ? 2 : 1;

      const updated: PlayerCognitiveProfile = {
        ...prev,
        [currentChallenge.hat]: prev[currentChallenge.hat] + pointsGained,
        tiempoPromedio: [...prev.tiempoPromedio.slice(-19), elapsedSeconds],
        creatividadScore: currentChallenge.hat === 'verde' ? prev.creatividadScore + pointsGained : prev.creatividadScore,
        criticaScore: currentChallenge.hat === 'negro' ? prev.criticaScore + pointsGained : prev.criticaScore,
        emocionScore: currentChallenge.hat === 'rojo' ? prev.emocionScore + pointsGained : prev.emocionScore,
        rondasCompletadas: prev.rondasCompletadas + 1,
        rachaActual: newStreak,
        mejorRacha: newBestStreak,
        historialEvaluaciones: [newEval, ...prev.historialEvaluaciones.slice(0, 29)]
      };

      updated.nivelMental = computeMentalLevel(updated);
      return updated;
    });

    setStage('evaluated');
  };

  // Player got stuck / requested a hint
  const handlePlayerStuck = () => {
    sound.playClick();
    setHintRequested(true);
    setProfile(prev => ({
      ...prev,
      bloqueos: prev.bloqueos + 1
    }));
  };

  // Reset profile
  const handleResetProfile = () => {
    sound.playClick();
    setProfile(INITIAL_PLAYER_PROFILE);
    localStorage.removeItem('decox_cognitive_profile');
    setStage('ready');
  };

  const character = CHARACTERS[selectedCharacter];
  const levelInfo = MENTAL_LEVEL_TITLES[profile.nivelMental] || MENTAL_LEVEL_TITLES[1];

  const getHatIcon = (hat: HatKey) => {
    switch (hat) {
      case 'blanco': return FileText;
      case 'rojo': return Heart;
      case 'negro': return AlertTriangle;
      case 'amarillo': return Lightbulb;
      case 'verde': return Sparkles;
      case 'azul': return Compass;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Status Bar */}
      <div className="p-4 md:p-6 rounded-3xl bg-[#0b0f19] border border-cyan-500/30 shadow-xl shadow-cyan-950/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-wide">
                Entrenador Cognitivo Adaptativo
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {levelInfo.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autoaprendizaje mediante 6 Sombreros de De Bono & calibración de sesgos
            </p>
          </div>
        </div>

        {/* Quick stats & Mental Mirror Button */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Racha</span>
            <span className="text-xs font-black text-emerald-400">{profile.rachaActual} 🔥</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Rondas</span>
            <span className="text-xs font-black text-amber-400">{profile.rondasCompletadas}</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setShowMirrorModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>🪞 Espejo Mental</span>
          </button>
        </div>
      </div>

      {/* Character Selector Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(CHARACTERS) as CharacterKey[]).map(key => {
          const char = CHARACTERS[key];
          const isSelected = selectedCharacter === key;

          return (
            <button
              key={key}
              onClick={() => {
                sound.playClick();
                setSelectedCharacter(key);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-950/40'
                  : 'bg-[#0b0f19] border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow shrink-0 border ${isSelected ? 'border-amber-400' : 'border-slate-700'}`}>
                  {key === 'chola' ? (
                    <img 
                      src="/src/assets/images/chalamandra_avatar_1790335163182.jpg" 
                      alt="La Chola Chalamandra" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${char.avatarBg} flex items-center justify-center text-white font-black text-sm`}>
                      {char.name.charAt(3) || 'C'}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {char.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 block truncate">
                    {char.alias}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                "{char.introLines[0]}"
              </p>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* STAGE 1: READY / SPINNING */}
        {(stage === 'ready' || stage === 'spinning') && (
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Character Dialogue Banner */}
            <div className="max-w-md p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-left">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${character.avatarBg} shrink-0 flex items-center justify-center text-white font-black text-xs`}>
                {character.name.charAt(3)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  {character.name} dice:
                </span>
                <p className="text-xs text-slate-200 mt-0.5 italic">
                  "{stage === 'spinning' ? 'A ver qué sombrero te suelta el algoritmo... ¡Ponte trucha!' : character.introLines[1]}"
                </p>
              </div>
            </div>

            {/* Roulette Wheel Component */}
            <CognitiveRouletteWheel
              targetHat={targetHat}
              isSpinning={stage === 'spinning'}
              onSpinEnd={handleSpinEnd}
              characterAccent={character.accentColor}
            />

            {/* Spin CTA Button */}
            {stage === 'ready' && (
              <button
                onClick={handleStartSpin}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 text-slate-950 font-black text-sm tracking-wider uppercase transition-all shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Girar Ruleta Inteligente</span>
              </button>
            )}

            <p className="text-xs text-slate-500 max-w-sm">
              * El motor adaptativo calcula tus debilidades previas y ajusta la probabilidad de giro para entrenar tus puntos ciegos.
            </p>
          </div>
        )}

        {/* STAGE 2: CHALLENGING */}
        {stage === 'challenging' && currentChallenge && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hat & Mode Header */}
            {(() => {
              const hat = TRAINER_HATS[currentChallenge.hat];
              const HatIcon = getHatIcon(currentChallenge.hat);

              return (
                <div className="p-4 md:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: hat.bgHex, color: currentChallenge.hat === 'blanco' || currentChallenge.hat === 'amarillo' ? '#0f172a' : '#ffffff' }}
                    >
                      <HatIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">
                          {hat.name}
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {currentChallenge.mode === 'modo_caos' ? '⚡ Modo Caos' : currentChallenge.mode === 'modo_suave' ? '🛡️ Modo Suave' : currentChallenge.mode === 'combinado_verde_negro' ? '⚖️ Verde + Negro' : 'Reto Estándar'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {hat.focusArea}
                      </p>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                    timeLeft <= 10 ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span className="font-mono text-sm font-black">{timeLeft}s</span>
                  </div>
                </div>
              );
            })()}

            {/* Character Dialogue & Prompt */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0b0f19] border border-cyan-500/20 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{character.name} exige:</span>
              </div>
              <p className="text-sm font-semibold text-slate-200 italic">
                "{currentChallenge.characterDialogue}"
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                <strong className="text-white block mb-1">Misión Cognitiva:</strong>
                {currentChallenge.prompt}
              </div>
            </div>

            {/* Textarea for player response */}
            <div className="space-y-2">
              <textarea
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                rows={4}
                placeholder="Escribe tu análisis sin filtros aquí. El algoritmo evaluará longitud, tiempo y vocabulario del sombrero..."
                className="w-full p-4 rounded-2xl bg-[#060911] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{userAnswer.trim().length} caracteres (mínimo recomendado: {currentChallenge.minimumChars})</span>
                {hintRequested && (
                  <span className="text-amber-400 font-medium">
                    💡 Pista: Enfócate en palabras como {currentChallenge.keywords.slice(0, 3).join(', ')}.
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePlayerStuck}
                disabled={hintRequested}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{hintRequested ? 'Bloqueo registrado' : 'Me trabé / Pedir Pista'}</span>
              </button>

              <button
                onClick={handleEvaluate}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Evaluar Respuesta</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: EVALUATED */}
        {stage === 'evaluated' && latestEvaluation && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Score Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e1626] to-slate-900 border border-cyan-500/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-2xl">
                    {i < latestEvaluation.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl font-black text-white">
                Puntuación Cognitiva: {latestEvaluation.score} / 100
              </h3>

              <p className="text-xs text-slate-400">
                Tiempo de resolución: {latestEvaluation.timeTaken} segundos • Racha activa: {profile.rachaActual} 🔥
              </p>
            </div>

            {/* Character Reaction Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${character.avatarBg} shrink-0 flex items-center justify-center text-white font-black text-sm shadow`}>
                {character.name.charAt(3)}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Veredicto de {character.name}:
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  "{latestEvaluation.feedback}"
                </p>
                <p className="text-xs text-slate-400 pt-1 border-t border-slate-800">
                  <strong className="text-slate-300">Diagnóstico:</strong> {latestEvaluation.dominantInsight}
                </p>
              </div>
            </div>

            {/* User Response Recap */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Tu Respuesta Registrada:</span>
              <p className="italic font-mono text-slate-300">"{latestEvaluation.userResponse}"</p>
            </div>

            {/* CTA to Next Adaptive Challenge or Mirror */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowMirrorModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
              >
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Consultar Espejo Mental Actualizado</span>
              </button>

              <button
                onClick={handleStartSpin}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-rose-500/25 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Siguiente Reto Adaptativo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mental Mirror Modal */}
      <MentalMirrorModal
        profile={profile}
        isOpen={showMirrorModal}
        onClose={() => setShowMirrorModal(false)}
        onResetProfile={handleResetProfile}
      />
    </div>
  );
};
