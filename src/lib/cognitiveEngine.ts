import { 
  HatKey, 
  CharacterKey, 
  PlayerCognitiveProfile, 
  CognitiveEvaluation, 
  CognitiveChallenge,
  CHARACTERS,
  TRAINER_HATS
} from '../data/trainerData';

// Semantic lexicon for cognitive hat validation
const HAT_LEXICONS: Record<HatKey, string[]> = {
  blanco: ['dato', 'datos', 'cifra', 'cifras', 'numero', 'número', 'pesos', 'dolar', 'contrato', 'fecha', 'registro', 'evidencia', 'reporte', 'factura', 'medible', 'estadistica', 'porcentaje', 'comprobable', 'hecho', 'realidad', 'auditoria'],
  rojo: ['siento', 'miedo', 'rabia', 'coraje', 'panico', 'pánico', 'angustia', 'intuicion', 'intuición', 'olfato', 'deseo', 'frustracion', 'frustración', 'sospecha', 'vibra', 'pesadez', 'alivio', 'odio', 'pasion', 'pasión', 'corazonada'],
  negro: ['riesgo', 'peligro', 'fallo', 'costo', 'coste', 'perder', 'quiebra', 'demanda', 'retraso', 'bloqueo', 'ruptura', 'vulnerabilidad', 'amenaza', 'peor', 'trampa', 'responsabilidad', 'desgaste', 'inviable', 'critica', 'crítica'],
  amarillo: ['beneficio', 'ventaja', 'oportunidad', 'ganancia', 'margen', 'valor', 'potencial', 'solucion', 'solución', 'retorno', 'crecimiento', 'fuerza', 'exito', 'éxito', 'alianza', 'ahorro', 'eficiencia', 'aprovechar'],
  verde: ['idea', 'alternativa', 'disruptivo', 'cambiar', 'girar', 'reinventar', 'innovar', 'hack', 'diferente', 'locura', 'probar', 'nuevo', 'prototipo', 'sustituir', 'invertir', 'experimento', 'original', 'transformar'],
  azul: ['orden', 'proceso', 'siguiente', 'paso', 'prioridad', 'plan', 'metodo', 'método', 'conclusion', 'conclusión', 'control', 'calendario', 'responsable', 'meta', 'etapa', 'estructura', 'decision', 'decisión', 'cronograma']
};

