export function abortReason(signal: AbortSignal, fallbackMessage = "Operation aborted"): Error {
  if (signal.reason instanceof Error) return signal.reason;
  if (typeof signal.reason === "string" && signal.reason.length > 0) return new Error(signal.reason);
  return new Error(fallbackMessage);
}

export function raceWithAbort<T>(
  operation: Promise<T>,
  signal: AbortSignal | undefined,
  onAbort: (() => void) | undefined,
  fallbackMessage = "Operation aborted"
): Promise<T> {
  if (!signal) return operation;
  if (signal.aborted) {
    onAbort?.();
    return Promise.reject(abortReason(signal, fallbackMessage));
  }

  return new Promise<T>((resolve, reject) => {
    const cleanup = () => signal.removeEventListener("abort", handleAbort);
    const handleAbort = () => {
      cleanup();
      onAbort?.();
      reject(abortReason(signal, fallbackMessage));
    };

    signal.addEventListener("abort", handleAbort, { once: true });
    operation.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error: unknown) => {
        cleanup();
        reject(error);
      }
    );
  });
}
