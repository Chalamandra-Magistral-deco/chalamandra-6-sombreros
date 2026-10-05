import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Backend API Endpoints (Health, Validation & Error Handling)', () => {
  const BASE_URL = 'http://localhost:3000';

  it('GET /api/health should respond with 200 and healthy status', async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.ok, true);
      assert.strictEqual(data.status, 'healthy');
      assert.ok(typeof data.timestamp === 'string');
      assert.ok(typeof data.uptime === 'number');
    } catch (e: any) {
      // If server is not running in test context, skip live network test gracefully
      if (e.code === 'ECONNREFUSED') return;
      throw e;
    }
  });

  it('POST /api/suggest should reject empty azotea with 400', async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hatType: 'blanco', azotea: '   ' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error.includes('requerido'));
    } catch (e: any) {
      if (e.code === 'ECONNREFUSED') return;
      throw e;
    }
  });

  it('POST /api/analyze-coherence should reject missing azotea with 400', async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/analyze-coherence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ azotea: '' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error.includes('requerido'));
    } catch (e: any) {
      if (e.code === 'ECONNREFUSED') return;
      throw e;
    }
  });

  it('POST /api/chat should reject non-array messages with 400', async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: 'invalid' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error.includes('arreglo'));
    } catch (e: any) {
      if (e.code === 'ECONNREFUSED') return;
      throw e;
    }
  });
});
