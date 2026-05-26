import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  BookOpen, 
  Activity, 
  FileCheck, 
  Sparkles, 
  Radio, 
  PhoneCall, 
  Users, 
  Unlock, 
  Layers, 
  PowerOff,
  UserCheck
} from "lucide-react";
import { AttackSimulator } from "./components/AttackSimulator";
import { AuditorChecklist } from "./components/AuditorChecklist";
import { AIPanel } from "./components/AIPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState<"info" | "simulator" | "auditor" | "ai">("info");

  return (
    <div className="min-h-screen bg-[#020617] text-[#cbd5e1] font-sans flex flex-col justify-between" id="app-root">
      
      {/* Top Banner with Cyber Immersive Header and glows */}
      <header className="bg-[#0b0f19] border-b border-cyan-500/20 pb-4 shrink-0 relative overflow-hidden px-4 pt-8 md:pt-10">
        {/* Abstract design geometry accents mimicking the Design HTML */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="max-w-3xl space-y-2">
            <p className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase">
              SECURITY ANALYSIS REPORT // REF: V-ATT-092 // CLASSIFICATION: CRITICAL
            </p>
            <h1 className="text-3xl md:text-4.5xl font-black tracking-tight text-white leading-tight">
              Analisi Tecnica: Vettori di Attacco Call-Based
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
              Nel contesto della sicurezza mobile, l’associazione tra telefonia analogica e canali dati digitali rappresenta un vettore d’attacco sottovalutato ma tecnicamente rilevante. Questa piattaforma interattiva diagnostica le minacce, simula le mitigazioni e valuta i protocolli zero‑trust del dispositivo.
            </p>
          </div>

          {/* Quick Threat Levels Indicator (Classification: Critical, Threat Level: High) */}
          <div className="bg-[#0d1527] border border-cyan-500/30 p-5 rounded-lg flex flex-col gap-2 shrink-0 md:w-80 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-widest border-b border-slate-800 pb-2 mb-1 text-slate-400">
              <span>Classification</span>
              <span className="text-rose-500 font-bold">CRITICAL</span>
            </div>
            <div className="flex items-center justify-between text-xs my-0.5 font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Radio size={12} className="text-cyan-400" /> THREAT LEVEL
              </span>
              <span className="text-rose-500 font-bold uppercase">HIGH</span>
            </div>
            <div className="flex items-center justify-between text-xs my-0.5 font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <BookOpen size={12} className="text-indigo-400" /> SANDBOX LAYER
              </span>
              <span className="text-cyan-400 font-bold">[ACTIVE]</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar container */}
      <div className="bg-[#050b14] border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-2 py-2">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 rounded-lg border ${
              activeTab === "info"
                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
            id="tab-info"
          >
            <BookOpen size={14} /> [01] SUPERFICIE E TEORIA
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`py-2 px-4 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 rounded-lg border ${
              activeTab === "simulator"
                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
            id="tab-sim"
          >
            <Activity size={14} /> [02] ATTACK SIMULATOR
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("auditor")}
            className={`py-2 px-4 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 rounded-lg border ${
              activeTab === "auditor"
                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
            id="tab-auditor"
          >
            <FileCheck size={14} /> [03] ZERO-TRUST AUDIT
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`py-2 px-4 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 rounded-lg border ${
              activeTab === "ai"
                ? "bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}
            id="tab-ai"
          >
            <Sparkles size={14} className="text-purple-400 animate-pulse" /> [04] AI RISK AGENT
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Core Information Section - Bento layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Attack surface card */}
                <div className="md:col-span-8 bg-slate-900/50 border border-slate-800 p-6 md:p-8 rounded-lg shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  
                  <span className="text-[10px] font-mono font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                    Superficie d'Attacco
                  </span>
                  
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                    Come nasce la minaccia: Associazione Telefono e Callback Silenti
                  </h2>
                  <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                    Servizi di terze parti non autorizzati possono forzare il numero di telefono dell'utente come un identificativo di autenticazione precondiviso, aprendo falle critiche quando non presiedute da fattori crittografici scollegati.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-rose-500/30 transition-all group">
                      <p className="text-[10px] font-mono text-rose-300/70 mb-1">[VECTOR_01]</p>
                      <h4 className="text-xs font-bold text-slate-200">Trigger non autorizzati di pagamento</h4>
                      <p className="text-[11px] text-slate-400 mt-1 pb-1">
                        Chiamate in ingresso o risposte silenti che attivano in background flussi di prelievo (bancarie o wallet).
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-amber-500/30 transition-all group">
                      <p className="text-[10px] font-mono text-amber-400/80 mb-1">[VECTOR_02]</p>
                      <h4 className="text-xs font-bold text-slate-200">Bypass Verifiche &amp; OTP</h4>
                      <p className="text-[11px] text-slate-400 mt-1 pb-1">
                        Attivazione di flussi di validazione tramite chiamate parallele o IVR che estorcono/confermano chiavi casuali.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-cyan-500/30 transition-all group">
                      <p className="text-[10px] font-mono text-cyan-400/80 mb-1">[VECTOR_03]</p>
                      <h4 className="text-xs font-bold text-slate-200">Interazione Privilegi e Telephony state</h4>
                      <p className="text-[11px] text-slate-400 mt-1 pb-1">
                        Integrazione cieca tra stack telefonici di sistema e consensi di privacy elusi silenziosamente a livello SO.
                      </p>
                    </div>

                    <div className="p-4 bg-[#0d1527]/60 border border-[#1e293b] rounded-lg hover:border-purple-500/30 transition-all group">
                      <p className="text-[10px] font-mono text-purple-400/80 mb-1">[VECTOR_04]</p>
                      <h4 className="text-xs font-bold text-slate-200">Raccolta persistente di dati PII</h4>
                      <p className="text-[11px] text-slate-400 mt-1 pb-1">
                        Leakage e retention silente di record storici delle transazioni associati fisicamente al MSISDN dell'utente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mitigation Card */}
                <div className="md:col-span-4 flex flex-col gap-6">
                  {/* Immediate Action */}
                  <div className="bg-cyan-950/20 border border-cyan-500/30 p-6 rounded-lg flex-1 shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-4 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-tighter mb-4">
                        Active Mitigation Layer
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                        Mitigazione Immediata
                      </h3>
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed font-normal">
                        Disattivare i dati mobili o il Wi‑Fi prima di rispondere a numeri sconosciuti o non verificati.
                      </p>
                      
                      <div className="mt-5 space-y-3 bg-black/40 rounded border border-cyan-500/20 p-4 font-mono text-[11px] leading-relaxed">
                        <p className="text-cyan-500/70 flex items-center gap-1.5">
                          <span>&gt;</span> <span>Disconnessione Callback Silenti</span>
                        </p>
                        <p className="text-cyan-500/70 flex items-center gap-1.5">
                          <span>&gt;</span> <span>Prevenzione Sincronizzazione Token</span>
                        </p>
                        <p className="text-cyan-500/70 flex items-center gap-1.5">
                          <span>&gt;</span> <span>Isolamento Sessione Voce Standard</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-cyan-500/20">
                      <button
                        type="button"
                        onClick={() => setActiveTab("simulator")}
                        className="w-full py-2.5 px-3 bg-cyan-500 text-black font-black uppercase tracking-tighter text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
                      >
                        Apri Simulatore Interattivo <Activity size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Block & Zero-Trust Checklist */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 md:p-8 shadow-2xl">
                <span className="text-[10px] font-mono font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                  Zero‑Trust Architectural Guidelines
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug mb-2">
                  Considerazioni di Design e Difesa Logica
                </h3>
                <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed mb-6">
                  La sicurezza non è un componente aggiuntivo. Per mitigare gli attacchi combinati canale-voce + canale-dati dobbiamo strutturare le difese su criteri zero-trust coerenti.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-lg bg-slate-950/40 border border-[#1e293b] hover:border-indigo-500/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-3">
                      <Layers size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1 font-mono">Permessi Zero-Trust</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      L'autenticazione basata sul possesso della linea SIM non deve mai godere di fiducia cieca. Implementare verifiche crittografiche asimmetriche dedicate.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg bg-slate-950/40 border border-[#1e293b] hover:border-purple-500/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3">
                      <Unlock size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1 font-mono">Micro-Sandboxing</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Micro-segmentare lo stack dei moduli telefonici nativi di sistema per impedire accessi diretti asincroni ad aggregazioni wallet o banking app non verificate.
                    </p>
                  </div>

                  <div className="p-5 rounded-lg bg-slate-950/40 border border-[#1e293b] hover:border-cyan-500/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3">
                      <UserCheck size={16} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1 font-mono">Controlli NoScript</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sospendere l'esecuzione automatica di script di rete di background quando viene rilevata una sessione di chiamata audio attiva con contatti ignoti.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center border-t border-slate-800/80 pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("auditor")}
                    className="py-2.5 px-6 border border-indigo-500/40 bg-indigo-950/20 hover:bg-[#1e293b] text-indigo-300 font-mono text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Effettua Audit di Conformità <FileCheck size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "simulator" && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
            >
              <AttackSimulator />
            </motion.div>
          )}

          {activeTab === "auditor" && (
            <motion.div
              key="auditor"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
            >
              <AuditorChecklist />
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
            >
              <AIPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer information section from Design HTML */}
      <footer className="mt-8 flex items-center justify-between border-t border-slate-800/80 p-6 font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
        <div>Core Security Protocol v4.2.0</div>
        <div className="flex space-x-6 text-[9px] md:text-[10px]">
          <span className="hidden sm:inline">Signal State: Encrypted</span>
          <span className="text-cyan-500/50">Network Guard: Enabled</span>
          <span className="text-rose-500/50">Exploit Protection: Active</span>
        </div>
        <div>System Time: 02:44:11</div>
      </footer>
    </div>
  );
}
