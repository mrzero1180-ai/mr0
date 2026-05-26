import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  PhoneOff, 
  Wifi, 
  WifiOff, 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  RotateCcw, 
  Sparkles,
  Database,
  Lock,
  MessageSquareWarning
} from "lucide-react";
import { CallState, AttackStep, ThreatLog } from "../types";

export function AttackSimulator() {
  const [wifiActive, setWifiActive] = useState(true);
  const [mobileDataActive, setMobileDataActive] = useState(true);
  const [callState, setCallState] = useState<CallState>(CallState.IDLE);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [simulationLogs, setSimulationLogs] = useState<ThreatLog[]>([]);
  const [steps, setSteps] = useState<AttackStep[]>([
    {
      id: 1,
      title: "Inizio Chiamata Vocale",
      description: "La chiamata viene stabilita sul canale VoIP o circuito GSM classico.",
      isTriggered: false,
      status: "pending"
    },
    {
      id: 2,
      title: "Silent Network Request (Callback)",
      description: "Il server del chiamante invia un segnale di sincronizzazione silente per validare l'identità o attivare i dati associati al numero telefonico dell'utente.",
      isTriggered: false,
      status: "pending"
    },
    {
      id: 3,
      title: "Exchange Token / Richiesta OTP",
      description: "I sistemi di pagamento o wallet inviano una richiesta di autenticazione basata sul canale dati per confermare un token.",
      isTriggered: false,
      status: "pending"
    },
    {
      id: 4,
      title: "Autorizzazione Automatica",
      description: "Il protocollo si valida e chiude la transazione o sottoscrive abbonamenti.",
      isTriggered: false,
      status: "pending"
    }
  ]);

  // Handle logging helper
  const addLog = (text: string, type: "info" | "warning" | "danger" | "success" = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setSimulationLogs(prev => [{ timestamp, type, text }, ...prev]);
  };

  useEffect(() => {
    addLog("Simulatore inizializzato. Canali dati attivi (Wi-Fi: ON, Dati Cellulari: ON).", "info");
  }, []);

  const toggleWifi = () => {
    setWifiActive(!wifiActive);
    addLog(`Wi-Fi impostato su: ${!wifiActive ? "ATTIVO" : "DISATTIVATO"}`, !wifiActive ? "success" : "warning");
  };

  const toggleMobileData = () => {
    setMobileDataActive(!mobileDataActive);
    addLog(`Dati Mobili impostati su: ${!mobileDataActive ? "ATTIVI" : "DISATTIVATI"}`, !mobileDataActive ? "success" : "warning");
  };

  const startSimulation = () => {
    setCallState(CallState.INCOMING);
    setCurrentStepIndex(-1);
    setSteps(prev => prev.map(s => ({ ...s, isTriggered: false, status: "pending" })));
    addLog("Chiamata in entrata da +39 342 9821X99 (Numero Sconosciuto)!", "warning");
  };

  const rejectCall = () => {
    setCallState(CallState.IDLE);
    addLog("Chiamata rifiutata dall'utente. Attacco evitato alla radice.", "success");
  };

  const acceptCall = () => {
    setCallState(CallState.ACTIVE);
    addLog("Chiamata accettata. Monitoraggio del canale audio cellulare in corso...", "info");
    executeStep(0);
  };

  const executeStep = (index: number) => {
    if (index >= steps.length) {
      // Simulation finished. Evaluate overall result.
      const isProtected = !wifiActive && !mobileDataActive;
      if (isProtected) {
        setCallState(CallState.SECURED);
        addLog("SCUDO ATTIVO: L'assenza di dati mobili e Wi-Fi ha interrotto la catena d'attacco silente (Callback interrotto). Il tuo numero è sicuro!", "success");
      } else {
        setCallState(CallState.BREACHED);
        addLog("ATTENZIONE! Catena di attacco completata con successo. Il server remoto ha sfruttato la connettività dati attiva durante la chiamata per validare l'identificatore del numero. Autenticazione non autorizzata confermata.", "danger");
      }
      return;
    }

    setCurrentStepIndex(index);
    setSteps(prev => prev.map((s, i) => {
      if (i === index) {
        let status: "pending" | "alert" | "blocked" | "success" = "success";
        // Check if step 2 or 3 is blocked by our mitigations
        if ((i === 1 || i === 2) && !wifiActive && !mobileDataActive) {
          status = "blocked";
        } else if ((i === 1 || i === 2) && (wifiActive || mobileDataActive)) {
          status = "alert";
        }
        return { ...s, isTriggered: true, status };
      }
      return s;
    }));

    const step = steps[index];
    // Check if step is blocked
    const dataChannelActive = wifiActive || mobileDataActive;
    if ((index === 1) && !dataChannelActive) {
      addLog(`[PASSAGGIO 2] ${step.title}: BLOCCHETTO! La disattivazione della connettività dati impedisce al server remoto di inviare la chiamata di callback di sincronizzazione.`, "success");
      // Short delay, then jump to evaluation
      setTimeout(() => {
        executeStep(steps.length); // Force evaluation block
      }, 1500);
      return;
    }

    if (index === 0) {
      addLog(`[PASSAGGIO 1] ${step.title}: Connessione voce stabilita. Lo stack telefonico è agganciato.`, "info");
    } else if (index === 1) {
      addLog(`[PASSAGGIO 2] ${step.title}: Invio callback di rete su canale ${wifiActive ? "Wi-Fi" : ""}${wifiActive && mobileDataActive ? " & " : ""}${mobileDataActive ? "Dati Mobili" : ""}. URL di destinazione contattato.`, "danger");
    } else if (index === 2) {
      addLog(`[PASSAGGIO 3] ${step.title}: Richiesta token/OTP bypassata tramite associazione implicita di fiducia (Numero Telefonico verificato).`, "danger");
    } else if (index === 3) {
      addLog(`[PASSAGGIO 4] ${step.title}: Autorizzazione conclusa sul wallet/fintech agganciato di terze parti. Transazione completata.`, "danger");
    }

    setTimeout(() => {
      executeStep(index + 1);
    }, 1800);
  };

  const resetAll = () => {
    setCallState(CallState.IDLE);
    setCurrentStepIndex(-1);
    setWifiActive(true);
    setMobileDataActive(true);
    setSteps(prev => prev.map(s => ({ ...s, isTriggered: false, status: "pending" })));
    setSimulationLogs([]);
    addLog("Simulatore resettato alle impostazioni di default.", "info");
  };

  const dataChannelActive = wifiActive || mobileDataActive;

  return (
    <div className="bg-[#0b0f19]/80 rounded-lg border border-slate-800 shadow-2xl p-6 max-w-4xl mx-auto relative overflow-hidden" id="simulator-container">
      {/* Decorative cyber line ornament at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-500/60 to-purple-500/20" />
      
      {/* Header section with badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-md">
            <Radio size={12} className="animate-pulse" /> SIMULATORE DI VETTORI ATTIVI // DI-SYS-29
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">Attack Vector Simulator (Call + Data Link)</h3>
          <p className="text-xs text-slate-400">
            Testa lo scenario d'attacco in tempo reale e osserva come la mitigazione dei dati spenti influisce sulla sicurezza dello scambio token.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border border-slate-700 text-slate-300 bg-[#0e1626] hover:bg-slate-800 hover:text-white rounded transition-colors font-medium cursor-pointer"
            id="reset-sim-btn"
          >
            <RotateCcw size={13} /> Reset System
          </button>
        </div>
      </div>

      {/* Grid: Network Panel (Controls) & Phone Status Screen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Network & Device Controls */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-[#070b13] p-4 rounded-lg border border-slate-800/80">
            <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">CONNETTIVITÀ DISPOSITIVO</h4>
            
            <div className="space-y-3">
              {/* WIFI Switch */}
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0d1527] border border-slate-800 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${wifiActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-slate-900 text-slate-500 border border-transparent"}`}>
                    {wifiActive ? <Wifi size={16} /> : <WifiOff size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">WiFi Adapter</p>
                    <p className={`text-[10px] font-mono ${wifiActive ? "text-cyan-400" : "text-slate-500"}`}>
                      {wifiActive ? "CONNECTED" : "OFFLINE"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleWifi}
                  disabled={callState === CallState.ACTIVE}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    wifiActive ? "bg-cyan-500" : "bg-slate-800"
                  } ${callState === CallState.ACTIVE ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  <span className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${wifiActive ? "translate-x-5" : ""}`} />
                </button>
              </div>

              {/* Mobile Data Switch */}
              <div className="flex items-center justify-between p-2.5 rounded bg-[#0d1527] border border-slate-800 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${mobileDataActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-slate-900 text-slate-500 border border-transparent"}`}>
                    <Radio size={16} className={mobileDataActive && callState === CallState.ACTIVE ? "animate-pulse" : ""} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Cellular Network</p>
                    <p className={`text-[10px] font-mono ${mobileDataActive ? "text-cyan-400" : "text-slate-500"}`}>
                      {mobileDataActive ? "LTE_ACTIVE" : "DISABLED"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleMobileData}
                  disabled={callState === CallState.ACTIVE}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    mobileDataActive ? "bg-cyan-500" : "bg-slate-800"
                  } ${callState === CallState.ACTIVE ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  <span className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${mobileDataActive ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-[#03070e] rounded border border-slate-800 text-[10px] text-slate-400 flex gap-2">
              <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>
                <strong>Mitigazione Pro-Attiva:</strong> Disattivare interamente la componente dati prima d'instaurare la chiamata.
              </p>
            </div>
          </div>

          {/* Trigger simulator CTA */}
          {callState === CallState.IDLE && (
            <button
              type="button"
              onClick={startSimulation}
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded font-black text-xs uppercase tracking-tighter transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              id="simulate-call-btn"
            >
              <Phone className="w-4 h-4 text-black animate-bounce" />
              Invia Chiamata Sospetta
            </button>
          )}

          {/* State Indicator */}
          <div className="border border-slate-800 rounded bg-[#070b13] p-4 text-xs">
            <h5 className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-widest">DIAGNOSTIC STATUS</h5>
            {callState === CallState.IDLE && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> WAITING_SESSION
              </span>
            )}
            {callState === CallState.INCOMING && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/20 border border-amber-900/60 rounded animate-pulse">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> INCOMING_RING
              </span>
            )}
            {callState === CallState.ACTIVE && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-500/40 rounded">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" /> CALL_ACTIVE_EXPL_PND
              </span>
            )}
            {callState === CallState.SECURED && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded">
                <ShieldCheck size={12} className="text-emerald-400" /> SECURED_SHIELD_ACTIVE
              </span>
            )}
            {callState === CallState.BREACHED && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded animate-flash">
                <ShieldAlert size={12} className="text-rose-500" /> SYSTEM_BREACH_DETECTED
              </span>
            )}
          </div>
        </div>

        {/* Live Attack flow visualizer & phone status screen */}
        <div className="md:col-span-8 flex flex-col">
          {/* Main Visualizer Stage */}
          <div className="flex-1 bg-black/45 rounded-lg p-5 border border-slate-800 shadow-inner relative overflow-hidden flex flex-col justify-between min-h-[340px]">
            {/* Ambient network indicator overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-3 text-[10px] text-slate-500 z-10 font-mono tracking-widest">
              <div className="flex items-center gap-1">
                {wifiActive ? (
                  <span className="text-cyan-400 flex items-center gap-0.5"><Wifi size={12} /> WI-FI: ON</span>
                ) : (
                  <span className="text-slate-600 flex items-center gap-0.5"><WifiOff size={12} /> WI-FI: OFF</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {mobileDataActive ? (
                  <span className="text-cyan-400 flex items-center gap-0.5"><Radio size={12} /> LTE: ON</span>
                ) : (
                  <span className="text-slate-600 flex items-center gap-0.5"><Radio size={12} className="opacity-40" /> LTE: OFF</span>
                )}
              </div>
            </div>

            {/* Simulated Phone UI Ringing */}
            <AnimatePresence mode="wait">
              {callState === CallState.INCOMING && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center py-6 text-center z-10"
                >
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mb-3 animate-bounce">
                    <Phone size={26} className="animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Incoming Call Detected</h4>
                  <p className="text-[10px] text-rose-400 font-mono mb-2 uppercase tracking-wider">Unverified Caller ID</p>
                  <p className="text-xl font-bold font-mono tracking-widest text-white mb-6">+39 342 9821X99</p>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={rejectCall}
                      className="px-4 py-2 bg-rose-950/40 border border-rose-500/60 hover:bg-rose-900/40 text-rose-200 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PhoneOff size={12} /> [BLOCK_CALL]
                    </button>
                    <button
                      type="button"
                      onClick={acceptCall}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Phone size={12} /> [ESTABLISH]
                    </button>
                  </div>
                </motion.div>
              )}

              {callState === CallState.ACTIVE && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between py-2 z-10"
                >
                  {/* Active Call Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CALL_SESSION_ESTABLISHED // TARGET: +39 342...99</p>
                    </div>
                    <span className="text-[9px] bg-slate-900 text-rose-400 border border-rose-900/60 font-mono px-2 py-0.5 rounded">
                      EXPL_IN_PROGRESS
                    </span>
                  </div>

                  {/* Flow Steps Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-4">
                    {steps.map((step, idx) => {
                      const isActive = currentStepIndex === idx;
                      const isCompleted = currentStepIndex > idx;
                      const isStepBlocked = step.status === "blocked";
                      const isStepAlert = step.status === "alert";

                      return (
                        <div 
                          key={step.id} 
                          className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                            isActive 
                              ? "bg-slate-900/90 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                              : isStepBlocked
                              ? "bg-emerald-950/20 border-emerald-800 text-emerald-300/80"
                              : isCompleted && isStepAlert
                              ? "bg-rose-950/20 border-rose-950 text-rose-100"
                              : "bg-[#0b0f19] border-slate-800 text-slate-500"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-mono text-slate-400">FASE 0{step.id}</span>
                              {step.isTriggered && (
                                <span className={`inline-block w-2 h-2 rounded-full ${
                                  isStepBlocked 
                                    ? "bg-emerald-500" 
                                    : isStepAlert 
                                    ? "bg-rose-500 animate-pulse" 
                                    : "bg-cyan-500"
                                }`} />
                              )}
                            </div>
                            <h5 className="text-[11px] font-mono font-bold text-slate-200 line-clamp-1">{step.title}</h5>
                            <p className="text-[9px] text-[#94a3b8] mt-1 line-clamp-2 leading-relaxed">{step.description}</p>
                          </div>

                          {/* Trigger Line Indicator at bottom of card */}
                          <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                            {isActive && (
                              <div className="h-full bg-cyan-400 animate-pulse" style={{ width: "100%" }} />
                            )}
                            {isCompleted && (
                              <div className={`h-full ${isStepBlocked ? "bg-emerald-500" : "bg-cyan-500"}`} style={{ width: "100%" }} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Inline warning statement */}
                  <div className="bg-[#050913] border border-slate-800 p-2 rounded text-[10px] text-slate-300 font-mono flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={11} className="text-cyan-400 shrink-0" />
                      <span>TELEPHONY ENGINE: NETWORK DYNAMICS MONITOR</span>
                    </div>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${dataChannelActive ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                      {dataChannelActive ? "VULNERABLE_DATALINK" : "SECURED_DATALINK"}
                    </span>
                  </div>
                </motion.div>
              )}

              {callState === CallState.IDLE && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center py-6 text-center z-10"
                >
                  <div className="w-12 h-12 bg-[#090f1d] border border-slate-800 text-slate-500 rounded-full flex items-center justify-center mb-3">
                    <Phone className="w-5 h-5 text-cyan-500/40" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">NO SIMULATION ACTIVE</h4>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-xs font-mono">
                    [SYS] Clicca su "Invia Chiamata Sospetta" per attivare il ricevitore virtuale di rete.
                  </p>
                </motion.div>
              )}

              {callState === CallState.SECURED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center py-6 text-center z-10"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck size={28} />
                  </div>
                  <h4 className="text-base font-bold tracking-tight text-white mb-0.5">Protezione Rilevata con Successo!</h4>
                  <p className="text-[10px] text-emerald-400 font-mono mb-3">MITIGAZIONE FUNZIONANTE [SECURE_STATE]</p>
                  
                  <div className="bg-emerald-950/25 border border-emerald-500/20 p-3.5 rounded max-w-md text-left text-[11px] mb-5 text-emerald-200 font-sans">
                    <p className="font-semibold mb-1 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 uppercase">
                      <Lock size={12} /> Diagnostica di Sistema:
                    </p>
                    <p className="text-slate-300">
                      Disattivando preventivamente <strong>Wi-Fi</strong> ed <strong>LTE</strong>, il callback simultaneo di convalida è fallito. Non vi è stato alcuno scambio di token di pagamento e la linea classica voce è rimasta isolata dallo stack dati.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={startSimulation}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-mono font-black rounded transition-all cursor-pointer"
                  >
                    [RIESUGUI_PROVA]
                  </button>
                </motion.div>
              )}

              {callState === CallState.BREACHED && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center py-6 text-center z-10"
                >
                  <div className="w-14 h-14 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full flex items-center justify-center mb-3">
                    <ShieldAlert size={28} className="animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold tracking-tight text-white mb-0.5">Attacco Riuscito: Violazione Rilevata!</h4>
                  <p className="text-[10px] text-rose-400 font-mono mb-3 uppercase">Vulnerable Channel State</p>
                  
                  <div className="bg-[#180a0e] border border-rose-500/30 p-3.5 rounded max-w-md text-left text-[11px] mb-5 text-rose-100 font-sans">
                    <p className="font-semibold mb-1 flex items-center gap-1.5 font-mono text-[10px] text-rose-400 uppercase">
                      <MessageSquareWarning size={12} /> Exploit Report:
                    </p>
                    <p className="text-slate-300">
                      Avendo le connessioni dati attive, i server esterni sono riusciti ad associare il tuo numero telefonico live per confermare un addebito o richiedere un token. I callback silenti si sono propagati liberamente.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setWifiActive(false);
                        setMobileDataActive(false);
                        startSimulation();
                      }}
                      className="px-4 py-1.5 border border-cyan-500 bg-cyan-950/20 hover:bg-cyan-500 hover:text-black text-cyan-400 text-xs font-mono font-bold rounded transition-all cursor-pointer"
                    >
                      [APPLICA_MITIGAZIONE_E_RIESIGUI]
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative device frame accent */}
            <div className="absolute inset-0 border border-white/[0.03] pointer-events-none rounded" />
          </div>
        </div>
      </div>

      {/* Terminal logs panel at bottom */}
      <div className="border border-slate-800 rounded overflow-hidden bg-black/60 relative">
        <div className="px-4 py-2 bg-[#090f1d] flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database size={13} className="text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-slate-300">CONSOLLE DI RETE TELEFONICA // AUDIT_TAPPING_ACTIVE_LOG</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">SYS_CORE_GSM_BRIDGE_v1.0</span>
        </div>
        
        <div className="p-4 font-mono text-[10px] text-slate-300 h-32 overflow-y-auto space-y-1.5 flex flex-col-reverse max-h-[144px]">
          {simulationLogs.length === 0 ? (
            <span className="text-slate-500 italic">[READY] Canale pronto per l'acquisizione dei pacchetti gsm.</span>
          ) : (
            simulationLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={`font-semibold shrink-0 uppercase ${
                  log.type === "success" 
                    ? "text-emerald-400" 
                    : log.type === "warning" 
                    ? "text-amber-400" 
                    : log.type === "danger" 
                    ? "text-rose-400" 
                    : "text-cyan-400"
                }`}>
                  {log.type}:
                </span>
                <span className="text-slate-300">{log.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
