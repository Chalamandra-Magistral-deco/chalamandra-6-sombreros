import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  saveHatsRitual, 
  getSavedHatsRituals, 
  deleteHatsRitual,
  saveLadderRitual,
  getSavedLadderRituals,
  deleteLadderRitual,
  subscribeHatsRituals
} from '../src/lib/storageService.ts';

// Mock localStorage in Node environment
const store = new Map<string, string>();
(global as any).localStorage = {
  getItem: (key: string) => store.get(key) || null,
  setItem: (key: string, val: string) => store.set(key, val),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear()
};

describe('Storage Service (Local Storage Autonomous Persistence)', () => {
  beforeEach(() => {
    store.clear();
  });

  it('should save and retrieve a 6 Thinking Hats ritual', async () => {
    const hatsData = {
      azotea: 'Conflicto de prueba de liderazgo',
      blanco: 'Datos objetivos comprobados',
      rojo: 'Intuición visceral de alerta',
      negro: 'Riesgo de fuga presupuestaria',
      amarillo: 'Oportunidad de renegociar',
      verde: 'Proponer contrato alternativo',
      azul: 'Firmar acuerdo mañana a las 10:00'
    };

    const id = await saveHatsRitual(hatsData, 'Ritual de Prueba 1');
    assert.ok(id.startsWith('hats-'));

    const rituals = getSavedHatsRituals();
    assert.strictEqual(rituals.length, 1);
    assert.strictEqual(rituals[0].id, id);
    assert.strictEqual(rituals[0].title, 'Ritual de Prueba 1');
    assert.strictEqual(rituals[0].azotea, hatsData.azotea);
    assert.strictEqual(rituals[0].azul, hatsData.azul);
  });

  it('should notify subscribers when a ritual is added or removed', async () => {
    let updateCount = 0;
    let latestRitualsCount = 0;

    const unsubscribe = subscribeHatsRituals((rituals) => {
      updateCount++;
      latestRitualsCount = rituals.length;
    });

    const id = await saveHatsRitual({
      azotea: 'Dilema de equipo',
      blanco: '10 personas',
      rojo: 'tensión',
      negro: 'retraso',
      amarillo: 'aprendizaje',
      verde: 'rotación',
      azul: 'reunión'
    });

    assert.strictEqual(latestRitualsCount, 1);

    await deleteHatsRitual(id);
    assert.strictEqual(latestRitualsCount, 0);

    unsubscribe();
  });

  it('should save and delete a Strategic Ladder ritual', async () => {
    const ladderData = {
      instinto: 'Alarma interna',
      emocion: 'Miedo al fracaso',
      jugada: 'Juego de estatus ajeno',
      posicion: 'Mantener neutralidad activa',
      ejecucion: 'Entregar reporte objetivo',
      bitacora: 'Día 1 sin altercados',
      inmunidad: 'Mi valor depende de mis resultados'
    };

    const id = await saveLadderRitual(ladderData, 'Mapa Táctico Alfa');
    assert.ok(id.startsWith('ladder-'));

    let saved = getSavedLadderRituals();
    assert.strictEqual(saved.length, 1);
    assert.strictEqual(saved[0].title, 'Mapa Táctico Alfa');

    await deleteLadderRitual(id);
    saved = getSavedLadderRituals();
    assert.strictEqual(saved.length, 0);
  });
});
