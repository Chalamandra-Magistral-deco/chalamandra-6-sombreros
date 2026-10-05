# 🎩 Los 6 Sombreros de De Bono – Ritual de Toma de Decisiones & Entrenador Cognitivo
### Metodología de Edward de Bono & Escalera Estratégica por Chalamandra Magistral decoX

Aplicación web táctica de alto rendimiento diseñada para desbloquear la "Azotea Mental", calibrar sesgos cognitivos y tomar decisiones estratégicas irrefutables mediante el método de los **Seis Sombreros para Pensar de Edward de Bono**, la **Escalera Estratégica de 7 Pasos** y un **Entrenador Cognitivo Adaptativo** impulsado por **Google Gemini 3.8 Flash** (`@google/genai`).

---

## 🌟 Características Principales

### 1. 🎩 Ritual de los 6 Sombreros (7 Pasos)
Guía estructurada paso a paso para desmantelar cualquier conflicto o dilema:
- **Paso 1: La Azotea** – Planteamiento crudo del conflicto que consume tu energía mental.
- **⚪ Sombrero Blanco (Hechos & Datos)** – Cifras frías, evidencia demostrable y métricas sin juicio.
- **🔴 Sombrero Rojo (Emoción & Olfato)** – Intuición visceral, sospechas y corazonadas sin filtro ni justificación.
- **⚫ Sombrero Negro (Riesgos & Cautela)** – Detección de fallos críticos, costos ocultos y peores escenarios.
- **🟡 Sombrero Amarillo (Oportunidad & Ganancia)** – Beneficios tangibles, aprendizaje y optimismo constructivo.
- **🟢 Sombrero Verde (Creatividad Lateral)** – Salidas disidentes, ideas disruptivas y giros fuera de la caja.
- **🔵 Sombrero Azul (Comando de Acción)** – Directiva ejecutiva con responsable, fecha, hora y paso irreversible.

### 2. ⚡ Escalera Estratégica (7 Niveles)
Calibración táctica de juicio y soberanía:
- **Nivel 1: Instinto** – Tu primera alarma no filtrada.
- **Nivel 2: Emoción / Trampa** – El sesgo o miedo que intenta secuestrar tu criterio.
- **Nivel 3: Clasificación** – Clasificar el tipo de jugada (estatus, poder, supervivencia o negocio).
- **Nivel 4: Posición Táctica** – Definición del terreno y anclaje estratégico.
- **Nivel 5: Ejecución Quirúrgica** – Acción directa de choque.
- **Nivel 6: Bitácora de Campo** – Registro y métricas de fricción.
- **Nivel 7: Blindaje / Inmunidad** – Cierre hermético contra recaídas.

### 3. 🧠 Entrenador Cognitivo Adaptativo & Ruleta
- **Ruleta Cognitiva Procedural**: Selección aleatoria o enfocada de retos con motor de física angular y sonido sintetizado.
- **3 Modos Dinámicos de Entrenamiento**:
  - *Modo Normal* (60s): Calibración equilibrada.
  - *Modo Suave* (90s): Diseñado para momentos de bloqueo cognitivo.
  - *Modo Caos* (35s): Ráfagas de alta presión para romper la inercia mental.
- **Motor de Evaluación Semántica**: Puntuación (0-100), estrellas y retroalimentación contextual con base en densidad léxica y profundidad analítica.
- **5 Niveles de Maestría Mental**: Desde *Navegante Táctico* hasta *Estratega Hexagonal*.

### 4. 🪞 Espejo Mental & Arquetipos Diagnósticos
Diagnóstico psicológico basado en tus puntuaciones y sesgos dominantes:
- Gráfico de radar cromático interactivo.
- Detección de arquetipos (*El Visionario Desordenado*, *El Crítico Paralizado*, *El Autómata Lógico*, *El Reactor Emocional*, etc.).
- Observación psicológica y prescripción estratégica descargable.

