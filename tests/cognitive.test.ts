import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  evaluateResponse, 
  computeMentalLevel, 
  adaptNextChallenge, 
  generateMirror 
} from '../src/lib/cognitiveEngine.ts';
import { INITIAL_PLAYER_PROFILE, PlayerCognitiveProfile } from '../src/data/trainerData.ts';

describe('Cognitive Engine (Algorithms & Psychological Logic)', () => {
  it('should score high for detailed responses with semantic keywords', () => {
    const text = 'Tenemos una evidencia con cifras y datos medibles del 15 por ciento en el reporte auditado del contrato.';
    const result = evaluateResponse(text, 25, 'blanco', 'chola');

    assert.ok(result.score >= 70, `Expected score >= 70, got ${result.score}`);
    assert.ok(result.stars >= 3, `Expected stars >= 3, got ${result.stars}`);
    assert.ok(result.feedback.length > 0);
    assert.ok(result.dominantInsight.includes('Blanco'));
  });

  it('should penalize overly short and empty responses', () => {
    const text = 'si ok';
    const result = evaluateResponse(text, 2, 'negro', 'fresa');

    assert.ok(result.score <= 45, `Expected score <= 45, got ${result.score}`);
    assert.ok(result.stars <= 2, `Expected stars <= 2, got ${result.stars}`);
  });

  it('should compute mental level progression accurately', () => {
    const base: PlayerCognitiveProfile = { ...INITIAL_PLAYER_PROFILE };
    assert.strictEqual(computeMentalLevel(base), 1);

    const level2Profile: PlayerCognitiveProfile = {
      ...base,
      rondasCompletadas: 3,
      blanco: 2,
      rojo: 2
    };
    assert.strictEqual(computeMentalLevel(level2Profile), 2);

    const level3Profile: PlayerCognitiveProfile = {
      ...base,
      rondasCompletadas: 6,
      blanco: 3,
      rojo: 3,
      negro: 3,
      amarillo: 3
    };
    assert.strictEqual(computeMentalLevel(level3Profile), 3);
  });

  it('should generate accurate psychological mirror archetypes', () => {
    // Test visionary disordered archetype (high green, lowest black)
    const visionaryProfile: PlayerCognitiveProfile = {
      ...INITIAL_PLAYER_PROFILE,
      blanco: 3,
      rojo: 3,
      negro: 0,
      amarillo: 3,
      verde: 12,
      azul: 3,
      rondasCompletadas: 10
    };
    const mirror = generateMirror(visionaryProfile);
    assert.strictEqual(mirror.archetype, 'El Visionario Desordenado');
    assert.strictEqual(mirror.dominantHat, 'verde');
    assert.strictEqual(mirror.suppressedHat, 'negro');
    assert.ok(mirror.psychologicalObservation.length > 0);
    assert.ok(mirror.strategicPrescription.length > 0);
  });

  it('should adapt next challenge dynamically based on cognitive profile rules', () => {
    // Normal mode on fresh profile
    const challengeNormal = adaptNextChallenge(INITIAL_PLAYER_PROFILE, 'chola');
    assert.ok(challengeNormal.title);
    assert.ok(challengeNormal.prompt);
    assert.strictEqual(challengeNormal.mode, 'normal');
    assert.strictEqual(challengeNormal.timeLimitSeconds, 60);

    // High blockages triggers modo_suave with 90s to ease friction
    const blockedProfile: PlayerCognitiveProfile = {
      ...INITIAL_PLAYER_PROFILE,
      bloqueos: 2,
      rondasCompletadas: 2
    };
    const challengeSuave = adaptNextChallenge(blockedProfile, 'chola');
    assert.strictEqual(challengeSuave.mode, 'modo_suave');
    assert.strictEqual(challengeSuave.timeLimitSeconds, 90);

    // High streak and experience triggers modo_caos with 35s speed round
    const streakProfile: PlayerCognitiveProfile = {
      ...INITIAL_PLAYER_PROFILE,
      rachaActual: 3,
      rondasCompletadas: 6
    };
    const challengeCaos = adaptNextChallenge(streakProfile, 'malandra');
    assert.strictEqual(challengeCaos.mode, 'modo_caos');
    assert.strictEqual(challengeCaos.timeLimitSeconds, 35);
    assert.strictEqual(challengeCaos.minimumChars, 40);
  });
});
