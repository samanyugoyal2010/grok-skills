import type { RiskNote, RiskSeverity } from "./types.js";
import { findSecretKinds } from "./limits.js";

interface RiskRule {
  category: string;
  severity: RiskSeverity;
  pattern: RegExp;
  explanation: string;
}

const rules: RiskRule[] = [
  {
    category: "shell-execution",
    severity: "high",
    pattern: /\b(?:bash|sh|zsh|powershell|cmd(?:\.exe)?|child_process|exec\(|spawn\(|shell command)\b/i,
    explanation: "This skill contains instructions that may execute shell commands. Review every command before use."
  },
  {
    category: "network-access",
    severity: "medium",
    pattern: /\b(?:curl|wget|fetch\(|axios|http[s]?:\/\/|download|upload|webhook)\b/i,
    explanation: "This skill contains instructions that may access a network or transfer data."
  },
  {
    category: "destructive-action",
    severity: "high",
    pattern: /\b(?:rm\s+-rf|drop database|truncate table|force[- ]push|delete all|overwrite|destroy)\b/i,
    explanation: "This skill contains destructive or irreversible action language."
  },
  {
    category: "credential-access",
    severity: "high",
    pattern: /\b(?:\.env|api[_-]?key|secret|password|access token|private key|credential)\b/i,
    explanation: "This skill references credentials or sensitive configuration."
  }
];

export function scanRisk(value: string): RiskNote[] {
  const notes: RiskNote[] = [];
  for (const rule of rules) {
    if (rule.pattern.test(value)) notes.push({ severity: rule.severity, category: rule.category, explanation: rule.explanation });
  }

  const secrets = findSecretKinds(value);
  if (secrets.length > 0) {
    notes.push({
      severity: "high",
      category: "secret-like-value",
      explanation: `Secret-like material detected: ${secrets.join(", ")}. Do not install or share this output.`
    });
  }
  return notes;
}

export function mergeRiskNotes(...groups: RiskNote[][]): RiskNote[] {
  const seen = new Set<string>();
  const result: RiskNote[] = [];
  for (const note of groups.flat()) {
    const key = `${note.severity}:${note.category}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(note);
    }
  }
  return result;
}
