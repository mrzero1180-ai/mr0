import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for security analysis
  app.post("/api/analyze", async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Richiesta non valida. Il parametro 'message' è richiesto." });
    }

    try {
      const systemInstruction = `Sei un esperto di Cybersecurity Mobile e Reti Telefoniche, specializzato in vettori di attacco basati su chiamata (Call-Based Attack Vectors), protocolli zero-trust, sandboxing dello stack telefonico e attacchi correlati (es. SIM Swap, chiamate spoofing, trigger OTP basati su IVR e intercettazione dati cellulari).
Il tuo compito è analizzare log di rete/telefonia, configurazioni di canali o rispondere a domande di sicurezza tecnica con massima precisione e rigore ingegneristico.
Formula la tua risposta in lingua italiana, utilizzando una formattazione Markdown elegante, leggibile, strutturata in sezioni logiche e fornendo dettagli tecnici chiari ed esaustivi.
Indica sempre:
1. Il risk profile dell'elemento analizzato o della domanda.
2. I possibili impatti sulla privacy (raccolta silente di PII, localizzazione, ecc.) e sulla sicurezza (autorizzazione transazioni monetarie, bypass OTP).
3. Le mitigazioni tecniche attivabili (sia a livello utente - es. disattivazione connettività cellulare/Wi-Fi durante chiamate sconosciute - sia a livello architetturale - es. zero-trust, controllo granulare stile NoScript, sandboxing).`;

      // Structure contents properly for candidate generation
      const formattedContents = [];
      
      // Handle brief context if history is provided
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role,
            parts: [{ text: turn.text }]
          });
        }
      }
      
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || "Impossibile ottenere una risposta valida dal motore di intelligenza artificiale.";
      return res.json({ text });
    } catch (error: any) {
      console.error("Errore nell'integrazione di Gemini AI:", error);
      return res.status(500).json({ 
        error: "Errore durante l'elaborazione dell'analisi di sicurezza.",
        details: error.message
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