### 5. 🤖 Tutor Táctico Multi-Turn (Gemini 3.8 Flash)
Chatbot pedagógico disponible como panel lateral o modal flotante, con 3 personalidades estratégicas:
- **La Chola (Chalamandra)**: Sentido común de supervivencia, caló urbano, directa y sin rodeos.
- **La Fresa**: Auditora ejecutiva implacable, orientada a status, números fríos y ROI.
- **La Malandra**: Hacker de reglas y mentora del pensamiento lateral y disidente.

### 6. 🔍 Escáner de Coherencia IA
Auditoría comparativa cruzada entre los 6 sombreros ingresados:
- Contraste Hechos vs Emociones (*Blanco vs Rojo*).
- Balance Riesgo vs Beneficio (*Negro vs Amarillo*).
- Tracción Creativa vs Ejecución (*Verde vs Azul*).
- Detección de puntos ciegos y directiva táctica final en JSON estructurado.

### 7. 💾 Persistencia Local Autónoma & Privacidad
- Almacenamiento 100% privado en tu navegador (`localStorage`) a través de un servicio reactivo (`storageService.ts`).
- Guarda, recupera, filtra y elimina rituales sin requerir cuentas de terceros, Firebase ni telemetría externa.
- Soporte para exportación en texto plano e impresión.

### 8. 🔊 Web Audio API Synthesizer
- Motor de sonido nativo procedural en tiempo real (`audio.ts`).
- Genera ticks de ruleta, chimes armónicos de pasos y fanfarrias sin descargar un solo archivo de audio externo.
- Conmutable (on/off) desde la barra de estado.

---

## 📁 Estructura del Proyecto

```text
├── api/                        # Funciones Serverless para despliegue en Vercel
│   ├── _lib/
│   │   ├── gemini.ts           # Cliente SDK @google/genai estandarizado
│   │   └── sanitize.ts         # Sanitización y validación de strings
│   ├── analyze-coherence.ts    # POST /api/analyze-coherence (Auditoría IA)
│   ├── chat.ts                 # POST /api/chat (Tutor conversacional)
│   ├── suggest.ts              # POST /api/suggest (Sugerencias tácticas)
│   └── test.ts                 # GET /api/test (Diagnóstico serverless)
├── docs/                       # Documentación técnica y especificaciones
│   ├── security_spec.md        # Política de seguridad y defensa de inyecciones
│   └── walkthrough.md          # Bitácora de arquitectura
├── public/                     # Assets estáticos servidos en raíz
│   └── og-image.jpg            # Tarjeta OpenGraph para redes sociales
├── src/
│   ├── assets/images/          # Ilustraciones y avatares de sombreros
│   ├── components/             # Componentes React modulares
│   │   ├── AICoherenceScanner.tsx     # Escáner de coherencia IA
│   │   ├── CognitiveRouletteWheel.tsx # Ruleta procedural interactiva
│   │   ├── CognitiveTrainerTab.tsx    # Pestaña del entrenador cognitivo
│   │   ├── GeminiHatChatbot.tsx       # Chatbot con selector de personajes
│   │   ├── HatsEvolutionChart.tsx     # Gráficos evolutivos con Recharts
│   │   └── MentalMirrorModal.tsx      # Modal de diagnóstico y espejo mental
│   ├── data/
│   │   ├── constants.ts        # Pasos, temas cromáticos y metadatos
│   │   └── trainerData.ts      # Desafíos, léxicos y personalidades
│   ├── lib/
│   │   ├── audio.ts            # Sintetizador Web Audio API nativo
│   │   ├── cognitiveEngine.ts  # Algoritmos de evaluación y diagnóstico
│   │   └── storageService.ts   # Persistencia local reactiva
│   ├── App.tsx                 # Aplicación principal y gestión de pestañas
│   ├── index.css               # Estilos globales y Tailwind CSS v4
│   └── main.tsx                # Punto de entrada React 19
├── tests/                      # Suite de pruebas automatizadas
│   ├── api.test.ts             # Pruebas de endpoints, salud y validación
│   ├── cognitive.test.ts       # Pruebas de algoritmos cognitivos y arquetipos
│   └── storage.test.ts         # Pruebas de persistencia y reactividad
├── index.html                  # HTML5 con SEO enriquecido y Schema.org JSON-LD
├── metadata.json               # Configuración de capacidades de AI Studio
├── package.json                # Dependencias, tipos y scripts de npm
├── server.ts                   # Servidor Express Full-Stack con Vite integrado
├── tsconfig.json               # Configuración estricta de TypeScript
├── vercel.json                 # Configuración de despliegue en Vercel
└── vite.config.ts              # Configuración del empaquetador Vite v6
```