export function evaluateResponse(
  text: string, 
  timeTaken: number, 
  hat: HatKey, 
  character: CharacterKey, 
  _mode?: string
): { score: number; stars: number; feedback: string; dominantInsight: string } {
  const clean = text.trim().toLowerCase();
  const charCount = clean.length;
  const words = clean.split(/\s+/).filter(Boolean);
  const lexicon = HAT_LEXICONS[hat] || [];
  
  // Keyword density matching
  let matches = 0;
  for (const keyword of lexicon) {
    if (clean.includes(keyword)) {
      matches++;
    }
  }

  let baseScore = 40;

  // Length depth scoring
  if (charCount >= 80) baseScore += 20;
  if (charCount >= 140) baseScore += 15;
  if (charCount >= 220) baseScore += 10;
  if (words.length < 5) baseScore = Math.max(15, baseScore - 30);

  // Semantic keyword reinforcement
  baseScore += Math.min(matches * 8, 25);

  // Time appropriateness
  if (timeTaken < 5 && charCount > 100) {
    // Pasted text / too fast
    baseScore -= 10;
  } else if (timeTaken >= 12 && timeTaken <= 60) {
    // Thoughtful reflective speed
    baseScore += 5;
  }

  // Cap score between 20 and 100
  const finalScore = Math.min(Math.max(Math.round(baseScore), 25), 100);

  // Calculate stars
  let stars = 1;
  if (finalScore >= 88) stars = 5;
  else if (finalScore >= 75) stars = 4;
  else if (finalScore >= 60) stars = 3;
  else if (finalScore >= 40) stars = 2;

  // Generate character narrative feedback
  const charData = CHARACTERS[character];
  let feedback = '';
  let dominantInsight = '';

  if (stars >= 4) {
    if (character === 'chola') {
      feedback = `¡A huevo! Hablaste con verdad y pusiste el dedo en la llaga. ${matches > 0 ? `Metiste los conceptos clave sin rodeos.` : 'Directo al grano, como debe ser.'}`;
    } else if (character === 'fresa') {
      feedback = `Wow, súper estructurado. O sea, cero paja y con argumentos impecables que sí justifican el tiempo de análisis.`;
    } else {
      feedback = `¡Esa es la jugada disidente! Rompiste la inercia mental y metiste tracción real al sombrero.`;
    }
    dominantInsight = `Alta congruencia con el marco del ${TRAINER_HATS[hat].name}. Pensamiento afilado y sin ambigüedades.`;
  } else if (stars === 3) {
    if (character === 'chola') {
      feedback = `Pasa raspando, carnal. Se entiende tu idea pero le faltó ponche y aterrizar más detalles reales.`;
    } else if (character === 'fresa') {
      feedback = `Está aceptable, pero como que le faltó presupuesto conceptual. Dale una segunda pasada con datos más precisos.`;
    } else {
      feedback = `Buena chispa, pero te quedaste a medio camino de dar el golpe maestro. Arriésgate a profundizar más.`;
    }
    dominantInsight = `Respuesta funcional pero superficial. Necesitas incorporar más datos duros o contrastes tangibles.`;
  } else {
    if (character === 'chola') {
      feedback = `No manches, te me quedaste muy tibio. Pareces político en campaña; di las cosas por su nombre o no avanzamos.`;
    } else if (character === 'fresa') {
      feedback = `Fatal. O sea, mega genérico y con cero valor analítico. En cualquier junta seria te descartan con esa respuesta.`;
    } else {
      feedback = `¿Eso es todo? Te dio miedo salir de tu zona de confort. Dale la vuelta y atrévete a cuestionar el marco.`;
    }
    dominantInsight = `Bloqueo o evasión cognitiva. La respuesta no profundiza en la disciplina mental que exige este sombrero.`;
  }

  return {
    score: finalScore,
    stars,
    feedback,
    dominantInsight
  };
}

