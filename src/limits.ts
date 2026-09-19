import type { CompileSkillInput } from "./types.js";

export const LIMITS = {
  task: 4_000,
  query: 500,
  brief: 20_000,
  files: 10,
  contextChars: 50_000,
  outputChars: 16_000,
  fetchBytes: 1_000_000,
  modelResponseBytes: 128_000
} as const;

const forbiddenPath = /(^|\/)(\.env(?:\.|$)|\.git(?:\/|$)|\.ssh(?:\/|$)|credentials?(?:\.|$)|secrets?(?:\.|$)|id_rsa(?:\.|$)|id_ed25519(?:\.|$)|\.npmrc$|\.netrc$|(?:\.docker|docker)\/config\.json$)/i;
const forbiddenExtension = /\.(pem|key|p12|pfx|crt|der)$/i;
const binaryExtension = /\.(7z|avif|bin|dll|dylib|exe|gif|gz|ico|jpeg|jpg|mov|mp3|mp4|pdf|png|so|tar|wasm|webp|woff2|zip)$/i;

export function isForbiddenPath(path: string): boolean {
  const normalizedPath = path.replaceAll("\\", "/");
  if (normalizedPath.includes("\0") || normalizedPath.startsWith("/") || normalizedPath.startsWith("~") || /^[A-Za-z]:\//.test(normalizedPath)) return true;
  const segments = normalizedPath.split("/");
  if (segments.includes("..")) return true;
  return forbiddenPath.test(normalizedPath) || forbiddenExtension.test(normalizedPath) || binaryExtension.test(normalizedPath);
}

export function isLikelyBinaryContent(value: string): boolean {
  if (value.includes("\0")) return true;
  const controlCharacters = [...value].filter((character) => {
    const code = character.charCodeAt(0);
    return (code < 9 || (code > 13 && code < 32)) && code !== 27;
  }).length;
  return value.length > 0 && controlCharacters / value.length > 0.01;
}

const secretPatterns: Array<[string, RegExp]> = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
  ["aws-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["github-token", /\b(?:ghp|gho|ghs|github_pat)_[A-Za-z0-9_]{20,}\b/],
  ["gitlab-token", /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["anthropic-token", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ["openai-token", /\bsk-(?!ant-)[A-Za-z0-9_-]{20,}\b/],
  ["google-api-key", /\bAIza[0-9A-Za-z_-]{20,}\b/],
  ["stripe-secret-key", /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/],
  ["npm-token", /\bnpm_[A-Za-z0-9]{20,}\b/],
  ["bearer-token", /\bBearer\s+[A-Za-z0-9._-]{20,}\b/i],
  ["credential-assignment", /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*[^\s]{8,}/i]
];

export function findSecretKinds(value: string): string[] {
  return secretPatterns.filter(([, pattern]) => pattern.test(value)).map(([kind]) => kind);
}

export function validateCompileInput(input: CompileSkillInput): void {
  if (input.approved_context.length > LIMITS.files) {
    throw new Error(`approved_context cannot contain more than ${LIMITS.files} files`);
  }

  const totalChars = input.approved_context.reduce((sum, file) => sum + file.content.length, 0);
  if (totalChars > LIMITS.contextChars) {
    throw new Error(`approved_context exceeds the ${LIMITS.contextChars}-character limit`);
  }

  for (const file of input.approved_context) {
    if (isForbiddenPath(file.path)) {
      throw new Error(`Context path is not allowed: ${file.path}`);
    }
    if (isLikelyBinaryContent(file.content)) {
      throw new Error(`Context file appears to be binary: ${file.path}`);
    }
    const secretKinds = [...findSecretKinds(file.path), ...findSecretKinds(file.reason), ...findSecretKinds(file.content)];
    if (secretKinds.length > 0) {
      throw new Error(`Context appears to contain secret material: ${secretKinds.join(", ")}`);
    }
  }

  const taskSecretKinds = findSecretKinds(input.task);
  if (taskSecretKinds.length > 0) {
    throw new Error(`task appears to contain secret material: ${taskSecretKinds.join(", ")}`);
  }

  const querySecretKinds = findSecretKinds(input.search_query);
  if (querySecretKinds.length > 0) {
    throw new Error(`search_query appears to contain secret material: ${querySecretKinds.join(", ")}`);
  }

  if (input.project_brief) {
    const briefSecretKinds = findSecretKinds(input.project_brief);
    if (briefSecretKinds.length > 0) {
      throw new Error(`project_brief appears to contain secret material: ${briefSecretKinds.join(", ")}`);
    }
  }
}
