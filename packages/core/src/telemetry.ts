import type { Runtime, TelemetryEvent } from "@grok-skills/spec";

export function telemetryEnabled(): boolean {
  if (!process.env.GROK_SKILLS_REGISTRY?.trim()) {
    return false;
  }
  return process.env.DISABLE_TELEMETRY !== "1" && process.env.DO_NOT_TRACK !== "1";
}

export async function reportInstall(
  event: TelemetryEvent,
  endpoint: string | null | undefined
): Promise<void> {
  if (!endpoint) {
    return;
  }
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Ignore network errors.
  }
}

/** Registry origin only. Never defaults to localhost. */
export function defaultTelemetryEndpoint(): string | null {
  const raw = process.env.GROK_SKILLS_REGISTRY?.trim();
  if (!raw) {
    return null;
  }
  const origin = raw.replace(/\/+$/, "");
  if (/\/api\/t$/i.test(origin)) {
    return origin;
  }
  return `${origin}/api/t`;
}

export function buildTelemetryEvent(
  skillName: string,
  sourceDisplay: string,
  owner: string | undefined,
  repo: string | undefined,
  sha: string | undefined,
  runtime: Runtime
): TelemetryEvent {
  const skillId =
    owner && repo ? `${owner}/${repo}/${skillName}` : `${sourceDisplay}/${skillName}`;
  return {
    skillId,
    source: sourceDisplay,
    sha,
    runtimeHint: runtime,
  };
}
