import test from "node:test";
import assert from "node:assert/strict";
import { requestProvider } from "../src/providers.js";
import type { ModelProvider } from "../src/config.js";

const prompt = { system: "system directions", user: "task payload" };
const markdown = "---\nname: example\ndescription: Example workflow.\n---\n\n# Example";

const providerCases: Array<{
  provider: ModelProvider;
  model: string;
  url: string;
  body: (request: Record<string, unknown>) => void;
  response: unknown;
}> = [
  {
    provider: "openai",
    model: "gpt-4.1-mini",
    url: "https://api.openai.com/v1/responses",
    body: (request) => {
      assert.equal(request.instructions, prompt.system);
      assert.equal(request.input, prompt.user);
      assert.equal(request.store, false);
    },
    response: { output: [{ content: [{ type: "output_text", text: markdown }] }] }
  },
  {
    provider: "anthropic",
    model: "claude-sonnet-5",
    url: "https://api.anthropic.com/v1/messages",
    body: (request) => {
      assert.equal(request.system, prompt.system);
      assert.deepEqual(request.messages, [{ role: "user", content: prompt.user }]);
    },
    response: { content: [{ type: "text", text: markdown }] }
  },
  {
    provider: "openrouter",
    model: "openai/gpt-4.1-mini",
    url: "https://openrouter.ai/api/v1/chat/completions",
    body: (request) => assert.deepEqual(request.messages, [{ role: "system", content: prompt.system }, { role: "user", content: prompt.user }]),
    response: { choices: [{ message: { content: markdown } }] }
  },
  {
    provider: "groq",
    model: "openai/gpt-oss-20b",
    url: "https://api.groq.com/openai/v1/chat/completions",
    body: (request) => assert.deepEqual(request.messages, [{ role: "system", content: prompt.system }, { role: "user", content: prompt.user }]),
    response: { choices: [{ message: { content: markdown } }] }
  }
];

for (const fixture of providerCases) {
  test(`sends a server-held key and parses ${fixture.provider} responses`, async () => {
    const apiKey = `local-${fixture.provider}-secret`;
    let sentUrl = "";
    let sentHeaders = new Headers();
    let requestBody: Record<string, unknown> = {};
    const result = await requestProvider({
      provider: fixture.provider,
      model: fixture.model,
      apiKey,
      prompt,
      fetcher: (async (url, init) => {
        sentUrl = String(url);
        sentHeaders = new Headers(init?.headers);
        requestBody = JSON.parse(String(init?.body));
        return new Response(JSON.stringify(fixture.response), { status: 200 });
      }) as typeof fetch
    });

    assert.equal(sentUrl, fixture.url);
    assert.ok(sentHeaders.get("authorization") === `Bearer ${apiKey}` || sentHeaders.get("x-api-key") === apiKey);
    assert.equal(JSON.stringify(requestBody).includes(apiKey), false);
    fixture.body(requestBody);
    assert.deepEqual(result, { text: markdown });
  });
}

test("sends Ollama native chat requests without an API key or authorization header", async () => {
  let sentUrl = "";
  let sentHeaders = new Headers();
  let requestBody: Record<string, unknown> = {};
  const result = await requestProvider({
    provider: "ollama",
    model: "qwen3:8b",
    ollamaBaseUrl: "http://localhost:11434",
    prompt,
    fetcher: (async (url, init) => {
      sentUrl = String(url);
      sentHeaders = new Headers(init?.headers);
      requestBody = JSON.parse(String(init?.body));
      assert.equal(init?.redirect, "error");
      return new Response(JSON.stringify({ message: { role: "assistant", content: markdown }, done: true }), { status: 200 });
    }) as typeof fetch
  });

  assert.equal(sentUrl, "http://localhost:11434/api/chat");
  assert.equal(sentHeaders.has("authorization"), false);
  assert.equal(sentHeaders.has("x-api-key"), false);
  assert.deepEqual(requestBody, {
    model: "qwen3:8b",
    messages: [{ role: "system", content: prompt.system }, { role: "user", content: prompt.user }],
    stream: false
  });
  assert.deepEqual(result, { text: markdown });
});

