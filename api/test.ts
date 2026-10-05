import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ ok: true, time: Date.now(), env: !!process.env.GEMINI_API_KEY });
}
