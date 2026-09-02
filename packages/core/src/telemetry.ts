import type { Runtime, TelemetryEvent } from "@grok-skills/spec";

export function telemetryEnabled(): boolean {
  return process.env.DISABLE_TELEMETRY !== "1" && process.env.DO_NOT_TRACK !== "1";
}

export async function reportInstall(event: TelemetryEvent, endpoint: string): Promise<void> {
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

export function defaultTelemetryEndpoint(): string {
  return process.env.GROK_SKILLS_REGISTRY ?? "http://localhost:3000/api/t";
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
