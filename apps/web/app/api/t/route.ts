import { NextRequest, NextResponse } from "next/server";
import type { TelemetryEvent } from "@grok-skills/spec";
import { getCatalog, recordInstall } from "@/lib/catalog";

export async function POST(request: NextRequest) {
  let body: TelemetryEvent & Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { skillId, source } = body;

  if (!skillId || !source) {
    return NextResponse.json(
      { error: "skillId and source are required" },
      { status: 400 },
    );
  }

  if (!/^[a-z0-9][a-z0-9._/-]{0,200}$/i.test(skillId)) {
    return NextResponse.json({ error: "Invalid skillId" }, { status: 400 });
  }

  const catalog = getCatalog();
  const skill = catalog.skills.find(
    (s) =>
      s.id === skillId ||
      s.skillId === skillId ||
      s.name === skillId ||
      skillId.endsWith(`/${s.name}`),
  );

  const id = skill?.id ?? skillId;
  recordInstall(id);

  return NextResponse.json({ ok: true, skillId: id });
}
