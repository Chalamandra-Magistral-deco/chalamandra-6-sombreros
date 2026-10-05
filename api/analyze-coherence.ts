import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIClient, GEMINI_MODEL } from './_lib/gemini';
import { sanitizeString, isKeyMissing, keyMissingMessage } from './_lib/sanitize';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { azotea, blanco, rojo, negro, amarillo, verde, azul } = req.body || {};

  if (!azotea || typeof azotea !== 'string' || azotea.trim().length === 0)
    return res.status(400).json({ error: "El campo 'azotea' (conflicto) es requerido para realizar la auditoría." });

  const safeAzotea = sanitizeString(azotea);
  const safeBlanco = sanitizeString(blanco);
  const safeRojo = sanitizeString(rojo);
  const safeNegro = sanitizeString(negro);
  const safeAmarillo = sanitizeString(amarillo);
  const safeVerde = sanitizeString(verde);
  const safeAzul = sanitizeString(azul);

  try {
    const ai = getAIClient();
    const prompt = `Eres el evaluador táctico principal del sistema de Los 6 Sombreros de Edward de Bono y la metodología de Chalamandra Magistral decoX.
Tu misión es realizar una auditoría de coherencia comparativa entre todos los sombreros definidos por el usuario para su conflicto ("Azotea").

DATOS INGRESADOS POR EL USUARIO:
- Azotea (Conflicto inicial): "${safeAzotea}"
- Sombrero Blanco (Hechos y datos objetivos): "${safeBlanco || 'No detallado'}"
- Sombrero Rojo (Emociones viscerales e intuición): "${safeRojo || 'No detallado'}"
- Sombrero Negro (Riesgos y cautela crítica): "${safeNegro || 'No detallado'}"
- Sombrero Amarillo (Beneficios y oportunidades): "${safeAmarillo || 'No detallado'}"
- Sombrero Verde (Creatividad lateral y salidas alternas): "${safeVerde || 'No detallado'}"
- Sombrero Azul (Comando de salida y acción concreta): "${safeAzul || 'No detallado'}"

INSTRUCCIONES DE AUDITORÍA COMPARATIVA:
Analiza los cruces críticos:
1. Contraste Hechos (Blanco) vs Emociones (Rojo): ¿El pánico o el coraje están respaldados por hechos reales verificables, o son suposiciones no demostradas?
2. Balance Riesgo (Negro) vs Oportunidad (Amarillo): ¿El pesimismo o la cautela superan desproporcionadamente las oportunidades, o hay un optimismo ingenuo?
3. Tracción Creativa (Verde) vs Ejecución (Azul): ¿El comando azul incorpora la frescura del pensamiento verde, o volvió a caer en una solución convencional y desgastada?
4. Detección de Incoherencias o Puntos Ciegos: Señala contradicciones flagrantes entre lo que el usuario dice que pasa y lo que pretende ejecutar.

Responde estrictamente en formato JSON válido con este esquema:
{
  "overallCoherence": "Alta" | "Media" | "Baja",
  "coherenceScore": número del 0 al 100,
  "summary": "Resumen ejecutivo de 2 oraciones con el estado general de alineación.",
  "comparisons": {
    "blancoVsRojo": "Análisis comparativo directo entre datos y emociones.",
    "negroVsAmarillo": "Análisis comparativo del equilibrio entre riesgos y beneficios.",
    "verdeVsAzul": "Análisis comparativo de si la creatividad se tradujo en el plan de acción azul."
  },
  "blindspots": ["Punto ciego 1", "Punto ciego 2"],
  "verdict": "Veredicto táctico final al estilo Chalamandra Magistral decoX."
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const responseText = response.text || "{}";
    let analysisData;
    try { analysisData = JSON.parse(responseText); }
    catch { analysisData = {
      overallCoherence: "Media", coherenceScore: 70, summary: responseText.slice(0, 300),
      comparisons: {
        blancoVsRojo: "Revisa la correlación entre tus hechos y tus impulsos emocionales.",
        negroVsAmarillo: "Asegúrate de que los temores no sobrepasen las ganancias reales.",
        verdeVsAzul: "Asegúrate de que la creatividad alimente tu comando de acción."
      },
      blindspots: ["Verifica si omitiste contrastar tus certezas con evidencia."],
      verdict: "Ajusta la ejecución de tu sombrero azul para romper la inercia mental."
    }; }

    res.json({ coherenceAnalysis: analysisData });
  } catch (error) {
    console.error("Error analyzing coherence:", error);
    res.status(500).json({
      error: isKeyMissing() ? keyMissingMessage("el análisis comparativo") : "No se pudo completar el análisis."
    });
  }
}
