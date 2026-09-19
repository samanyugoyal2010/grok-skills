import { abortReason } from "./abort.js";

export async function readLimitedResponse(response: Response, maxBytes = 1_000_000, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted) throw abortReason(signal);
  const declaredLength = response.headers.get("content-length");
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > maxBytes) {
    throw new Error(`Response exceeded ${maxBytes} bytes`);
  }

  if (!response.body) {
    const bytes = await response.arrayBuffer();
    if (signal?.aborted) throw abortReason(signal);
    if (bytes.byteLength > maxBytes) throw new Error(`Response exceeded ${maxBytes} bytes`);
    return new TextDecoder().decode(bytes);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  let abortFailure: Error | undefined;
  const onAbort = () => {
    abortFailure = abortReason(signal!);
    void reader.cancel(abortFailure).catch(() => undefined);
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  try {
    while (true) {
      const chunk = await reader.read();
      if (abortFailure) throw abortFailure;
      if (chunk.done) break;
      totalBytes += chunk.value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error(`Response exceeded ${maxBytes} bytes`);
      }
      chunks.push(chunk.value);
    }
  } finally {
    signal?.removeEventListener("abort", onAbort);
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