// Adaptive Engine: Determines the next challenge based on the player's biases
export function adaptNextChallenge(
  profile: PlayerCognitiveProfile, 
  character: CharacterKey
): CognitiveChallenge {
  const hatsList: HatKey[] = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'];

  // Identify lowest and highest hats
  const scores: Record<HatKey, number> = {
    blanco: profile.blanco,
    rojo: profile.rojo,
    negro: profile.negro,
    amarillo: profile.amarillo,
    verde: profile.verde,
    azul: profile.azul
  };

  const sortedHats = [...hatsList].sort((a, b) => scores[a] - scores[b]);
  const weakestHat = sortedHats[0];
  const strongestHat = sortedHats[sortedHats.length - 1];

  let chosenHat: HatKey = weakestHat;
  let mode: 'normal' | 'modo_suave' | 'combinado_verde_negro' | 'modo_caos' | 'inversion' = 'normal';
  let timeLimit = 60;

  // Adaptive Rule 1: Heavy bias toward creative thinking without critical check
  if (profile.verde >= 4 && profile.negro <= 2) {
    chosenHat = 'negro';
    mode = 'combinado_verde_negro';
    timeLimit = 45;
  } 
  // Adaptive Rule 2: High friction / repeated blockages
  else if (profile.bloqueos >= 2 && profile.rondasCompletadas < 4) {
    chosenHat = weakestHat;
    mode = 'modo_suave';
    timeLimit = 90;
  }
  // Adaptive Rule 3: High cognitive momentum / chaos challenge
  else if (profile.rachaActual >= 3 && profile.rondasCompletadas >= 5) {
    mode = 'modo_caos';
    chosenHat = (Math.random() > 0.5) ? weakestHat : 'verde';
    timeLimit = 35;
  } 
  // Adaptive Rule 4: Standard weighted calibration toward the least practiced hat
  else {
    // 60% probability of training the weakest hat, 40% random among others
    if (Math.random() < 0.65) {
      chosenHat = weakestHat;
    } else {
      const candidates = hatsList.filter(h => h !== strongestHat);
      chosenHat = candidates[Math.floor(Math.random() * candidates.length)] || weakestHat;
    }
    mode = 'normal';
    timeLimit = 60;
  }

  // Build the specific challenge prompt depending on hat and mode
  const promptsByHatAndMode: Record<HatKey, Record<string, { title: string; prompt: string; dialogue: string }>> = {
    blanco: {
      normal: {
        title: 'Auditoría Fría de Hechos',
        prompt: 'Aísla 2 hechos verificables (cifras, fechas o documentos) sobre tu proyecto o conflicto actual. Prohibido adjetivos.',
        dialogue: 'Olvida lo que sientes o te imaginas: solo lo que un juez o un contador admitiría como evidencia irrefutable.'
      },
      modo_suave: {
        title: 'Hechos Guiados',
        prompt: '¿Cuánto dinero exacto, cuántos días de atraso o cuántas personas reales están involucradas en este problema?',
        dialogue: 'Respira hondo y responde con 3 números o fechas específicas.'
      },
      modo_caos: {
        title: 'Auditoría Express (Reloj en Contra)',
        prompt: 'Escribe en 35 segundos las 3 métricas que demuestran la salud real de esta situación.',
        dialogue: '¡Tiempo corriendo! Si no hay números medibles, estás viviendo de ilusiones.'
      }
    },
    rojo: {
      normal: {
        title: 'Evisceración Emocional',
        prompt: '¿Qué sientes en el estómago respecto a esta situación? Expresa tu miedo, rabia o sospecha sin filtro diplomático.',
        dialogue: 'No lo justifiques. No digas "porque...". Solo suelta la emoción cruda.'
      },
      modo_suave: {
        title: 'Desbloqueo de Instinto',
        prompt: 'Si no tuvieras que quedar bien con nadie, ¿cuál es la emoción real que te despierta este tema?',
        dialogue: 'Nadie te va a juzgar aquí. Ponle nombre al monstruo.'
      },
      modo_caos: {
        title: 'Confesión de Alta Presión',
        prompt: 'En 35 segundos: ¿Cuál es tu mayor sospecha o paranoia secreta que no te atreves a decir en voz alta?',
        dialogue: '¡Venga! Sin filtros mentales ni censura. La verdad visceral.'
      }
    },
    negro: {
      normal: {
        title: 'Autopsia Premédica del Proyecto',
        prompt: 'Imagina que pasaron 6 meses y todo fracasó estrepitosamente. ¿Qué fue exactamente lo que lo mató?',
        dialogue: 'Sé despiadado. Encuentra la grieta en el muro antes de que el techo se caiga.'
      },
      combinado_verde_negro: {
        title: 'Filtro Ácido: Creatividad vs Muerte Súbita',
        prompt: 'Toma tu mejor idea reciente e identifica el riesgo mortal que nadie en tu equipo quiere admitir.',
        dialogue: 'Ya creaste mucho humo bonito; ahora dime dónde está la fuga de gas que te va a volar en pedazos.'
      },
      modo_suave: {
        title: 'Detección de Fricción',
        prompt: '¿Cuál es el costo o peligro más evidente si continúas posponiendo esta decisión?',
        dialogue: 'Mira el peligro a los ojos. No te asustes, solo descríbelo.'
      },
      modo_caos: {
        title: 'Alerta Roja Inmediata',
        prompt: '35 segundos: Nombra los 2 peores escenarios legales o financieros de este caso.',
        dialogue: 'Rápido, el abogado del diablo está en la mesa. Sin piedad.'
      }
    },
    amarillo: {
      normal: {
        title: 'Monetización & Ventaja Oculta',
        prompt: '¿Cuál es la ganancia, ahorro o aprendizaje de alto valor que puedes extraer si resuelves esto con maestría?',
        dialogue: 'Enfócate en la recompensa real. ¿Por qué vale la pena pagar el costo de este esfuerzo?'
      },
      modo_suave: {
        title: 'Visión de Retorno',
        prompt: 'Si esto sale al 100%, ¿cómo se ve tu operación y tranquilidad en 90 días?',
        dialogue: 'Visualiza el mejor escenario fundamentado en lógica y mérito.'
      },
      modo_caos: {
        title: 'Oportunidad Relámpago',
        prompt: '35 segundos: ¿Dónde está el dinero o la ventaja que nadie más está viendo en este problema?',
        dialogue: '¡Encuentra el oro en el fango antes de que termine el tiempo!'
      }
    },
    verde: {
      normal: {
        title: 'Disrupción Ilegal / Mutación Lateral',
        prompt: 'Propón 2 soluciones tan absurdas o radicales que obliguen a replantear todo el problema.',
        dialogue: 'Si suena razonable, no sirve para el sombrero verde. Rompe la regla predecible.'
      },
      modo_suave: {
        title: 'Giro de Perspectiva',
        prompt: '¿Cómo resolvería este problema un personaje completamente opuesto a ti (ej. un pirata, un hacker o un niño)?',
        dialogue: 'Pide prestados otros ojos. Juega con la idea sin miedo.'
      },
      modo_caos: {
        title: 'Tormenta Eléctrica',
        prompt: '35 segundos: Genera 3 alternativas no convencionales sin detenerte a juzgar si son viables.',
        dialogue: '¡Dispara ideas a quemarropa! La cantidad vence al juicio.'
      }
    },
    azul: {
      normal: {
        title: 'Comando de Prioridades & Próximo Paso',
        prompt: 'Define el ÚNICO paso innegociable que debe ejecutarse en las próximas 24 horas para mover la aguja.',
        dialogue: 'Basta de deliberaciones. Pon la orden en la mesa: quién, qué y a qué hora.'
      },
      modo_suave: {
        title: 'Estructuración Elemental',
        prompt: 'Ordena el problema en 3 fases secuenciales: 1. Diagnóstico, 2. Acción de choque, 3. Blindaje.',
        dialogue: 'Trae calma al caos. Un buen líder pone los rieles para el tren.'
      },
      modo_caos: {
        title: 'Veredicto Ejecutivo',
        prompt: '35 segundos: Redacta la orden de acción definitiva para cerrar este dilema hoy mismo.',
        dialogue: 'Firma el decreto. Sin dudas ni marcha atrás.'
      }
    }
  };

  const hatPrompts = promptsByHatAndMode[chosenHat];
  const selectedConfig = hatPrompts[mode] || hatPrompts['normal'];

  return {
    id: `challenge-${Date.now()}`,
    hat: chosenHat,
    mode,
    title: selectedConfig.title,
    prompt: selectedConfig.prompt,
    characterDialogue: selectedConfig.dialogue,
    timeLimitSeconds: timeLimit,
    keywords: HAT_LEXICONS[chosenHat] || [],
    minimumChars: mode === 'modo_caos' ? 40 : 70
  };
}

