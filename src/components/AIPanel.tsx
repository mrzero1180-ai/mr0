import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  HelpCircle, 
  ShieldAlert, 
  Loader2,
  Lock,
  MessageSquare,
  Network
} from "lucide-react";
import { AIMessage } from "../types";

export function AIPanel() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Quick preset templates to guide the user in simulated threats
  const presets = [
    {
      label: "Log Telefonata Sospetta",
      prompt: `Analizza questo log fittizio di moduli telefonia per cercare potenziali vettori di attacco di callback simultanei voce/dati:

TIME: 10:22:11 | CALLER: +393439009x | STATE: INCOMING
TIME: 10:22:13 | STATE: ANSWERED
TIME: 10:22:14 | DATA_CHANNEL: CELLULAR_LTE_ACTIVE | SYNC_SIGNAL_SENT
TIME: 10:22:15 | CALLBACK: GET https://remote-telecom-verify.ru/token?phone=393439009x
TIME: 10:22:16 | IVR_TRIGGER: REQUEST_OTP_VOICE
TIME: 10:22:18 | TRANSACTION: WALLET_DEBIT_CONFIRMED | VALUE: €250.00`
    },
    {
      label: "Zero-Trust & Permessi",
      prompt: "Quali sono i vantaggi concreti dell'adozione di un modello di permessi zero-trust nello stack di telefonia cellulare, specialmente per prevenire attacchi legati al possesso del numero di telefono?"
    },
    {
      label: "Bypass OTP tramite IVR",
      prompt: "Come fanno gli attaccanti a sfruttare le chiamate automatiche (IVR) per bypassare l'autenticazione a due fattori (OTP) bancaria dei clienti e in che modo possiamo mitigarla?"
    },
    {
      label: "Analisi della Mitigazione",
      prompt: "Perché disattivare i dati mobili o il Wi-Fi prima di rispondere a un numero sconosciuto riduce drasticamente i rischi di attacchi combinati voce-dati? Come posso automatizzare questo sul mio smartphone?"
    }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    setApiError(null);
    const userMsg: AIMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Build conversation representation to proxy to server
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Errore: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiMsg: AIMessage = {
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Errore richiamando l'API di analisi:", err);
      setApiError(err.message || "Errore sconosciuto di connessione all'API. Assicurati che lo stack server sia attivo.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setApiError(null);
  };

  return (
    <div className="bg-[#0b0f19]/80 rounded-lg border border-slate-800 shadow-2xl p-6 max-w-4xl mx-auto relative overflow-hidden" id="ai-panel-container">
      {/* Laser line ornament */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-purple-500/60 to-cyan-500/20" />
      
      {/* Title block */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/30">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">AI Telephony Security Agent</h3>
            <p className="text-xs text-slate-400 font-mono">MODEL ASSOCIATE: GEMINI-3.5-FLASH // SANDBOX_BOUNDED</p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-rose-400 rounded border border-slate-800 hover:border-rose-900 bg-slate-900 transition-colors cursor-pointer"
            title="Svuota Conversazione"
            id="clear-chat-btn"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Grid: Chat & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Preset prompt selectors */}
        <div className="md:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="bg-slate-950/40 p-4 rounded border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Network size={12} className="text-cyan-400" /> TEMPLATE PROMPT DI ANALISI
              </h4>
              
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Utilizza questi scenari fittizi pre-configurati per esaminare log e comprendere al meglio le implicazioni di sicurezza telefonica.
              </p>

              <div className="space-y-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputValue(preset.prompt);
                      setApiError(null);
                    }}
                    className="w-full text-left p-2.5 rounded border border-slate-800 bg-[#0e1626]/80 hover:border-purple-500/40 hover:bg-[#152038] text-xs transition-all cursor-pointer group"
                  >
                    <p className="font-bold text-slate-200 group-hover:text-purple-300 flex items-center gap-1 font-mono text-[10px] uppercase">
                      <HelpCircle size={12} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
                      {preset.label}
                    </p>
                    <p className="text-[9px] text-[#94a3b8] mt-1 line-clamp-1 leading-normal">{preset.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-black/40 rounded border border-slate-800 flex items-start gap-1.5 text-[9px] text-slate-400 font-mono leading-relaxed">
              <Lock size={12} className="text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>PROXIED GATEWAY:</strong> Tutte le interazioni con il backend di Gemini avvengono tramite canali protetti lato server. Nessuna API key viene esposta nel browser.
              </span>
            </div>
          </div>
        </div>

        {/* Conversation flow */}
        <div className="md:col-span-8 flex flex-col border border-slate-800 rounded bg-[#03070e] h-[380px] overflow-hidden">
          {/* Chat scrolling viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-3">
                  <MessageSquare size={16} className="text-cyan-500/40" />
                </div>
                <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">NO MESSAGE HISTORY</h5>
                <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed lowercase">
                  [SYS] Invia una domanda o scegli un template rapido a sinistra per avviare l'analisi di privacy e mitigazione.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isUser = m.role === "user";
                return (
                  <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wide">
                      <span>{isUser ? "SecOps Analyst" : "Analyzer AI Node"}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div className={`p-4 rounded text-xs leading-relaxed border ${
                      isUser 
                        ? "bg-[#0b0f19] text-white border-slate-700 font-mono whitespace-pre-wrap max-w-[90%]" 
                        : "bg-[#0e1626]/85 text-slate-200 border-cyan-800/40 max-w-[90%]"
                    }`}>
                      {isUser ? (
                        m.text
                      ) : (
                        <div className="markdown-body prose prose-invert max-w-none text-xs leading-relaxed">
                          <Markdown>{m.text}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Smart technical loading state */}
            {isLoading && (
              <div className="flex flex-col items-start animate-pulse font-mono">
                <div className="flex items-center gap-1.5 mb-1 text-[9px] text-slate-500 font-bold uppercase">
                  <span>Telephony AI Agent</span>
                  <span>•</span>
                  <span>PENDING_RESPONSE</span>
                </div>
                <div className="p-4 bg-[#0e1626]/85 rounded text-xs border border-purple-800/40 flex items-center gap-2 text-slate-400 shadow-xs">
                  <Loader2 size={13} className="animate-spin text-purple-400" />
                  <span className="text-[10px]">Calling secure core module (gemini-3.5-flash)...</span>
                </div>
              </div>
            )}

            {apiError && (
              <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded text-xs text-rose-300 flex items-start gap-2.5 font-mono">
                <ShieldAlert size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[10px] uppercase">API CONNECTION FAILURE</p>
                  <p className="text-[10px] text-rose-300/80 mt-1">{apiError}</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Form input controls */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-3 bg-[#070b13] border-t border-slate-800 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Inserisci log, script o quesiti di conformità..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-xs border border-slate-800 rounded bg-[#03070e] text-white focus:outline-hidden focus:border-cyan-500/50 font-medium font-mono placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/20"
              id="ai-prompt-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 rounded font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                isLoading || !inputValue.trim()
                  ? "bg-[#090f1d] border border-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
              }`}
              id="send-prompt-btn"
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
