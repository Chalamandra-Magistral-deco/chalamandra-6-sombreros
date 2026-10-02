import { useState, useEffect, lazy, Suspense } from 'react';
import type { HatsData, LadderData } from './types/ritual';
import { INITIAL_HATS_DATA, INITIAL_LADDER_DATA } from './data/ritualInitial';
import { hatsStepsInfo, ladderStepsInfo } from './data/ritualSteps';
import { academyHats } from './data/academyHats';
import {
  getInteractiveMetrics,
  isHatsVerdeStrong,
  isHatsAzulStrong,
  isHatsNegroHeavier,
  isLadderEjecucionStrong,
  isLadderInmunidadStrong,
  isLadderPassive,
  getHatsVerdeFeedback,
  getHatsAzulFeedback,
  getHatsCoherenceFeedback,
  getLadderEjecucionFeedback,
  getLadderInmunidadFeedback,
  getLadderCoherenceFeedback,
} from './lib/ritualMetrics';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Heart, 
  ShieldAlert, 
  Sun, 
  Lightbulb, 
  Terminal,
  Layers,
  HelpCircle,
  Eye,
  Shield,
  Zap,
  Target,
  Bookmark,
  Compass,
  BookOpen,
  Sliders,
  TrendingUp,
  Brain,
  Award,
  Cloud,
  CloudUpload,
  LogOut,
  LogIn,
  UserCheck,
  Trash2,
  Clock,
  Database,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Palette,
  Flame,
  Activity,
  Globe,
  MessageSquare,
  Bot
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { sound } from './lib/audio';
import { FLAVOR_THEMES, HATS_STEPS, LADDER_STEPS, ACADEMY_HATS } from './data/constants';
import { 
  saveHatsRitual, 
  subscribeHatsRituals, 
  deleteHatsRitual, 
  saveLadderRitual, 
  subscribeLadderRituals, 
  deleteLadderRitual,
  SavedHatsRitual,
  SavedLadderRitual
} from './lib/firestoreService';
const CognitiveTrainerTab = lazy(() =>
  import('./components/CognitiveTrainerTab').then(m => ({ default: m.CognitiveTrainerTab }))
);
const HatsEvolutionChart = lazy(() =>
  import('./components/HatsEvolutionChart').then(m => ({ default: m.HatsEvolutionChart }))
);
const AICoherenceScanner = lazy(() =>
  import('./components/AICoherenceScanner').then(m => ({ default: m.AICoherenceScanner }))
);
const GeminiHatChatbot = lazy(() =>
  import('./components/GeminiHatChatbot').then(m => ({ default: m.GeminiHatChatbot }))
);

const heroImage = '/src/assets/images/seven_hats_wheel_1790335175529.jpg';
const chalamandraAvatar = '/src/assets/images/chalamandra_avatar_1790335163182.jpg';





// Preset high-fidelity scenarios for one-click testing & maximum interactivity
const PRESETS_HATS = {
  none: null,
  emprendedor: {
    azotea: 'Miedo paralizante a renunciar a mi empleo corporativo seguro de 8 años para lanzar mi propia agencia de desarrollo de software.',
    blanco: 'Tengo ahorros equivalentes a 8 meses de gastos básicos. He validado el servicio con 2 clientes que pagarían $1,500 USD/mes cada uno. Trabajo 10 horas diarias en mi empleo y gano $3,500 USD netos.',
    rojo: 'Siento un pánico visceral a fallar y ser juzgado por mi familia como irresponsable. A la vez, siento frustración diaria extrema y resentimiento con mi jefe actual.',
    negro: 'Si no consigo más clientes en 6 meses agotaré el 75% de mis ahorros. Perderé los beneficios corporativos de salud y la falsa sensación de estabilidad que le da paz a mi pareja.',
    amarillo: 'Recuperaré el control absoluto de mi tiempo. El potencial de ingresos a mediano plazo supera por 3 veces mi salario actual. Podré construir un activo propio escalable.',
    verde: 'Proponerle a mi empresa actual convertirme en consultor externo a tiempo parcial (15 hrs/semana) por la mitad de mi sueldo durante 3 meses, reduciendo el riesgo de transición a cero.',
    azul: 'Este jueves a las 4:30 PM agendaré una reunión formal con mi gerente de división para presentarle el plan de transición ordenado y la propuesta de consultoría externa.'
  },
  clienteAbusivo: {
    azotea: 'Mi cliente principal de consultoría (representa el 50% de mi facturación) exige constantes cambios fuera de alcance sin aceptar aumentos de presupuesto.',
    blanco: 'El contrato original del proyecto estipula 2 rondas de correcciones por escrito. Vamos en la ronda de cambios número 9. He invertido 35 horas extra de desarrollo no presupuestadas.',
    rojo: 'Siento una rabia contenida brutal. Me siento explotado y desvalorizado. Intuyo que si sigo cediendo por miedo a perder el dinero, terminaré odiando mi propia profesión.',
    negro: 'Si rompo el contrato de inmediato, tendré problemas de liquidez el próximo mes para cubrir costos operativos fijos. Si sigo aceptando cambios, descuidaré a otros clientes de alto valor.',
    amarillo: 'Esta crisis me obliga a implantar un sistema estricto de control de cambios. Aprenderé a decir "No" con elegancia y me forzará a prospectar 3 clientes más pequeños para diversificar.',
    verde: 'Enviar un correo de cortesía congelando el desarrollo y ofreciendo dos opciones claras: Terminar el proyecto actual bajo el alcance original firmado, o firmar un anexo con un fee extra de $120 USD por hora para cambios adicionales.',
    azul: 'Mañana miércoles a las 9:00 AM enviaré el correo redactado con las dos opciones y suspenderé el acceso al sandbox de pruebas hasta que se elija un camino formal.'
  },
  sociosConflicto: {
    azotea: 'Sospecho que mi socio fundador en la startup está dedicando horas laborales a proyectos de consultoría privada paralelos sin reportarlos.',
    blanco: 'Nuestros acuerdos establecen exclusividad del 100% de tiempo. He visto 2 repositorios públicos en su GitHub con código de clientes externos actualizados durante horario de oficina.',
    rojo: 'Me invade una desconfianza tóxica. Siento traición, decepción y un cansancio mental tremendo al tener que fiscalizar a mi propio compañero de ruta.',
    negro: 'El conflicto directo puede fragmentar la sociedad de forma irreparable y ahuyentar a los inversionistas actuales. El silencio prolongado creará un resentimiento insostenible y muerte de la empresa.',
    amarillo: 'Esta conversación incómoda pero necesaria redefinirá las reglas de rendición de cuentas o me permitirá recuperar el 100% del control de la propiedad intelectual si decidimos separarnos.',
    verde: 'Implementar una herramienta de bitácora semanal abierta de objetivos (OKR) donde ambos hagamos públicos los avances, o proponer una re-compra de su porcentaje de acciones de forma amistosa.',
    azul: 'El viernes por la tarde le invitaré un café de negocios fuera de la oficina y abriré la conversación de forma objetiva mostrando los commits de GitHub sin juzgar, pidiendo su versión directa.'
  }
};