// Cognitive Mirror: Generates the psychological diagnostic report
export function generateMirror(profile: PlayerCognitiveProfile): {
  dominantHat: HatKey;
  suppressedHat: HatKey;
  archetype: string;
  radarData: Array<{ hat: HatKey; name: string; score: number; hex: string; percent: number }>;
  psychologicalObservation: string;
  strategicPrescription: string;
} {
  const hatsList: HatKey[] = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'];
  const scores: Record<HatKey, number> = {
    blanco: profile.blanco,
    rojo: profile.rojo,
    negro: profile.negro,
    amarillo: profile.amarillo,
    verde: profile.verde,
    azul: profile.azul
  };

  const sortedHats = [...hatsList].sort((a, b) => scores[b] - scores[a]);
  const dominantHat = sortedHats[0];
  const suppressedHat = sortedHats[sortedHats.length - 1];

  const radarData = hatsList.map(h => {
    const raw = scores[h];
    const maxPoss = Math.max(...Object.values(scores), 10);
    const percent = Math.min(Math.round((raw / maxPoss) * 100), 100);
    return {
      hat: h,
      name: TRAINER_HATS[h].name,
      score: raw,
      hex: TRAINER_HATS[h].bgHex,
      percent: Math.max(percent, 8) // minimum visible bar
    };
  });

  // Archetype & Psychological Matrix
  let archetype = 'Estratega en Calibración';
  let observation = '';
  let prescription = '';

  if (scores.verde > scores.negro * 1.8 && scores.verde >= 6) {
    archetype = 'El Visionario Desordenado';
    observation = 'Tiendes a generar ideas compulsivamente como mecanismo para evitar el doloroso análisis de riesgos y costos reales. Tu creatividad es alta, pero tus proyectos sufren de fugas operativas.';
    prescription = 'Oblígate a someter cada nueva idea a un sombrero negro de 15 minutos antes de compartirla con tu equipo o comprometer presupuesto.';
  } else if (scores.negro > scores.verde * 1.8 && scores.negro >= 6) {
    archetype = 'El Crítico Paralizado';
    observation = 'Tu radar para detectar peligros es impecable, pero sofoca cualquier intento de innovación antes de que germine. Sufres de parálisis por hiper-análisis.';
    prescription = 'Practica el sombrero verde en modo caos: escribe alternativas absurdas sin permitirte criticarlas durante al menos 10 minutos seguidos.';
  } else if (scores.blanco > scores.rojo * 2 && scores.blanco >= 6) {
    archetype = 'El Autómata Lógico';
    observation = 'Tomas decisiones basadas en hojas de cálculo y hechos puros, pero ignoras las emociones y sospechas viscerales del equipo. Esto suele generar crisis de liderazgo inesperadas.';
    prescription = 'Valida tu intuición. Antes de revisar números, escribe en sombrero rojo lo que tu instinto te dice sobre las personas con las que te asocias.';
  } else if (scores.rojo > scores.blanco * 2 && scores.rojo >= 6) {
    archetype = 'El Reactor Emocional';
    observation = 'Tus emociones son tu brújula principal; cuando hay estrés, reaccionas con prisa o angustia antes de validar si los datos respaldan tu alarma.';
    prescription = 'Regla de enfriamiento: cuando el sombrero rojo se encienda, prohíbete tomar decisiones hasta aislar 3 hechos con sombrero blanco.';
  } else if (scores.amarillo >= 5 && scores.negro <= 2) {
    archetype = 'El Optimista Vulnerable';
    observation = 'Ves el potencial y las ganancias en todo, pero subestimas sistemáticamente la fricción operativa y los peores escenarios.';
    prescription = 'Contrata o busca activamente la opinión de alguien con sesgo negro estricto para balancear tus proyecciones financieras.';
  } else if (profile.rondasCompletadas >= 6 && Math.max(...Object.values(scores)) - Math.min(...Object.values(scores)) <= 6) {
    archetype = 'Estratega Hexagonal Equilibrado';
    observation = 'Muestras una notable flexibilidad mental. No te casas con ninguna postura: eres capaz de saltar de la rabia intuitiva al cálculo frío de ROI y al plan de acción en minutos.';
    prescription = 'Tu reto ahora es la velocidad de alternancia y el liderazgo: guiar a otros a no polarizarse durante discusiones directivas.';
  } else {
    archetype = 'Navegante Táctico en Formación';
    observation = `Muestras preferencia por el ${TRAINER_HATS[dominantHat].name} mientras que el ${TRAINER_HATS[suppressedHat].name} permanece como tu punto ciego más evidente.`;
    prescription = `Entrena intencionalmente retos del ${TRAINER_HATS[suppressedHat].name} para que la realidad no te tome por sorpresa en esa dimensión.`;
  }

  return {
    dominantHat,
    suppressedHat,
    archetype,
    radarData,
    psychologicalObservation: observation,
    strategicPrescription: prescription
  };
}

// Compute player mental level based on cognitive metrics
export function computeMentalLevel(profile: PlayerCognitiveProfile): number {
  const completed = profile.rondasCompletadas;
  const nonZeroHats = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul'].filter(
    h => (profile as any)[h] >= 2
  ).length;

  if (completed >= 18 && nonZeroHats >= 6 && profile.mejorRacha >= 5) return 5;
  if (completed >= 10 && nonZeroHats >= 5) return 4;
  if (completed >= 6 && nonZeroHats >= 4) return 3;
  if (completed >= 3 && nonZeroHats >= 2) return 2;
  return 1;
}
