export function sanitizeString(text: unknown, maxLen = 1500): string {
  return typeof text === 'string'
    ? text.slice(0, maxLen).replace(/["`\\]/g, ' ').trim()
    : '';
}

export function isKeyMissing(): boolean {
  return !process.env.GEMINI_API_KEY;
}

export function keyMissingMessage(context: string): string {
  return `GEMINI_API_KEY no configurada. Agrega tu clave en Vercel → Settings → Environment Variables para usar ${context}.`;
}