---

## ⚙️ Variables de Entorno

Copia el archivo `.env.example` a `.env` si corres en un entorno local tradicional:

```bash
cp .env.example .env
```

| Variable | Descripción | ¿Requerida? |
| :--- | :--- | :---: |
| `GEMINI_API_KEY` | Clave de API de Google Gemini (Studio o Cloud Console) | Sí (para funciones IA) |
| `PORT` | Puerto HTTP del servidor (por defecto `3000`) | Opcional |

> **Nota:** La aplicación es 100% utilizable sin `GEMINI_API_KEY` para el ritual de los 6 sombreros, la escalera estratégica, el guardado local, el audio y el entrenador cognitivo con respuestas locales. Las funciones de sugerencia, escáner de coherencia y chat te alertarán si la clave no está presente.

---

## 🛠️ Instalación y Uso

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Modo Desarrollo

Inicia el servidor Node/Express con Vite montado en caliente:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### 3. Ejecución de Pruebas Automatizadas

Ejecuta los 12 tests automatizados (almacenamiento, motor cognitivo y API):

```bash
npm test
```

Para verificar tipos con TypeScript sin emitir código:

```bash
npm run typecheck
# o
npm run lint
```

### 4. Compilación para Producción

Genera los bundles optimizados para el cliente (`dist/`) y el servidor (`dist/server.cjs`):

```bash
npm run build
```

---

## 🚀 Despliegue en Producción

El proyecto está diseñado con arquitectura **Dual-Deploy**:

### Opción A: Servidor Node / Docker / Cloud Run / VPS
Ideal para correr el servidor Express unificado:

```bash
npm run build
npm start
```
*(Inicia el servidor compilado en `dist/server.cjs` sirviendo la API y los assets estáticos).*

### Opción B: Despliegue Serverless en Vercel
El repositorio incluye `vercel.json` y los endpoints en `api/`:
1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
2. En **Settings → Environment Variables**, añade `GEMINI_API_KEY`.
3. Vercel compilará automáticamente el frontend con `npm run build` y servirá las funciones serverless de `api/`.

---

## 🧪 Diagnóstico y Monitoreo

El servidor incluye un endpoint de salud para balanceadores de carga y health checks:

- `GET /api/health` o `GET /api/test`:
  ```json
  {
    "ok": true,
    "status": "healthy",
    "timestamp": "2026-10-05T19:17:32.313Z",
    "uptime": 45,
    "geminiConfigured": true
  }
  ```

---

## 🛡️ Seguridad y Resiliencia
- **Protección contra Inyección de Prompts**: Delimitadores triples (`"""`), sanitización de caracteres de escape y validación de longitud máxima (1500 caracteres).
- **Limitador de Tasa en Memoria**: Protección de cuotas de API de Gemini por IP (máximo 30 peticiones por ventana de 10 minutos).
- **Manejo Seguro de Errores**: Captura de JSON malformados, sin fugas de stack trace en producción.
- **Aislamiento de Claves**: La clave `GEMINI_API_KEY` permanece en el entorno del servidor/serverless y jamás se expone al cliente web.

---

## 📜 Licencia & Créditos

- Basado en la metodología de los **Seis Sombreros para Pensar** concebida por **Dr. Edward de Bono**.
- Desarrollado por **Chalamandra Magistral decoX** ([chalamandramagistral.com](https://chalamandramagistral.com)).
- Modelos de IA: **Google Gemini 3.8 Flash** a través del SDK `@google/genai`.