test("returns bounded, sanitized failures for malformed, oversized, and errored Ollama responses", async () => {
  const base = { provider: "ollama" as const, model: "qwen3:8b", prompt };
  const malformed = await requestProvider({
    ...base,
    fetcher: (async () => new Response("not json", { status: 200 })) as typeof fetch
  });
  assert.deepEqual(malformed, { failure: { kind: "response" } });

  const invalidShape = await requestProvider({
    ...base,
    fetcher: (async () => new Response(JSON.stringify({ message: { content: 42 } }), { status: 200 })) as typeof fetch
  });
  assert.deepEqual(invalidShape, { failure: { kind: "response" } });

  const oversized = await requestProvider({
    ...base,
    fetcher: (async () => new Response(JSON.stringify({ message: { content: "x".repeat(140_000) } }), { status: 200 })) as typeof fetch
  });
  assert.deepEqual(oversized, { failure: { kind: "oversized" } });

  const httpError = await requestProvider({
    ...base,
    fetcher: (async () => new Response("private endpoint detail", { status: 500 })) as typeof fetch
  });
  assert.deepEqual(httpError, { failure: { kind: "http", status: 500 } });
  assert.equal(JSON.stringify(httpError).includes("private endpoint detail"), false);

  const networkError = await requestProvider({
    ...base,
    fetcher: (async () => { throw new Error("private network detail"); }) as typeof fetch
  });
  assert.deepEqual(networkError, { failure: { kind: "network" } });
  assert.equal(JSON.stringify(networkError).includes("private network detail"), false);
});

test("provider HTTP failures expose only a status code, never provider response text", async () => {
  const apiKey = "never-in-an-error-secret";
  const result = await requestProvider({
    provider: "openai",
    model: "gpt-4.1-mini",
    apiKey,
    prompt,
    fetcher: (async () => new Response(JSON.stringify({ error: `invalid key ${apiKey}` }), { status: 401 })) as typeof fetch
  });
  assert.deepEqual(result, { failure: { kind: "http", status: 401 } });
  assert.equal(JSON.stringify(result).includes(apiKey), false);
});

test("network failure messages are discarded rather than passed through", async () => {
  const apiKey = "never-in-an-error-secret";
  const result = await requestProvider({
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    apiKey,
    prompt,
    fetcher: (async () => { throw new Error(`request failed with ${apiKey}`); }) as typeof fetch
  });
  assert.deepEqual(result, { failure: { kind: "network" } });
  assert.equal(JSON.stringify(result).includes(apiKey), false);
});

test("rejects malformed JSON and responses beyond the configured byte limit", async () => {
  const base = { provider: "openrouter" as const, model: "openai/gpt-4.1-mini", apiKey: "server-secret", prompt };
  const malformed = await requestProvider({
    ...base,
    fetcher: (async () => new Response("not json", { status: 200 })) as typeof fetch
  });
  assert.deepEqual(malformed, { failure: { kind: "response" } });

  const oversized = await requestProvider({
    ...base,
    fetcher: (async () => new Response(JSON.stringify({ choices: [{ message: { content: "x".repeat(140_000) } }] }), { status: 200 })) as typeof fetch
  });
  assert.deepEqual(oversized, { failure: { kind: "oversized" } });
});

test("forwards abort signals and disables automatic redirects for credentialed requests", async () => {
  const controller = new AbortController();
  let sentSignal: AbortSignal | null | undefined;
  let redirectMode: RequestRedirect | undefined;
  await requestProvider({
    provider: "openai",
    model: "gpt-4.1-mini",
    apiKey: "server-secret",
    prompt,
    signal: controller.signal,
    fetcher: (async (_url, init) => {
      sentSignal = init?.signal;
      redirectMode = init?.redirect;
      return new Response(JSON.stringify({ output_text: markdown }), { status: 200 });
    }) as typeof fetch
  });
  assert.equal(sentSignal, controller.signal);
  assert.equal(redirectMode, "error");
});
