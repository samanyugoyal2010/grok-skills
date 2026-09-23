import type { ModelProvider } from "./config.js";
import { LIMITS } from "./limits.js";
import { readLimitedResponse } from "./body.js";

export interface ProviderPrompt {
  system: string;
  user: string;
}

export interface ProviderRequestOptions {
  provider: ModelProvider;
  model: string;
  apiKey?: string;
  ollamaBaseUrl?: string;
  prompt: ProviderPrompt;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
}

export type ProviderFailure =
  | { kind: "http"; status: number }
  | { kind: "network" }
  | { kind: "response" }
  | { kind: "oversized" };

export type ProviderResult = { text: string } | { failure: ProviderFailure };

interface ProviderRequest {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

function buildRequest(options: ProviderRequestOptions): ProviderRequest {
  const { provider, model, apiKey, prompt } = options;
  if (provider === "ollama") {
    return {
      url: `${options.ollamaBaseUrl ?? "http://127.0.0.1:11434"}/api/chat`,
      headers: {},
      body: {
        model,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
        stream: false
      }
    };
  }
  if (!apiKey) throw new Error("Provider API key is required");
  if (provider === "openai") {
    return {
      url: "https://api.openai.com/v1/responses",
      headers: { authorization: `Bearer ${apiKey}` },
      body: {
        model,
        instructions: prompt.system,
        input: prompt.user,
        max_output_tokens: 8_192,
        store: false
      }
    };
  }

  if (provider === "anthropic") {
    return {
      url: "https://api.anthropic.com/v1/messages",
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: {
        model,
        max_tokens: 8_192,
        system: prompt.system,
        messages: [{ role: "user", content: prompt.user }]
      }
    };
  }

  const url = provider === "openrouter"
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";
  return {
    url,
    headers: { authorization: `Bearer ${apiKey!}` },
    body: {
      model,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user }
      ],
      [provider === "groq" ? "max_completion_tokens" : "max_tokens"]: 8_192
    }
  };
}

function textFromContent(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return null;
  const pieces = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const block = item as Record<string, unknown>;
    return block.type === "text" && typeof block.text === "string" ? [block.text] : [];
  });
  return pieces.length ? pieces.join("\n") : null;
}

function parseProviderText(provider: ModelProvider, value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;

  if (provider === "openai") {
    if (typeof body.output_text === "string") return body.output_text;
    if (!Array.isArray(body.output)) return null;
    const text = body.output.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as Record<string, unknown>).content;
      return Array.isArray(content)
        ? content.flatMap((part) => part && typeof part === "object" && typeof (part as Record<string, unknown>).text === "string" ? [(part as Record<string, unknown>).text as string] : [])
        : [];
    });
    return text.length ? text.join("\n") : null;
  }

  if (provider === "anthropic") {
    return Array.isArray(body.content)
      ? textFromContent(body.content.filter((block) => block && typeof block === "object" && (block as Record<string, unknown>).type === "text"))
      : null;
  }

  if (provider === "ollama") {
    const message = body.message;
    return message && typeof message === "object" && typeof (message as Record<string, unknown>).content === "string"
      ? (message as Record<string, unknown>).content as string
      : null;
  }

  if (!Array.isArray(body.choices) || body.choices.length === 0) return null;
  const choice = body.choices[0];
  if (!choice || typeof choice !== "object") return null;
  const message = (choice as Record<string, unknown>).message;
  return message && typeof message === "object"
    ? textFromContent((message as Record<string, unknown>).content)
    : null;
}

export async function requestProvider(options: ProviderRequestOptions): Promise<ProviderResult> {
  const fetcher = options.fetcher ?? fetch;
  const request = buildRequest(options);
  let response: Response;
  try {
    response = await fetcher(request.url, {
      method: "POST",
      headers: { "content-type": "application/json", ...request.headers },
      body: JSON.stringify(request.body),
      redirect: "error",
      signal: options.signal
    });
  } catch {
    return { failure: { kind: "network" } };
  }

  if (!response.ok) {
    if (response.body) void response.body.cancel().catch(() => undefined);
    return { failure: { kind: "http", status: response.status } };
  }

  try {
    const body = JSON.parse(await readLimitedResponse(response, LIMITS.modelResponseBytes, options.signal));
    const text = parseProviderText(options.provider, body);
    return text ? { text } : { failure: { kind: "response" } };
  } catch (error) {
    return error instanceof Error && error.message.startsWith("Response exceeded ")
      ? { failure: { kind: "oversized" } }
      : { failure: { kind: "response" } };
  }
}