const PRESETS_LADDER = {
  none: null,
  testeoCruel: {
    instinto: 'Durante la reunión de equipo, mi compañero hizo un chiste condescendiente sobre mi presentación. Sentí un nudo instantáneo en la boca del estómago y me quedé helado sin saber qué decir.',
    emocion: 'Me inyectó culpa oculta y duda instantánea sobre mi competencia profesional frente a la gerencia, provocando que buscara justificarme.',
    jugada: 'Testeo Cruel clásico: Se disfraza un ataque profesional o dardo psicológico de "broma" inocente para medir mi nivel de sumisión o hacerme explotar enfadado.',
    posicion: 'Él operó desde el rol de Juez superior/Gracioso intocable, pretendiendo empujarme a mí al rol de Niño indefenso que se justifica o se ríe de su propio ataque.',
    ejecucion: 'Mantendré silencio total sosteniendo la mirada fijamente por 2 segundos con expresión relajada y neutra. Luego sonreiré levemente y le preguntaré con voz tranquila: "¿Qué parte de la métrica te ha parecido divertida exactamente, Carlos?"',
    bitacora: 'Registrado bajo el gatillo "Dardo Condescendiente Disfrazado de Humor". Patrón automatizado: Silencio incómodo + Devolución de la presión en frío.',
    inmunidad: 'Mi autoridad técnica está respaldada por resultados auditables y no requiere la aprobación ni los comentarios de ingenio barato de mis competidores.'
  },
  silencioCastigador: {
    instinto: 'Tras proponer el cambio de metodología, el líder de diseño dejó de responder a mis mensajes directos de Slack durante 3 días enteros, sintiendo un vacío frío y ansiedad de exclusión.',
    emocion: 'Pretendía inducirme miedo al despido, aislamiento grupal y remordimiento por haberme atrevido a proponer una mejora disruptiva sin su bendición previa.',
    jugada: 'Silencio Castigador / Ley del Hielo: Se retira la interacción social de forma unilateral para forzar al otro a pedir disculpas sumisas y retractarse.',
    posicion: 'Él opera como el Soberano castigador que retira el favor real. Pretende encasillarme en el rol de Súbdito arrepentido que implora atención.',
    ejecucion: 'No insistiré con más mensajes ni explicaciones. Seguiré trabajando normalmente documentando todo. En la siguiente videollamada grupal, plantearé el estatus de forma hiper-profesional sin mencionar su silencio táctico.',
    bitacora: 'Gatillo: Retirada de interacción post-propuesta. Respuesta: Enfriamiento total, no sobre-compensar ni rogar, mantener enfoque de entrega.',
    inmunidad: 'Las pausas tácticas de comunicación ajena pertenecen a la madurez de quien las usa, mi seguridad laboral depende de mis entregables objetivos.'
  }
};

