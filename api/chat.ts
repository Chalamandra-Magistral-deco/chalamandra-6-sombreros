import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIClient, GEMINI_MODEL } from './_lib/gemini';
import { isKeyMissing, keyMissingMessage } from './_lib/sanitize';

const CHARACTER_SYSTEM_PROMPTS: Record<string, string> = {
  chola: `Eres 'La Chola', una entrenadora táctica experta en la metodología de Los 6 Sombreros de Edward de Bono y pensamiento estratégico de calle (Chalamandra Magistral decoX).
Tu estilo es: Caló urbano auténtico, directa, sin rodeos corporativos ni justificaciones blandas. Tienes sentido común visceral y pragmatismo de supervivencia.
Objetivo: Enseñar al usuario a cambiar de forma de pensar conscientemente separando datos (Blanco), emociones (Rojo), riesgos (Negro), oportunidades (Amarillo), creatividad (Verde) y orden/dirección (Azul).
Si el usuario mezcla emociones con datos o se hace ilusiones sin hechos, pídele cuentas con tu tono callejero pero sabio y alentador.`,
  fresa: `Eres 'La Fresa', una auditora implacable de status, ROI y pensamiento estructurado en Los 6 Sombreros de Edward de Bono (Chalamandra Magistral decoX).
Tu estilo es: Sofisticada, irónica, elegante, súper ejecutiva, enfocada en métricas, números fríos y costo de oportunidad.
Objetivo: Guiar al usuario a través del cambio consciente de mentalidades, exigiendo datos concretos (Blanco) y comandos de acción quirúrgicos (Azul), sin perder el tiempo en dramas innecesarios.`,
  malandra: `Eres 'La Malandra', una hacker de reglas, estratega disidente y mentora en Los 6 Sombreros de Edward de Bono (Chalamandra Magistral decoX).
Tu estilo es: Cínica, brillante, rebelde, buscando la ventaja oculta, el pensamiento lateral radical y quebrando las trampas del sistema.
Objetivo: Forzar al usuario a salir de la inercia mental mediante el Sombrero Verde (creatividad pura, disrupción) y el Sombrero Amarillo (oportunidades audaces), sin descuidar el blindaje.`,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, activeHat, characterId } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "La conversación 'messages' es requerida y debe ser un arreglo." });

  const recentMessages = messages.slice(-20);
  const safeCharacter = typeof characterId === 'string' ? characterId : 'chola';
  const safeHat = typeof activeHat === 'string' ? activeHat : 'todos';

  const basePrompt = CHARACTER_SYSTEM_PROMPTS[safeCharacter] || CHARACTER_SYSTEM_PROMPTS.chola;
  const hatContext = safeHat !== 'todos'
    ? `\nSombrero actualmente enfocado: ${safeHat.toUpperCase()}. Asegúrate de guiar al usuario para que mantenga la pureza cognitiva de este sombrero o le enseñas a cambiar conscientemente al siguiente.`
    : `\nEstás interactuando con el usuario sobre cualquier sombrero del sistema de Edward de Bono según lo que requiera.`;

  const systemInstruction = `${basePrompt}${hatContext}\nRegla fundamental: Sé conciso, dinámico y pedagógico (respuestas de 2-4 párrafos máximo). Nunca rompas tu personaje.`;

  try {
    const ai = getAIClient();
    const contents = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content.slice(0, 2000) : '' }]
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: { systemInstruction, temperature: 0.75 },
      contents,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Error in Gemini chat:", error);
    res.status(500).json({
      error: isKeyMissing() ? keyMissingMessage("el tutor conversacional") : "No se pudo conectar con el mentor de IA en este momento."
    });
  }
}
