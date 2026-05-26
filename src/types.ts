export enum CallState {
  IDLE = "IDLE",
  INCOMING = "INCOMING",
  ACTIVE = "ACTIVE",
  SECURED = "SECURED",
  BREACHED = "BREACHED"
}

export interface AttackStep {
  id: number;
  title: string;
  description: string;
  isTriggered: boolean;
  status: "pending" | "alert" | "blocked" | "success";
}

export interface SecurityQuestion {
  id: string;
  category: "Zero-Trust" | "Sandboxing" | "NoScript Controls" | "PII Data Shield";
  text: string;
  options: {
    label: string;
    score: number;
    feedback: string;
  }[];
  selectedOptionIndex?: number;
}

export interface ThreatLog {
  timestamp: string;
  type: "info" | "warning" | "danger" | "success";
  text: string;
}

export interface AIMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}