export default function App() {
  // Firebase Auth & Cloud Firestore State
  const { user, signInWithGoogle, logout, authError, clearAuthError } = useAuth();
  const [savedHatsRituals, setSavedHatsRituals] = useState<SavedHatsRitual[]>([]);
  const [savedLadderRituals, setSavedLadderRituals] = useState<SavedLadderRitual[]>([]);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState<string | null>(null);
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Subscribe to real-time Cloud Firestore rituals when user is authenticated
  useEffect(() => {
    if (!user) {
      setSavedHatsRituals([]);
      setSavedLadderRituals([]);
      return;
    }

    const unsubscribeHats = subscribeHatsRituals(user.uid, (rituals) => {
      setSavedHatsRituals(rituals);
    });

    const unsubscribeLadder = subscribeLadderRituals(user.uid, (rituals) => {
      setSavedLadderRituals(rituals);
    });

    return () => {
      unsubscribeHats();
      unsubscribeLadder();
    };
  }, [user]);

  const [activeTab, setActiveTab] = useState<'hats' | 'ladder' | 'trainer' | 'chat'>(() => {
    const savedTab = localStorage.getItem('chalamandra_active_tab');
    return (savedTab === 'chat' ? 'chat' : savedTab === 'trainer' ? 'trainer' : savedTab === 'ladder' ? 'ladder' : 'hats');
  });
  const [showFloatingChat, setShowFloatingChat] = useState<boolean>(false);

  const handleAISuggestion = async (field: string) => {
    if (!hatsData.azotea.trim()) {
        setValidationError('Por favor define primero el conflicto en la "Azotea" (Paso 1).');
        return;
    }
    
    setIsGeneratingSuggestion(field);
    try {
        const response = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hatType: field, azotea: hatsData.azotea }),
        });
        const data = await response.json();
        if (data.suggestion) {
            setHatsData(prev => ({ ...prev, [field]: data.suggestion }));
        }
    } catch (err) {
        console.error("Error al obtener sugerencia:", err);
    } finally {
        setIsGeneratingSuggestion(null);
    }
  };

  // State for Hats (Sombreros)
  const [hatsData, setHatsData] = useState<HatsData>(() => {
    const saved = localStorage.getItem('chalamandra_hats_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_HATS_DATA;
      }
    }
    return INITIAL_HATS_DATA;
  });

  // State for Strategic Ladder (Escalera)
  const [ladderData, setLadderData] = useState<LadderData>(() => {
    const saved = localStorage.getItem('chalamandra_ladder_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LADDER_DATA;
      }
    }
    return INITIAL_LADDER_DATA;
  });

  const [hatsStep, setHatsStep] = useState<number>(0);
  const [ladderStep, setLadderStep] = useState<number>(0);

  const [showHatsResult, setShowHatsResult] = useState<boolean>(false);
  const [showLadderResult, setShowLadderResult] = useState<boolean>(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
  // Interactive features
  const [activeAcademyHat, setActiveAcademyHat] = useState<string | null>(null);
  const [activeCasePreset, setActiveCasePreset] = useState<string>('none');

  // Audio & Interactive Flavor Theme State ("MAS COLOR más sabor")
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());
  const [flavorTheme, setFlavorTheme] = useState<'cyberpunk' | 'lava' | 'emerald' | 'nebula' | 'gold'>(() => {
    const saved = localStorage.getItem('chalamandra_flavor_theme');
    return (saved as any) || 'cyberpunk';
  });
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    sound.setEnabled(nextState);
    setSoundEnabled(nextState);
  };

  const changeFlavorTheme = (theme: 'cyberpunk' | 'lava' | 'emerald' | 'nebula' | 'gold') => {
    setFlavorTheme(theme);
    localStorage.setItem('chalamandra_flavor_theme', theme);
    sound.playClick();
  };

  const handleCloudSave = async () => {
    if (!user) {
      setValidationError('Necesitas iniciar sesión con Google para guardar tus rituales en la nube.');
      return;
    }

    setIsSavingCloud(true);
    setCloudMessage(null);

    try {
      if (activeTab === 'hats') {
        if (!hatsData.azotea.trim() || !hatsData.azul.trim()) {
          setValidationError('Completa al menos el Conflicto (Paso 1) y tu Comando Azul (Paso 7) para guardar.');
          setIsSavingCloud(false);
          return;
        }
        await saveHatsRitual(user.uid, hatsData);
        setCloudMessage('✓ Ritual de 6 Sombreros guardado con éxito en Firestore');
      } else {
        if (!ladderData.instinto.trim() || !ladderData.ejecucion.trim()) {
          setValidationError('Completa al menos el Instinto (Nivel 1) y tu Ejecución (Nivel 5) para guardar.');
          setIsSavingCloud(false);
          return;
        }
        await saveLadderRitual(user.uid, ladderData);
        setCloudMessage('✓ Mapa de Escalera Estratégica guardado con éxito en Firestore');
      }
    } catch (err: any) {
      console.error('Error al guardar en la nube:', err);
      setValidationError('Error al guardar en Firestore: ' + (err.message || 'Inténtalo nuevamente.'));
    } finally {
      setIsSavingCloud(false);
      setTimeout(() => setCloudMessage(null), 4000);
    }
  };

  const loadHatsRitual = (ritual: SavedHatsRitual) => {
    setHatsData({
      azotea: ritual.azotea,
      blanco: ritual.blanco,
      rojo: ritual.rojo,
      negro: ritual.negro,
      amarillo: ritual.amarillo,
      verde: ritual.verde,
      azul: ritual.azul
    });
    setActiveTab('hats');
    setShowHatsResult(true);
    setShowHistoryModal(false);
  };

  const loadLadderRitual = (ritual: SavedLadderRitual) => {
    setLadderData({
      instinto: ritual.instinto,
      emocion: ritual.emocion,
      jugada: ritual.jugada,
      posicion: ritual.posicion,
      ejecucion: ritual.ejecucion,
      bitacora: ritual.bitacora,
      inmunidad: ritual.inmunidad
    });
    setActiveTab('ladder');
    setShowLadderResult(true);
    setShowHistoryModal(false);
  };

  const handleDeleteHatsRitual = async (ritualId: string) => {
    if (!user) return;
    try {
      await deleteHatsRitual(user.uid, ritualId);
    } catch (err) {
      console.error('Error al eliminar ritual:', err);
    }
  };

  const handleDeleteLadderRitual = async (ritualId: string) => {
    if (!user) return;
    try {
      await deleteLadderRitual(user.uid, ritualId);
    } catch (err) {
      console.error('Error al eliminar ritual:', err);
    }
  };

  // Auto-save selections and values
  useEffect(() => {
    localStorage.setItem('chalamandra_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('chalamandra_hats_data', JSON.stringify(hatsData));
  }, [hatsData]);

  useEffect(() => {
    localStorage.setItem('chalamandra_ladder_data', JSON.stringify(ladderData));
  }, [ladderData]);

  // Clean validation error when tab changes
  const handleTabChange = (tab: 'hats' | 'ladder' | 'trainer' | 'chat') => {
    setActiveTab(tab);
    setValidationError(null);
    setCopySuccess(false);
    setActiveCasePreset('none');
  };

  const totalSteps = 7;


  // Helper selectors for current steps
  const activeStep = activeTab === 'hats' ? hatsStep : ladderStep;
  const currentStepInfo = (activeTab === 'hats' ? hatsStepsInfo[activeStep] : ladderStepsInfo[activeStep]) || hatsStepsInfo[0];
  const activeData = activeTab === 'hats' ? hatsData : ladderData;
  const showResult = (activeTab === 'trainer' || activeTab === 'chat') ? false : (activeTab === 'hats' ? showHatsResult : showLadderResult);

  // Auto-fill preset selector
  const handlePresetSelect = (presetKey: string) => {
    setActiveCasePreset(presetKey);
    setValidationError(null);
    sound.playPreset();
    if (activeTab === 'hats') {
      if (presetKey === 'none') {
        setHatsData(INITIAL_HATS_DATA);
        setHatsStep(0);
        setShowHatsResult(false);
      } else {
        const selected = PRESETS_HATS[presetKey as keyof typeof PRESETS_HATS];
        if (selected) {
          setHatsData(selected);
          setHatsStep(6); // Go to final step to preview easily
        }
      }
    } else {
      if (presetKey === 'none') {
        setLadderData(INITIAL_LADDER_DATA);
        setLadderStep(0);
        setShowLadderResult(false);
      } else {
        const selected = PRESETS_LADDER[presetKey as keyof typeof PRESETS_LADDER];
        if (selected) {
          setLadderData(selected);
          setLadderStep(6);
        }
      }
    }
  };

  const handleNext = () => {
    const currentValue = activeData[currentStepInfo.field].trim();
    if (currentValue === '') {
      setValidationError(`Por favor, escribe tu respuesta para "${currentStepInfo.title}" para avanzar.`);
      return;
    }

    setValidationError(null);

    if (activeTab === 'hats') {
      if (hatsStep < totalSteps - 1) {
        sound.playStepChime(hatsStep + 1);
        setHatsStep(prev => prev + 1);
      } else {
        generateHatsManifesto();
      }
    } else {
      if (ladderStep < totalSteps - 1) {
        sound.playStepChime(ladderStep + 1);
        setLadderStep(prev => prev + 1);
      } else {
        generateLadderManifesto();
      }
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (activeTab === 'hats') {
      if (hatsStep > 0) {
        sound.playStepChime(hatsStep - 1);
        setHatsStep(prev => prev - 1);
      }
    } else {
      if (ladderStep > 0) {
        sound.playStepChime(ladderStep - 1);
        setLadderStep(prev => prev - 1);
      }
    }
  };

  const handleStepClick = (idx: number) => {
    setValidationError(null);
    sound.playStepChime(idx);
    if (activeTab === 'hats') {
      setHatsStep(idx);
    } else {
      setLadderStep(idx);
    }
  };

  const generateHatsManifesto = () => {
    if (!hatsData.azotea.trim() || !hatsData.azul.trim()) {
      setValidationError('Falta completar: Necesitas definir tu AZOTEA (Paso 1) y tu COMANDO AZUL (Paso 7) para materializar el manifiesto.');
      return;
    }
    setValidationError(null);
    sound.playFanfare();
    setShowHatsResult(true);
  };

  const generateLadderManifesto = () => {
    if (!ladderData.instinto.trim() || !ladderData.inmunidad.trim()) {
      setValidationError('Falta completar: Necesitas registrar tu INSTINTO (Nivel 1) y tu BLINDAJE (Nivel 7) para materializar el mapa estratégico.');
      return;
    }
    setValidationError(null);
    sound.playFanfare();
    setShowLadderResult(true);
  };

  const resetRitual = () => {
    if (activeTab === 'hats') {
      setHatsData(INITIAL_HATS_DATA);
      localStorage.removeItem('chalamandra_hats_data');
      setHatsStep(0);
      setShowHatsResult(false);
    } else {
      setLadderData(INITIAL_LADDER_DATA);
      localStorage.removeItem('chalamandra_ladder_data');
      setLadderStep(0);
      setShowLadderResult(false);
    }
    setValidationError(null);
    setCopySuccess(false);
    setActiveCasePreset('none');
  };

  // Real-time calculated indicators


  // Coherence Diagnostics calculations for Hats Mode
  const metrics = getInteractiveMetrics(activeTab, hatsData, ladderData);

  const getRawTextManifesto = () => {
    if (activeTab === 'hats') {
      const greenStatus = isHatsVerdeStrong(hatsData) 
        ? '✓ Módulo creativo activo. Salidas no convencionales listas.' 
        : '⚠️ ADVERTENCIA: Módulo creativo vacío o demasiado pasivo.';
        
      const blueStatus = isHatsAzulStrong(hatsData) 
        ? '✓ Comando de ejecución listo para correr.' 
        : '⚠️ PARÁLISIS: Comando azul demasiado débil.';

      const balanceStatus = isHatsNegroHeavier(hatsData)
        ? '⚠️ RIESGO: El Negro pesa más que el Amarillo. Inacción probable.'
        : '✓ VIABILIDAD: Las oportunidades compensan o superan los temores evaluados.';

      return `╔═══════════════════════════════════════════════════════════╗
║    📜 MANIFIESTO OPERATIVO — CHALAMANDRA MAGISTRAL DECOX   ║
╠═══════════════════════════════════════════════════════════╣
║ 🏚️ AZOTEA (Conflicto):  ${hatsData.azotea.trim() || 'No definida'}
║
║ ⚪ BLANCO (Hechos):     ${hatsData.blanco.trim() || 'No especificado'}
║ 🔴 ROJO (Emociones):    ${hatsData.rojo.trim() || 'No especificado'}
║ ⚫ NEGRO (Riesgos):     ${hatsData.negro.trim() || 'No especificado'}
║ 🟡 AMARILLO (Oportunidades): ${hatsData.amarillo.trim() || 'No especificado'}
║ 🟢 VERDE (Creatividad): ${hatsData.verde.trim() || 'No especificado'}
║
║ 🔵 AZUL (Comando):      ${hatsData.azul.trim() || 'No especificado'}
║
║ ═══════════════════════════════════════════════════════════
║ 📌 DIAGNÓSTICO EN TIEMPO REAL:
║
║ • ${greenStatus}
║ • ${blueStatus}
║ • ${balanceStatus}
║
║ ═══════════════════════════════════════════════════════════
║ 🔥 INSTRUCCIÓN: Ejecuta el Comando Azul esta misma semana.
║ No hay más espacio para la duda mental. Transfórmate.
║ #RitualChalamandra #EdwardDeBonoPro
╚═══════════════════════════════════════════════════════════╝`;
    } else {
      const execStatus = isLadderEjecucionStrong(ladderData) 
        ? '✓ Desarme y cambio de eje táctico estructurado.' 
        : '⚠️ RESPUESTA DEBIL: Parche inmaduro ante la agresión.';
        
      const immunityStatus = isLadderInmunidadStrong(ladderData) 
        ? '✓ Blindaje de nivel 7 robustecido.' 
        : '⚠️ VULNERABILIDAD: Código de inmunidad incompleto.';

      const frameworkStatus = isLadderPassive(ladderData)
        ? '⚠️ RIESGO: Detectado rol asimétrico de sumisión frente al agresor.'
        : '✓ SOBERANÍA: Rechazas el marco asimétrico con compostura superior.';

      return `╔═══════════════════════════════════════════════════════════╗
║    ⚡ MAPA DE RESPUESTA — CHALAMANDRA MAGISTRAL DECOX     ║
╠═══════════════════════════════════════════════════════════╣
║ 👁️ N1 INSTINTO (Alarma):  ${ladderData.instinto.trim() || 'No registrado'}
║ 🛡️ N2 EMOCIÓN (Trampa):   ${ladderData.emocion.trim() || 'No registrado'}
║ 🎯 N3 JUGADA (Patrón):    ${ladderData.jugada.trim() || 'No registrado'}
║ 🎚️ N4 ROLES (Máscaras):   ${ladderData.posicion.trim() || 'No registrado'}
║ ⚡ N5 EJECUCIÓN (Parche): ${ladderData.ejecucion.trim() || 'No registrado'}
║ 📑 N6 BITÁCORA (Reflejo): ${ladderData.bitacora.trim() || 'No registrado'}
║ 🔵 N7 INMUNIDAD (Código): ${ladderData.inmunidad.trim() || 'No registrado'}
║
║ ═══════════════════════════════════════════════════════════
║ 📌 ANÁLISIS DE COHERENCIA POSICIONAL:
║
║ • ${execStatus}
║ • ${immunityStatus}
║ • ${frameworkStatus}
║
║ ═══════════════════════════════════════════════════════════
║ 🔥 DRILL TÁCTICO: Aplica el Nivel 5 de inmediato.
║ Mantén la compostura, silencio dos segundos y quiebra el marco.
║ #EscaleraEstrategica #ChalamandraLvl7
╚═══════════════════════════════════════════════════════════╝`;
    }
  };

  const copyToClipboard = () => {
    const text = getRawTextManifesto();
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const downloadManifesto = () => {
    const text = getRawTextManifesto();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const filename = activeTab === 'hats'
      ? `manifiesto_chalamandra_hats.txt`
      : `mapa_respuesta_escalera.txt`;

    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-screen bg-[#060a13] text-gray-200 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background radial glowing gradients for ambient luxury theme */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 -top-40 -right-20 opacity-30"
        style={{
          background: showResult ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)' : `radial-gradient(circle, ${currentStepInfo.glowColor} 0%, transparent 70%)`
        }}
      />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-950/15 blur-[120px] pointer-events-none -bottom-20 -left-20" />

      <div className="max-w-4xl w-full bg-[#0f172a] border border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden p-5 md:p-8 my-4">
        
        {/* FIREBASE AUTHENTICATION & CLOUD SYNC CONTROL BAR */}
        <div className="bg-[#0b1120] border border-slate-800/90 rounded-2xl p-3.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-20">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Usuario'} 
                    className="w-10 h-10 rounded-full border border-amber-500/50 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-sm">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-100">
                      {user.displayName || 'Usuario Chalamandra'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3 animate-pulse" /> Firestore Activo
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {user.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-200 block">
                    Modo Nube Chalamandra (Firebase)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Inicia sesión con Google para sincronizar tus rituales en la nube
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <a
              href="https://chalamandramagistral.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir web principal chalamandramagistral.com"
              title="Visitar sitio principal chalamandramagistral.com"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">chalamandramagistral.com</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            <a
              href="https://decodificadorachalamandramagis.blogspot.com/?m=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir blog oficial Decodificadora Chalamandra Magistral"
              title="Visitar Blog Oficial de los 6 Sombreros"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Blog Oficial</span>
              <ExternalLink className="w-3 h-3 text-purple-400" />
            </a>

            {user ? (
              <>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mis Rituales ({savedHatsRituals.length + savedLadderRituals.length})</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                aria-label="Iniciar sesión con Google"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión con Google</span>
              </button>
            )}
          </div>
        </div>

        {/* FLAVOR & SENSORY THEME SELECTOR ("MAS COLOR MÁS SABOR") */}
        <div className="mb-6 bg-[#080d19]/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 relative z-20 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${FLAVOR_THEMES[flavorTheme].gradient} text-slate-950 shadow-sm`}>
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-200 block">
                Sabor y Aura Táctica
              </span>
              <span className="text-[10px] text-slate-400">
                Elige la paleta cromática activa de tu sesión
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end w-full md:w-auto">
            {(['cyberpunk', 'lava', 'emerald', 'nebula', 'gold'] as const).map((tKey) => {
              const theme = FLAVOR_THEMES[tKey];
              const isActive = flavorTheme === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => changeFlavorTheme(tKey)}
                  aria-label={`Seleccionar tema ${theme.name}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                    isActive 
                      ? `${theme.buttonActive} border-transparent scale-105` 
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                  <span>{theme.name}</span>
                </button>
              );
            })}

            {/* Sound Mute/Unmute Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Silenciar Efectos' : 'Activar Sonido Táctico'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {cloudMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-between animate-fade-in relative z-20">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              {cloudMessage}
            </span>
            <button 
              onClick={() => setCloudMessage(null)}
              aria-label="Cerrar mensaje de notificación"
              className="text-emerald-400 hover:text-emerald-200 font-bold ml-2 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {authError && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-between gap-3 relative z-20 shadow-md">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="leading-relaxed">{authError}</span>
            </div>
            <button 
              onClick={clearAuthError}
              className="text-amber-400 hover:text-amber-200 font-black px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-xs shrink-0 cursor-pointer transition-all"
              title="Cerrar aviso"
            >
              ✕ Entendido
            </button>
          </div>
        )}

        {/* Elite Hero Presentation Block with Generated Asset */}
        <div className="relative rounded-2xl overflow-hidden mb-6 border border-slate-800/80 bg-slate-950/40">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
          <img 
            src={heroImage} 
            alt="The Six Thinking Hats Strategic Board" 
            className="w-full h-44 object-cover object-center scale-102 hover:scale-105 transition-transform duration-1000 opacity-65"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex items-end justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Chalamandra Magistral decoX</span>
                </div>
                <a
                  href="https://chalamandramagistral.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-300 text-[11px] font-semibold transition-colors"
                  title="Visitar chalamandramagistral.com"
                >
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>chalamandramagistral.com</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <h1 className="text-2xl md:text-3.5xl font-black font-display bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                Los 6 Sombreros
              </h1>
              <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-xl mt-1 leading-relaxed">
                Herramienta interactiva y ritual de toma de decisiones basado en el método de Edward de Bono.
              </p>
            </div>
            
            {/* Chalamandra character badge */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/80 border border-amber-500/30 rounded-2xl p-2 shrink-0 shadow-lg backdrop-blur-sm">
              <img 
                src={chalamandraAvatar} 
                alt="Chalamandra" 
                className="w-12 h-12 rounded-xl object-cover border border-amber-400/50 shadow-md"
              />
              <div className="pr-1">
                <span className="text-[11px] font-black text-amber-300 block leading-tight">
                  Chalamandra
                </span>
                <span className="text-[9px] font-bold text-slate-400 block font-mono">
                  Soberanía & Caló
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK PRESETS CAROUSEL (Super Interactivo y Dinámico) */}
        {activeTab !== 'trainer' && activeTab !== 'chat' && (
        <div className="bg-slate-950/45 border border-slate-800/80 p-4 rounded-2xl mb-6 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Lanzador de Casos de Prueba Táctica
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              1-Click AutoFill
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3 leading-normal">
            Selecciona un caso complejo de la vida real para rellenar instantáneamente la aplicación, analizar las métricas dinámicas y ver la conclusión en acción:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeTab === 'hats' ? (
              <>
                <button
                  onClick={() => handlePresetSelect('emprendedor')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold text-left transition-all flex items-center justify-between border ${
                    activeCasePreset === 'emprendedor'
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span>🚀 Renuncia Corporativa</span>
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${activeCasePreset === 'emprendedor' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => handlePresetSelect('clienteAbusivo')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold text-left transition-all flex items-center justify-between border ${
                    activeCasePreset === 'clienteAbusivo'
                      ? 'bg-rose-500/10 border-rose-500/50 text-rose-300 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span>💸 Cliente Abusivo / Scope Creep</span>
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${activeCasePreset === 'clienteAbusivo' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => handlePresetSelect('sociosConflicto')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold text-left transition-all flex items-center justify-between border ${
                    activeCasePreset === 'sociosConflicto'
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span>🤝 Conflicto Secreto de Socios</span>
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${activeCasePreset === 'sociosConflicto' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handlePresetSelect('testeoCruel')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold text-left transition-all flex items-center justify-between border ${
                    activeCasePreset === 'testeoCruel'
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span>🎭 Testeo Cruel (Oficina)</span>
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${activeCasePreset === 'testeoCruel' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => handlePresetSelect('silencioCastigador')}
                  className={`py-2 px-3 rounded-lg text-xs font-extrabold text-left transition-all flex items-center justify-between border ${
                    activeCasePreset === 'silencioCastigador'
                      ? 'bg-violet-500/10 border-violet-500/50 text-violet-300 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span>🔇 Silencio Táctico / Ley Hielo</span>
                  <Check className={`w-3.5 h-3.5 shrink-0 ml-1.5 ${activeCasePreset === 'silencioCastigador' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                <button
                  onClick={() => resetRitual()}
                  className="py-2 px-3 rounded-lg text-xs font-bold text-slate-500 bg-slate-900/20 border border-slate-800/50 hover:text-slate-300 hover:bg-slate-850 text-center transition-all"
                >
                  🗑️ Limpiar Todo
                </button>
              </>
            )}
          </div>
        </div>
        )}

        {/* Tab Module Toggles */}
        {!showResult && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-[#0b0f19] border border-slate-800/60 rounded-2xl mb-6 relative z-10">
            <button
              onClick={() => handleTabChange('hats')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === 'hats'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/60 text-amber-400 shadow-md'
                  : 'text-slate-500 hover:text-slate-300 bg-transparent border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>6 Sombreros</span>
            </button>
            
            <button
              onClick={() => handleTabChange('ladder')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === 'ladder'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/60 text-rose-400 shadow-md'
                  : 'text-slate-500 hover:text-slate-300 bg-transparent border border-transparent'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>Escalera N7</span>
            </button>

            <button
              onClick={() => handleTabChange('trainer')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === 'trainer'
                  ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/60 text-cyan-300 shadow-lg shadow-cyan-950/60'
                  : 'text-slate-500 hover:text-slate-300 bg-transparent border border-transparent'
              }`}
            >
              <Brain className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Entrenador Ruleta</span>
            </button>

            <button
              onClick={() => handleTabChange('chat')}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/60 text-amber-300 shadow-lg'
                  : 'text-slate-500 hover:text-slate-300 bg-transparent border border-transparent'
              }`}
            >
              <Bot className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Chat Gemini 3.5</span>
            </button>
          </div>
        )}

        {/* Timelines Navigation Indicator */}
        {activeTab !== 'trainer' && activeTab !== 'chat' && !showResult && (
          <div className="mb-6 relative z-10">
            <div className="flex gap-1.5 justify-between items-center overflow-x-auto pb-2 scrollbar-none">
              {(activeTab === 'hats' ? hatsStepsInfo : ladderStepsInfo).map((st) => {
                const isCurrent = activeStep === st.index;
                const isCompleted = activeData[st.field].trim() !== '';
                const StepIcon = st.icon;

                return (
                  <button
                    key={st.index}
                    id={`nav-step-${st.index}`}
                    onClick={() => handleStepClick(st.index)}
                    className={`flex-1 min-w-[36px] h-9 rounded-lg flex items-center justify-center transition-all duration-300 relative cursor-pointer ${
                      isCurrent 
                        ? 'bg-slate-800 text-slate-100 border border-slate-700 font-bold scale-105' 
                        : isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-900/50 text-slate-500 border border-transparent hover:bg-slate-800/40 hover:text-slate-400'
                    }`}
                    title={st.title}
                  >
                    <StepIcon className={`w-4 h-4 ${isCurrent ? st.color : ''}`} />
                    {isCompleted && !isCurrent && (
                      <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Visual dynamic thin line indicators */}
            <div className="flex gap-1 mt-2">
              {(activeTab === 'hats' ? hatsStepsInfo : ladderStepsInfo).map((st) => (
                <div 
                  key={st.index} 
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    st.index === activeStep 
                      ? activeTab === 'hats'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'bg-gradient-to-r from-rose-500 to-cyan-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' 
                      : st.index < activeStep 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trainer' ? (
          <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando entrenador...</div>}>
            <CognitiveTrainerTab />
          </Suspense>
        ) : activeTab === 'chat' ? (
          <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Cargando chat...</div>}>
            <GeminiHatChatbot />
          </Suspense>
        ) : (
          /* Content Body with customized glowing border frame */
          <div 
            className="relative z-10 min-h-[340px] rounded-2xl p-4 md:p-6 transition-all duration-500"
            style={{
              border: `1px solid ${showResult ? 'rgba(16, 185, 129, 0.2)' : currentStepInfo.cssColor + '33'}`,
              boxShadow: showResult ? '0 10px 30px -10px rgba(16, 185, 129, 0.05)' : `0 10px 30px -10px ${currentStepInfo.cssColor}15`
            }}
          >
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`${activeTab}-${activeStep}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Active Highlight Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${currentStepInfo.hatColor}`}>
                      <currentStepInfo.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                        {currentStepInfo.label}
                      </span>
                      <h2 className="text-xl font-black font-display text-slate-100 flex items-center gap-2">
                        {currentStepInfo.title}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Progress tracker pill */}
                  <span className="self-start md:self-auto px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800/80 text-xs font-bold font-mono text-slate-300">
                    Nivel {activeStep + 1} / 7
                  </span>
                </div>

                {/* Form Input Section */}
                <div className="space-y-2">
                  <label htmlFor={`input-${currentStepInfo.field}`} className="block text-sm font-bold text-slate-300 pl-1">
                    Escribe tu respuesta estructurada:
                  </label>
                  <p className="text-sm text-slate-400 leading-relaxed italic mb-3 pl-1">
                    {currentStepInfo.desc}
                  </p>

                  {currentStepInfo.type === 'textarea' ? (
                    <div className="relative">
                      <textarea
                        id={`input-${currentStepInfo.field}`}
                        value={activeData[currentStepInfo.field as keyof typeof activeData]}
                        onChange={(e) => {
                          if (activeTab === 'hats') {
                            setHatsData({ ...hatsData, [currentStepInfo.field]: e.target.value });
                          } else {
                            setLadderData({ ...ladderData, [currentStepInfo.field]: e.target.value });
                          }
                        }}
                        placeholder={currentStepInfo.placeholder}
                        className="w-full min-h-[140px] p-4 bg-[#060a13]/80 border border-slate-800 focus:border-slate-600 rounded-xl text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-slate-700 outline-none transition-all duration-200 text-[15px] leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        id={`input-${currentStepInfo.field}`}
                        value={activeData[currentStepInfo.field as keyof typeof activeData]}
                        onChange={(e) => {
                          if (activeTab === 'hats') {
                            setHatsData({ ...hatsData, [currentStepInfo.field]: e.target.value });
                          } else {
                            setLadderData({ ...ladderData, [currentStepInfo.field]: e.target.value });
                          }
                        }}
                        placeholder={currentStepInfo.placeholder}
                        className="w-full p-4 bg-[#060a13]/80 border border-slate-800 focus:border-slate-600 rounded-xl text-slate-100 placeholder-slate-600 focus:ring-1 focus:ring-slate-700 outline-none transition-all duration-200 text-[15px]"
                      />
                    </div>
                  )}

                  {/* Helpers & Tips */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-850">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{currentStepInfo.help}</span>
                    </div>

                    {activeTab === 'hats' && activeStep > 0 && (
                      <button
                        onClick={() => handleAISuggestion(currentStepInfo.field)}
                        disabled={isGeneratingSuggestion === currentStepInfo.field}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingSuggestion === currentStepInfo.field ? 'Generando...' : '✨ Sugerencia con IA'}
                      </button>
                    )}
                    
                    <span className="font-mono text-slate-500 self-end">
                      {activeData[currentStepInfo.field as keyof typeof activeData].trim().length} caracteres
                    </span>
                  </div>
                </div>

                {/* Validation warning banner */}
                {validationError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl text-sm flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}

                {/* Real-time Thermometers Bar (Interactivo / Dinámico) */}
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

                {/* Step navigation buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={activeStep === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                  </button>

                  <button
                    onClick={handleNext}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer ${
                      activeStep === totalSteps - 1
                        ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-[0.98]'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:shadow-rose-600/10 active:scale-[0.98]'
                    }`}
                  >
                    <span>
                      {activeStep === totalSteps - 1 
                        ? activeTab === 'hats' ? '🎯 Generar Manifiesto' : '🎯 Generar Mapa'
                        : 'Siguiente'}
                    </span>
                    {activeStep !== totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result header banner */}
                <div className="text-center p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-1">
                    ✓ Ritual de Poder Concluido
                  </span>
                  <h2 className="text-2.5xl font-black font-display text-slate-100 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {activeTab === 'hats' ? 'Tu Manifiesto Operativo Chalamandra' : 'Tu Mapa de Respuesta Estratégica'}
                  </h2>
                </div>

                {/* Validation warnings in visual block */}
                <div className="bg-[#0b101d] border border-slate-850 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                    Escáner de Coherencia Táctica
                  </h3>
                  
                  {activeTab === 'hats' ? (
                    <div className="space-y-2.5 text-sm">
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${isHatsVerdeStrong(hatsData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-amber-500/5 text-amber-400 border-amber-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getHatsVerdeFeedback(hatsData)}</p>
                      </div>
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${isHatsAzulStrong(hatsData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-rose-500/5 text-rose-400 border-rose-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getHatsAzulFeedback(hatsData)}</p>
                      </div>
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${!isHatsNegroHeavier(hatsData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-rose-500/5 text-rose-400 border-rose-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getHatsCoherenceFeedback(hatsData)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm">
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${isLadderEjecucionStrong(ladderData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-amber-500/5 text-amber-400 border-amber-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getLadderEjecucionFeedback(ladderData)}</p>
                      </div>
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${isLadderInmunidadStrong(ladderData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-rose-500/5 text-rose-400 border-rose-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getLadderInmunidadFeedback(ladderData)}</p>
                      </div>
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 border ${!isLadderPassive(ladderData) ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' : 'bg-rose-500/5 text-rose-400 border-rose-500/15'}`}>
                        <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                        <p className="font-medium">{getLadderCoherenceFeedback(ladderData)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparative AI Coherence Scanner (Gemini) */}
                {activeTab === 'hats' && (
                  <Suspense fallback={<div className="p-4 text-center text-slate-400 text-xs">Cargando escáner...</div>}>
                    <AICoherenceScanner hatsData={hatsData} />
                  </Suspense>
                )}

                {/* Dashboard layout of decisions / elements */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block pl-1">
                      Desglose Visual de Estructura
                    </h3>
                    
                    {activeTab === 'hats' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Azotea */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-amber-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>La Azotea (Conflicto Original)</span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                            {hatsData.azotea}
                          </p>
                        </div>

                        {/* Blanco */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-300/20 shadow-md">
                          <div className="flex items-center gap-2 text-slate-300 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Sombrero Blanco (Hechos Duros ⚪)</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {hatsData.blanco || 'Ninguno especificado.'}
                          </p>
                        </div>

                        {/* Rojo */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-rose-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Heart className="w-3.5 h-3.5" />
                            <span>Sombrero Rojo (Visceralidad 🔴)</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {hatsData.rojo || 'Ninguna especificada.'}
                          </p>
                        </div>

                        {/* Negro */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-violet-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-violet-400 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Sombrero Negro (Pérdidas y Riesgo ⚫)</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {hatsData.negro || 'Ninguno especificado.'}
                          </p>
                        </div>

                        {/* Amarillo */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-yellow-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-yellow-400 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Sun className="w-3.5 h-3.5" />
                            <span>Sombrero Amarillo (Oportunidad 🟡)</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {hatsData.amarillo || 'Ninguna especificada.'}
                          </p>
                        </div>

                        {/* Verde */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-emerald-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Sombrero Verde (Pensamiento Lateral 🟢)</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {hatsData.verde || 'Ninguna especificada.'}
                          </p>
                        </div>

                        {/* Azul */}
                        <div className="bg-[#0e1628] p-5 rounded-xl border border-cyan-500/30 md:col-span-2 shadow-lg">
                          <div className="flex items-center gap-2 text-cyan-400 font-black text-sm uppercase tracking-wider mb-2">
                            <Terminal className="w-4 h-4 animate-pulse" />
                            <span>Paso 7: Comando Azul de Ejecución Irreversible (🔵)</span>
                          </div>
                          <p className="text-base text-slate-100 font-black leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-cyan-500 pl-3">
                            {hatsData.azul}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Instinto */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-rose-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-rose-500 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>N1: Instinto / Alarma Física</span>
                          </div>
                          <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                            {ladderData.instinto}
                          </p>
                        </div>

                        {/* Emoción */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-violet-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-violet-400 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span>N2: Emoción e Inducción</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {ladderData.emocion || 'No registrado.'}
                          </p>
                        </div>

                        {/* Jugada */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-amber-500/20 shadow-md">
                          <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Target className="w-3.5 h-3.5" />
                            <span>N3: Patrón de la Jugada</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed font-bold">
                            {ladderData.jugada || 'No registrado.'}
                          </p>
                        </div>

                        {/* Roles */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-300/20 shadow-md">
                          <div className="flex items-center gap-2 text-slate-300 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>N4: Posición y Máscaras</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {ladderData.posicion || 'No registrado.'}
                          </p>
                        </div>

                        {/* Ejecución */}
                        <div className="bg-[#0e1628] p-5 rounded-xl border border-yellow-500/30 md:col-span-2 shadow-lg">
                          <div className="flex items-center gap-2 text-yellow-400 font-black text-sm uppercase tracking-wider mb-2">
                            <Zap className="w-4 h-4 animate-pulse" />
                            <span>N5: Ejecución / Contraataque Táctico</span>
                          </div>
                          <p className="text-sm text-slate-100 font-black leading-relaxed whitespace-pre-wrap border-l-2 border-yellow-400 pl-3">
                            {ladderData.ejecucion || 'No registrado.'}
                          </p>
                        </div>

                        {/* Bitácora */}
                        <div className="bg-[#0b101c] p-4 rounded-xl border border-emerald-500/20 md:col-span-2 shadow-md">
                          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wide mb-1.5">
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>N6: Bitácora de Entrenamiento</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {ladderData.bitacora || 'No registrado.'}
                          </p>
                        </div>

                        {/* Inmunidad */}
                        <div className="bg-[#0e1628] p-5 rounded-xl border border-cyan-500/30 md:col-span-2 shadow-lg">
                          <div className="flex items-center gap-2 text-cyan-400 font-black text-sm uppercase tracking-wider mb-2">
                            <Terminal className="w-4 h-4" />
                            <span>N7: Código de Inmunidad Definitiva</span>
                          </div>
                          <p className="text-base text-slate-100 font-black leading-relaxed whitespace-pre-wrap border-l-2 border-cyan-500 pl-3">
                            {ladderData.inmunidad}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Historical Evolution Chart with Recharts */}
                  {activeTab === 'hats' && (
                    <div className="pt-1">
                      <Suspense fallback={<div className="p-4 text-center text-slate-400 text-xs">Cargando gráfica...</div>}>
                        <HatsEvolutionChart 
                          savedRituals={savedHatsRituals}
                          currentHatsData={hatsData}
                        />
                      </Suspense>
                    </div>
                  )}

                  {/* Pre/ASCII Block for copying */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 block pl-1">
                      Manifiesto Texto Formateado (ASCII/Terminal)
                    </h3>
                    <div className="relative">
                      <pre className="p-5 bg-[#060a13] border border-slate-800 rounded-xl overflow-x-auto text-[11px] md:text-xs font-mono text-slate-300 leading-relaxed whitespace-pre max-h-[350px] scrollbar-thin">
                        {getRawTextManifesto()}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleCloudSave}
                    disabled={isSavingCloud}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 rounded-xl font-black text-sm transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCloud ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CloudUpload className="w-4 h-4" />
                    )}
                    <span>Guardar en la Nube (Firestore)</span>
                  </button>

                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      copySuccess 
                        ? 'bg-emerald-500 text-slate-950 font-black scale-102 shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 shadow-md'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        ¡Manifiesto Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-cyan-400" />
                        Copiar al Portapapeles
                      </>
                    )}
                  </button>

                  <button
                    onClick={downloadManifesto}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    Descargar .txt
                  </button>
                </div>

                {/* Authentic Decodificadora Chalamandra Blog & Ritual Magycall Section */}
                <div className="bg-gradient-to-br from-[#1b0d28] via-[#12081c] to-[#0a0512] border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Blog Oficial & Ritual Magycall</span>
                      </div>
                      <h4 className="text-base md:text-lg font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                        Decodificadora Chalamandra Magistral DecoX
                      </h4>
                      <p className="text-xs text-purple-200/90 italic font-medium leading-relaxed">
                        “No prometo felicidad eterna. Prometo un método para ver el caos con otros ojos.”
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ✨ <strong className="text-purple-300">Ritual Magycall:</strong> 60 minutos • 6 sombreros • 1 decisión clara. 
                        No es magia, es estructura con flow. Lee las historias y dilemas resueltos en el blog oficial o vive el ritual interactivo completo.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                      <a
                        href="https://decodificadorachalamandramagis.blogspot.com/?m=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Leer Blog de los 6 Sombreros</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      
                      <a
                        href="https://view.genially.com/6a0e244fbb4537e74872bde4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-purple-200 border border-purple-500/40 rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hacer el Ritual Magycall (Genially)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <div className="flex justify-center pt-2">
                  <button
                    onClick={resetRitual}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reiniciar ritual actual desde cero
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}

        {/* INTERACTIVE ACADEMY / LA ARMERÍA DE SOMBREROS (Añade imágenes de los sombreros y máxima interactividad) */}
        <div className="mt-8 bg-slate-950/45 border border-slate-800/80 p-5 rounded-3xl relative z-10">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black uppercase tracking-wider text-slate-200">
              La Armería de Sombreros • Diccionario de Poder
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            Toca cualquiera de los sombreros estratégicos de Edward de Bono para desplegar de forma interactiva su mantra secreto, sus preguntas gatillo de poder, y entender su rol mental en el Ritual de Chalamandra:
          </p>

          {/* Interactive Hats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {academyHats.map((hat) => {
              const isSelected = activeAcademyHat === hat.id;
              const HatIcon = hat.icon;
              return (
                <motion.button
                  key={hat.id}
                  whileHover={{ y: -6, scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={isSelected ? {
                    y: -10,
                    scale: 1.08,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(245, 158, 11, 0.4)",
                    borderColor: "rgba(245, 158, 11, 0.8)"
                  } : {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                    borderColor: "rgba(30, 41, 59, 0.8)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  onClick={() => {
                    sound.playClick();
                    setActiveAcademyHat(isSelected ? null : hat.id);
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer relative overflow-hidden ${
                    isSelected 
                      ? `${hat.color} border-transparent shadow-2xl ${hat.auraColor}`
                      : `bg-[#0a0f1d] ${hat.borderColor} text-slate-300 hover:border-slate-500`
                  }`}
                >
                  {/* Dynamic Glow Overlay behind image when selected */}
                  {isSelected && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-cyan-500/20 pointer-events-none rounded-2xl"
                    />
                  )}

                  {/* Glowing custom generated Image represents the "stylized hat" */}
                  <motion.div 
                    animate={isSelected ? { rotate: [0, -4, 4, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner bg-slate-950/80 group z-10"
                  >
                    <img 
                      src={hat.image} 
                      alt={hat.title} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'brightness-120 contrast-110' : 'opacity-85 brightness-95 hover:opacity-100'}`}
                      referrerPolicy="no-referrer"
                    />
                    {/* Tiny icon badge at the corner for double interactive fidelity */}
                    <div className={`absolute bottom-1 right-1 p-1 rounded-md ${isSelected ? 'bg-slate-950/90 text-white' : 'bg-slate-900/95 text-slate-300'} border border-slate-850`}>
                      <HatIcon className="w-3.5 h-3.5" />
                    </div>
                    {/* Active/Selected indicator */}
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-current opacity-90 animate-pulse shadow-glow" 
                      />
                    )}
                  </motion.div>
                  <span className="text-[11px] font-black tracking-tight uppercase leading-none z-10">
                    {hat.title.split(' ')[1]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Collapsible Expanded Detail Card */}
          <AnimatePresence>
            {activeAcademyHat && (() => {
              const selectedHat = academyHats.find(h => h.id === activeAcademyHat);
              if (!selectedHat) return null;
              const InfoIcon = selectedHat.icon;
              return (
                <motion.div
                  key={selectedHat.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96, height: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, scale: 0.96, height: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className="mt-5 p-6 bg-[#0a0f1d] border-2 border-amber-500/40 rounded-2xl space-y-4 overflow-hidden shadow-2xl relative"
                >
                  {/* Shimmer top border line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 animate-pulse" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
                    <motion.div 
                      initial={{ scale: 0.7, rotate: -8, y: 10 }}
                      animate={{ scale: 1, rotate: 0, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-slate-950/80 shrink-0 relative group"
                    >
                      <img 
                        src={selectedHat.image} 
                        alt={selectedHat.title} 
                        className="w-full h-full object-cover brightness-110 contrast-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </motion.div>

                    <div className="space-y-1">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${selectedHat.color} text-slate-950`}>
                          Sombrero Seleccionado
                        </span>
                      </motion.div>

                      <motion.h4 
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg md:text-xl font-black text-slate-100 uppercase tracking-wider flex items-center gap-2 font-display"
                      >
                        <InfoIcon className="w-5 h-5 text-amber-400" />
                        {selectedHat.title}
                      </motion.h4>

                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-mono text-amber-400 italic block"
                      >
                        Mantra: "{selectedHat.mantra}"
                      </motion.span>
                    </div>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/50 p-3.5 rounded-xl border border-slate-800"
                  >
                    {selectedHat.desc}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      Preguntas de Enfoque Psicológico:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {selectedHat.questions.map((q, idx) => (
                        <motion.li 
                          key={idx} 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 + idx * 0.05 }}
                          className="bg-slate-950/80 p-2.5 rounded-xl text-[11px] text-slate-200 border border-slate-800 leading-snug flex items-start gap-2 shadow-sm"
                        >
                          <span className="text-amber-400 font-extrabold shrink-0">?</span>
                          <span>{q}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Single-Hat AutoFill Button */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="pt-2 flex justify-end"
                  >
                    <button
                      onClick={() => {
                        sound.playPreset();
                        // Locate preset text corresponding to this hat in 'emprendedor' scenario
                        const presetText = PRESETS_HATS.emprendedor[selectedHat.id as keyof typeof PRESETS_HATS.emprendedor];
                        if (activeTab === 'hats') {
                          setHatsData(prev => ({ ...prev, [selectedHat.id]: presetText }));
                          // Auto switch active step to match this hat for visual focus
                          const targetStep = hatsStepsInfo.findIndex(st => st.field === selectedHat.id);
                          if (targetStep !== -1) setHatsStep(targetStep);
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🧪 Rellenar ejemplo de este sombrero</span>
                    </button>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <footer className="mt-8 pt-4 border-t border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono relative z-10">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Edward de Bono • Metodología de los Seis Sombreros de Pensamiento
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://chalamandramagistral.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-sans font-bold flex items-center gap-1 transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>chalamandramagistral.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a 
              href="https://decodificadorachalamandramagis.blogspot.com/?m=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 font-sans font-bold flex items-center gap-1 transition-colors"
            >
              <span>Blog: Decodificadora</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a 
              href="https://view.genially.com/6a0e244fbb4537e74872bde4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-sans font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ritual Magycall</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-purple-300 font-bold">Chalamandra Magistral decoX</span>
          </div>
        </footer>

      </div>

      {/* CLOUD FIRESTORE HISTORY MODAL OVERLAY */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1120] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-100 uppercase tracking-wider">
                      Historial en la Nube de Firestore
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tus rituales guardados y sincronizados en tiempo real
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHistoryModal(false)}
                  aria-label="Cerrar historial de rituales"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-bold cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Rituals List */}
              <div className="space-y-6">
                {/* 6 Thinking Hats Section */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Rituales de 6 Sombreros ({savedHatsRituals.length})
                  </h4>

                  {savedHatsRituals.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-900 text-center text-xs text-slate-500">
                      No tienes ningún ritual de 6 Sombreros guardado en la nube todavía.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedHatsRituals.map((ritual) => (
                        <div 
                          key={ritual.id} 
                          className="p-4 rounded-2xl bg-[#0e1628] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                        >
                          <div className="space-y-1 max-w-md">
                            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {ritual.createdAt ? new Date(ritual.createdAt.seconds * 1000).toLocaleString('es-ES') : 'Reciente'}
                            </span>
                            <h5 className="text-xs font-bold text-slate-200 line-clamp-1">
                              {ritual.azotea || 'Ritual Sin Título'}
                            </h5>
                            <p className="text-[11px] text-cyan-400 font-mono line-clamp-1">
                              Comando Azul: {ritual.azul || 'Sin comando'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                            <button
                              onClick={() => loadHatsRitual(ritual)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-extrabold transition-all cursor-pointer"
                            >
                              Cargar Ritual
                            </button>
                            <button
                              onClick={() => handleDeleteHatsRitual(ritual.id!)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
                              title="Eliminar de Firestore"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Strategic Ladder Section */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Escalera Estratégica ({savedLadderRituals.length})
                  </h4>

                  {savedLadderRituals.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-900 text-center text-xs text-slate-500">
                      No tienes mapas de Escalera Estratégica guardados en la nube todavía.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedLadderRituals.map((ritual) => (
                        <div 
                          key={ritual.id} 
                          className="p-4 rounded-2xl bg-[#0e1628] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-500/30 transition-all"
                        >
                          <div className="space-y-1 max-w-md">
                            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {ritual.createdAt ? new Date(ritual.createdAt.seconds * 1000).toLocaleString('es-ES') : 'Reciente'}
                            </span>
                            <h5 className="text-xs font-bold text-slate-200 line-clamp-1">
                              Instinto: {ritual.instinto || 'Sin instinto'}
                            </h5>
                            <p className="text-[11px] text-amber-400 font-mono line-clamp-1">
                              Ejecución: {ritual.ejecucion || 'Sin ejecución'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                            <button
                              onClick={() => loadLadderRitual(ritual)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold transition-all cursor-pointer"
                            >
                              Cargar Mapa
                            </button>
                            <button
                              onClick={() => handleDeleteLadderRitual(ritual.id!)}
                              className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all cursor-pointer"
                              title="Eliminar de Firestore"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL-SCREEN IMMERSIVE FOCUS MODE OVERLAY ("Modo Enfoque Inmersivo") */}
      <AnimatePresence>
        {isFocusMode && (
          <div className="fixed inset-0 bg-[#050811]/95 backdrop-blur-xl z-50 flex flex-col p-4 md:p-8 overflow-y-auto">
            <div className="max-w-3xl w-full mx-auto my-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${currentStepInfo.hatColor}`}>
                    <currentStepInfo.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
                      {currentStepInfo.label} • Modo Inmersivo de Enfoque
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black font-display text-slate-100">
                      {currentStepInfo.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => { setIsFocusMode(false); sound.playClick(); }}
                  className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Salir de Enfoque</span>
                </button>
              </div>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed italic border-l-2 border-amber-500 pl-4">
                "{currentStepInfo.desc}"
              </p>

              {currentStepInfo.type === 'textarea' ? (
                <textarea
                  value={activeData[currentStepInfo.field as keyof typeof activeData]}
                  onChange={(e) => {
                    if (activeTab === 'hats') {
                      setHatsData({ ...hatsData, [currentStepInfo.field]: e.target.value });
                    } else {
                      setLadderData({ ...ladderData, [currentStepInfo.field]: e.target.value });
                    }
                  }}
                  placeholder={currentStepInfo.placeholder}
                  className="w-full min-h-[260px] p-6 bg-[#080d19] border-2 border-slate-700 focus:border-amber-500/80 rounded-2xl text-slate-100 placeholder-slate-600 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all text-base md:text-lg leading-relaxed shadow-inner"
                />
              ) : (
                <input
                  type="text"
                  value={activeData[currentStepInfo.field as keyof typeof activeData]}
                  onChange={(e) => {
                    if (activeTab === 'hats') {
                      setHatsData({ ...hatsData, [currentStepInfo.field]: e.target.value });
                    } else {
                      setLadderData({ ...ladderData, [currentStepInfo.field]: e.target.value });
                    }
                  }}
                  placeholder={currentStepInfo.placeholder}
                  className="w-full p-6 bg-[#080d19] border-2 border-slate-700 focus:border-cyan-500/80 rounded-2xl text-slate-100 placeholder-slate-600 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all text-base md:text-lg shadow-inner"
                />
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{currentStepInfo.help}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => { setIsFocusMode(false); handleNext(); }}
                    className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-xl hover:brightness-110 transition-all cursor-pointer"
                  >
                    Guardar y Continuar →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING GEMINI TUTOR LAUNCHER (Accessible across all tabs) */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-5 right-5 z-40">
          {!showFloatingChat ? (
            <button
              onClick={() => {
                setShowFloatingChat(true);
                sound.playClick();
              }}
              className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-full shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 border-2 border-white/20"
              title="Abrir Chatbot Mentor de los 6 Sombreros"
            >
              <Bot className="w-5 h-5 text-slate-950" />
              <span className="hidden sm:inline">Mentor 6 Sombreros (Gemini)</span>
            </button>
          ) : (
            <Suspense fallback={<div className="p-4 text-center text-slate-400 text-xs">Cargando mentor...</div>}>
              <GeminiHatChatbot
                isFloating={true}
                onClose={() => setShowFloatingChat(false)}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
