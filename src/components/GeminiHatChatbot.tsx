import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RotateCcw, 
  AlertTriangle,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { CHARACTERS, CharacterKey, TRAINER_HATS, HatKey } from '../data/trainerData';
import { sound } from '../lib/audio';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface GeminiHatChatbotProps {
  initialCharacter?: CharacterKey;
  initialHat?: HatKey | 'todos';
  onClose?: () => void;
  isFloating?: boolean;
}

export const GeminiHatChatbot: React.FC<GeminiHatChatbotProps> = ({
  initialCharacter = 'chola',
  initialHat = 'todos',
  onClose,
  isFloating = false
}) => {
  const [character, setCharacter] = useState<CharacterKey>(initialCharacter);
  const [activeHat, setActiveHat] = useState<HatKey | 'todos'>(initialHat);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`decox_gemini_chat_${initialCharacter}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback default
      }
    }
    const char = CHARACTERS[initialCharacter] || CHARACTERS.chola;
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `${char.introLines[0]}\n\nAquí entrenamos a **cambiar de perspectiva conscientemente**: datos fríos (Blanco), intuición (Rojo), riesgos (Negro), oportunidades (Amarillo), creatividad lateral (Verde) y comando de orden (Azul). ¿Qué conflicto o decisión tienes en la azotea?`,
        timestamp: Date.now()
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem(`decox_gemini_chat_${character}`, JSON.stringify(messages));
  }, [messages, character]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setErrorMessage(null);

    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    sound.playClick();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          activeHat,
          characterId: character
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con Gemini');
      }

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Sin respuesta',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
      sound.playPreset();
    } catch (err: any) {
      console.error('Chatbot error:', err);
      setErrorMessage(err.message || 'Error de conexión');
      sound.playClick();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    sound.playClick();
    const char = CHARACTERS[character] || CHARACTERS.chola;
    const fresh: ChatMessage[] = [
      {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `${char.introLines[1] || char.introLines[0]}\n\nListo, pizarrón en blanco. Dime qué sombrero o dilema quieres poner a prueba ahora.`,
        timestamp: Date.now()
      }
    ];
    setMessages(fresh);
    localStorage.removeItem(`decox_gemini_chat_${character}`);
  };

  const handleSwitchCharacter = (newChar: CharacterKey) => {
    setCharacter(newChar);
    sound.playPreset();
    const char = CHARACTERS[newChar];
    const newWelcome: ChatMessage = {
      id: `char_change_${Date.now()}`,
      role: 'assistant',
      content: `*Ha tomado la palabra ${char.name} (${char.alias})*.\n\n"${char.introLines[0]}"\n\n¿En qué perspectiva o reto trabajamos?`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newWelcome]);
  };

  const selectedCharData = CHARACTERS[character];

  return (
    <div className={`flex flex-col bg-[#0b101c] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
      isFloating ? 'fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[480px] max-h-[85vh] h-[640px]' : 'w-full h-[680px]'
    }`}>
      {/* Header bar */}
      <div className={`p-4 bg-gradient-to-r ${selectedCharData.avatarBg} flex items-center justify-between text-white shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-950/40 border border-white/20 overflow-hidden flex items-center justify-center font-black text-lg shadow-inner shrink-0">
            {character === 'chola' ? (
              <img 
                src="/src/assets/images/chalamandra_avatar_1790335163182.jpg" 
                alt="Chalamandra" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Bot className="w-5 h-5 text-amber-300" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-wide">
                {selectedCharData.name}
              </span>
              <span className="text-[10px] bg-slate-950/50 px-2 py-0.5 rounded-full font-mono text-amber-300 border border-amber-400/30">
                Gemini 3.5 Flash
              </span>
            </div>
            <p className="text-[11px] text-white/80 line-clamp-1">
              {selectedCharData.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Reiniciar conversación"
            aria-label="Reiniciar conversación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {isFloating && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-950/30 hover:bg-rose-600/80 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Cerrar chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Persona and Hat Focus Selector Bar */}
          <div className="bg-[#080d17] p-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
            {/* Persona picker */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">
                Tutor:
              </span>
              {(['chola', 'fresa', 'malandra'] as CharacterKey[]).map(cKey => (
                <button
                  key={cKey}
                  onClick={() => handleSwitchCharacter(cKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    character === cKey
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                  }`}
                >
                  {CHARACTERS[cKey].name}
                </button>
              ))}
            </div>

            {/* Hat context focus */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">
                Lente:
              </span>
              <select
                value={activeHat}
                onChange={(e) => setActiveHat(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-300 outline-none focus:border-amber-500"
              >
                <option value="todos">🌐 Los 6 Sombreros (Todos)</option>
                <option value="blanco">⚪ Blanco (Hechos & Datos)</option>
                <option value="rojo">🔴 Rojo (Emoción e Intuición)</option>
                <option value="negro">⚫ Negro (Riesgos & Cautela)</option>
                <option value="amarillo">🟡 Amarillo (Oportunidad)</option>
                <option value="verde">🟢 Verde (Creatividad Lateral)</option>
                <option value="azul">🔵 Azul (Comando & Control)</option>
              </select>
            </div>
          </div>

          {/* Quick prompt suggestions chips */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">Atajos:</span>
            {[
              { label: '¿Cómo separo emoción de datos?', hat: 'blanco' },
              { label: 'Dame una idea lateral verde', hat: 'verde' },
              { label: '¿Qué riesgo ciego estoy omitiendo?', hat: 'negro' },
              { label: 'Redáctame un comando azul', hat: 'azul' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(chip.label);
                  if (chip.hat) setActiveHat(chip.hat as HatKey);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-amber-300 shrink-0 transition-all cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Scrollable Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-tr-none'
                        : 'bg-[#131c31] border border-slate-800 text-slate-100 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {m.content}
                    <div className={`text-[9px] mt-1.5 font-mono ${isUser ? 'text-slate-900/70' : 'text-slate-500'} text-right`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs shrink-0 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-[#131c31] border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>{selectedCharData.name} está decodificando el sombrero...</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#080d17] border-t border-slate-800/80 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Pregunta a ${selectedCharData.name} sobre los sombreros o tu caso...`}
              disabled={isLoading}
              className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-amber-500/80 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
