import { useState } from "react";
import { 
  FileCheck, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  ShieldAlert, 
  Info,
  CheckCircle2, 
  AlertCircle,
  Lock
} from "lucide-react";
import { SecurityQuestion } from "../types";

export function AuditorChecklist() {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([
    {
      id: "q1",
      category: "Zero-Trust",
      text: "Come viene valutato il numero telefonico dell'utente nei flussi di autenticazione o conferma di transazioni?",
      options: [
        {
          label: "[CRITICO] Fiducia implicita tramite Caller ID / Rete cellulare (Nessun secondo fattore di conferma)",
          score: 0,
          feedback: "Molto rischioso! Facilmente bypassabile tramite spoofing del chiamante o attacchi a radiofrequenza cellulare."
        },
        {
          label: "[MEDIO] OTP inviato via SMS o chiamata telefonica automatizzata predefinita",
          score: 45,
          feedback: "Moderatamente sicuro, ma vulnerabile ad intercettazioni di rete (SS7), SIM swap o callback coordinati."
        },
        {
          label: "[SICURO] Autenticazione crittografica multi-fattore In-App disaccoppiata (Zero-Trust)",
          score: 100,
          feedback: "Eccellente! Garantisce che il possesso fisico della SIM o del numero non sia l'unico garante di accesso."
        }
      ]
    },
    {
      id: "q2",
      category: "Sandboxing",
      text: "Qual è il livello di isolamento dei servizi di telefonia di sistema (Telephony Stack) rispetto alle app fintech, bancarie o ai wallet?",
      options: [
        {
          label: "[CRITICO] Le app fintech hanno permessi privilegiati per leggere lo stato della telefonata e registri senza filtri",
          score: 0,
          feedback: "Superficie di attacco critica. Un malware potrebbe rilevare la chiamata e inoltrare silenziosamente transazioni."
        },
        {
          label: "[MEDIO] Sandbox standard di sistema operativo, ma con API sensibili accessibili previa firma digitale condivisa",
          score: 55,
          feedback: "Discreto isolamento, ma lo stack telefonico può comunque inviare callback secondari che eludono l'utente."
        },
        {
          label: "[SICURO] Isolamento rigoroso in sandbox (Zero-Trust Permissions) e comunicazione tramite IPC asincrona super-filtrata",
          score: 100,
          feedback: "Ottimo! Riduce a zero i rischi di attivazioni silenti o bypass basati su privilege-escalation."
        }
      ]
    },
    {
      id: "q3",
      category: "NoScript Controls",
      text: "La vostra architettura implementa filtri granulari (NoScript-style) per impedire l'esecuzione automatica di script remoti o trigger di pagamento durante le sessioni di chiamata?",
      options: [
        {
          label: "[CRITICO] Nessun filtro. I callback di rete avvengono silenziosamente all'aggancio del socket vocale",
          score: 0,
          feedback: "Vulnerabilità alta. Permette exploit simultanei voce + dati in background."
        },
        {
          label: "[MEDIO] Filtri basati su whitelist statica di indirizzi IP o di hosting approvati",
          score: 50,
          feedback: "Risolve il problema parzialmente, ma non difende da domain fronting o hosting compromessi."
        },
        {
          label: "[SICURO] Controllo utente o blocco preventivo granulare degli script attivi durante la ricezione di chiamate esterne",
          score: 100,
          feedback: "Configurazione perfetta per la mitigazione dei vettori voce/dati sinergici."
        }
      ]
    },
    {
      id: "q4",
      category: "PII Data Shield",
      text: "Come sono protetti i numeri di telefono dei clienti (PII) memorizzati nei log di transazione o conservati per scopi pubblicitari?",
      options: [
        {
          label: "[CRITICO] Salvaguardati in chiaro nel log del database relazionale, accessibili da diversi ruoli interni",
          score: 10,
          feedback: "Rischio gravissimo di espatrio dati (Data Leak) e tracciamento non autorizzato."
        },
        {
          label: "[MEDIO] Crittografati a riposo (AES-256), ma associabili direttamente ad altre tabelle cliente",
          score: 60,
          feedback: "Buona crittografia, ma vulnerabile ad insider threats o compromissione dell'intera chiave principale."
        },
        {
          label: "[SICURO] Pseudonimizzazione completa, tokenizzazione ed hashing asimmetrico e irreversibile dei telefoni",
          score: 100,
          feedback: "Standard d'eccellenza. Protezione totale delle Identificazioni Personali (PII)."
        }
      ]
    },
    {
      id: "q5",
      category: "Zero-Trust",
      text: "Viene monitorata attivamente la correlazione di rete tra sessione telefonica attiva sul dispositivo e improvvisi tentativi di pagamento / login?",
      options: [
        {
          label: "[CRITICO] No, le transazioni e le telefonate corrono su canali logici completamente ciechi l'uno all'altro",
          score: 0,
          feedback: "Mancanza di contesto. Permette ad aggressori remoti di forzare approvazioni con chiamate automatizzate."
        },
        {
          label: "[MEDIO] Auditing a posteriori (Log storici cercati periodicamente per anomalie)",
          score: 40,
          feedback: "Permette di rilevare i furti ex-post, ma non previene la perdita attiva di denaro o account in tempo reale."
        },
        {
          label: "[SICURO] Rilevamento contestuale in tempo reale: blocco preventivo della transazione se avviata durante una telefonata non fidata",
          score: 100,
          feedback: "Incredibilmente resiliente! La correlazione contestuale è la prima barriera contro attacchi cross-channel."
        }
      ]
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    setQuestions(prev => prev.map((q, qIndex) => {
      if (qIndex === currentIndex) {
        return { ...q, selectedOptionIndex: optionIndex };
      }
      return q;
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    const answered = questions.filter(q => q.selectedOptionIndex !== undefined);
    if (answered.length === 0) return 0;
    const sum = answered.reduce((acc, q) => {
      const opt = q.options[q.selectedOptionIndex!];
      return acc + opt.score;
    }, 0);
    return Math.round(sum / questions.length);
  };

  const restartAuditor = () => {
    setQuestions(prev => prev.map(q => ({ ...q, selectedOptionIndex: undefined })));
    setCurrentIndex(0);
    setShowResults(false);
  };

  const currentQuestion = questions[currentIndex];
  const activeScore = calculateScore();
  const answeredCount = questions.filter(q => q.selectedOptionIndex !== undefined).length;

  return (
    <div className="bg-[#0b0f19]/80 rounded-lg border border-slate-800 shadow-2xl p-6 max-w-4xl mx-auto relative overflow-hidden" id="auditor-checklist">
      {/* Decorative cyber top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-500/60 to-purple-500/20" />
      
      {/* Sidebar-focused Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30">
          <FileCheck size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Audit di Conformità Telefonica e Zero-Trust</h3>
          <p className="text-xs text-slate-400 font-mono">VALUTANTE: CRYPTO-STACK-VERIFICATION // V-ATT-092</p>
        </div>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
            <span>AVANZAMENTO AUDIT SECURITY PROCESS</span>
            <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded">
              Domanda {currentIndex + 1} di {questions.length} ({answeredCount} risposte)
            </span>
          </div>

          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Current Question Block */}
          <div className="bg-slate-950/40 border border-[#1e293b] rounded-lg p-6">
            <span className="text-[9px] font-mono font-extrabold text-[#22d3ee] bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded uppercase tracking-wider mb-3.5 inline-block">
              Categoria: {currentQuestion.category}
            </span>
            <h4 className="text-base font-bold text-white leading-snug mb-5 font-sans">
              {currentQuestion.text}
            </h4>

            {/* MCQ Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentQuestion.selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded border transition-all text-xs flex items-start gap-3 justify-between cursor-pointer ${
                      isSelected 
                        ? "bg-cyan-950/20 border-cyan-500/50 text-cyan-200 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                        : "bg-[#0e1626]/80 border-slate-800 hover:bg-[#142038] text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected 
                          ? "border-cyan-400 bg-cyan-500 text-black font-black font-mono text-[9px]" 
                          : "border-slate-700 bg-black"
                      }`}>
                        {isSelected && "✓"}
                      </span>
                      <span className="font-sans font-medium">{option.label}</span>
                    </div>
                    {isSelected && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 font-bold ${
                        option.score >= 100 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : option.score > 30 
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        Score: {option.score}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inline feedback on select */}
            {currentQuestion.selectedOptionIndex !== undefined && (
              <div className="mt-4 p-3.5 rounded bg-cyan-950/15 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-200 animate-fadeIn font-sans">
                <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold font-mono text-[10px] text-cyan-400 uppercase tracking-wider">Identified Security Context:</p>
                  <p className="mt-0.5 text-slate-300">{currentQuestion.options[currentQuestion.selectedOptionIndex].feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 border border-slate-800 rounded font-mono text-xs font-semibold text-slate-400 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer ${
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft size={14} /> PREV
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentQuestion.selectedOptionIndex === undefined}
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded font-mono text-xs font-bold transition-all ${
                currentQuestion.selectedOptionIndex === undefined
                  ? "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer shadow-lg"
              }`}
            >
              {currentIndex === questions.length - 1 ? "Vedi Risultati" : "NEXT"} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Results Scoreboard */
        <div className="space-y-6 animate-fadeIn font-sans">
          <div className="text-center py-6 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={28} />
            </div>
            
            <h4 className="text-base font-bold text-white uppercase tracking-wider font-mono">Conformità Architetturale Zero-Trust</h4>
            
            {/* Score Ring / Bar */}
            <div className="my-5 flex items-center justify-center gap-4">
              <div className="text-3xl font-black font-mono tracking-tight text-cyan-400 bg-cyan-950/20 border border-cyan-500/30 px-5 py-2.5 rounded-lg shadow-2xl">
                {activeScore}%
              </div>
              <div className="text-left space-y-0.5">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">SECURITY EVALUATION GRADE</p>
                <p className={`text-xs font-black uppercase font-mono ${
                  activeScore >= 80 
                    ? "text-emerald-400" 
                    : activeScore >= 50 
                    ? "text-amber-400" 
                    : "text-rose-400"
                }`}>
                  {activeScore >= 80 ? "ECCELLENTE (STAFFA PROTETTA)" : activeScore >= 50 ? "DISCRETO (VULNERABILITÀ DI RETE DISPOSTE)" : "RISCHIO CRITICO"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto px-4 leading-relaxed">
              Il punteggio calcolato simula la robustezza dei canali contro gli attacchi combinati canale-voce + canale-dati e l'esposizione di informazioni PII.
            </p>
          </div>

          {/* Tabular feedback items */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Report di Conformità Dettagliato</h5>
            
            <div className="space-y-3">
              {questions.map((q) => {
                const opt = q.options[q.selectedOptionIndex!];
                const isExcellent = opt.score >= 90;
                
                return (
                  <div key={q.id} className="p-4 bg-[#0e1626]/70 border border-slate-800 rounded-lg flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {isExcellent ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : opt.score >= 40 ? (
                          <AlertCircle size={16} className="text-amber-400" />
                        ) : (
                          <ShieldAlert size={16} className="text-rose-400 animate-pulse" />
                        )}
                      </div>
                      <div className="font-sans">
                        <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-wide">{q.category}</p>
                        <h6 className="text-xs font-bold text-[#f1f5f9] leading-snug mt-0.5">{q.text}</h6>
                        <p className="text-xs font-bold text-cyan-300 mt-1">&gt; Selected option: {opt.label}</p>
                        <p className="text-xs text-slate-400 mt-1 italic">{opt.feedback}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 font-bold ${
                      isExcellent 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : opt.score >= 40 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {opt.score}/100
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System suggestions / guidelines footer */}
          <div className="bg-[#0c1424] border border-[#1e293b] p-5 rounded-lg">
            <h6 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider text-cyan-400">
              <Lock size={12} /> Architectural Recommendations:
            </h6>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Isolamento (Sandboxing):</strong> Sottoporre a sandboxing lo stack dei moduli telefonici nativi di sistema rispetto ad accumulazioni wallet non autorizzate.
              </li>
              <li>
                <strong>Fattori Crittografici Svincolati:</strong> Non usare SMS-OTP o callback di rete telefonici classici quale solo strumento fiducioso per movimentazioni sensibili.
              </li>
              <li>
                <strong>Policy di Educazione Utente:</strong> Implementare istruzioni pro-attive volte a far disabilitare Wi-Fi ed LTE in corso di chiamate sospette da mittenti ignoti.
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={restartAuditor}
              className="px-6 py-2 bg-[#090f1d] hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs rounded transition-colors cursor-pointer"
              id="restart-audit-btn"
            >
              [Ricomincia Audit]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
