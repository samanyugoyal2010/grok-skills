import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export async function GET() {
  const catalog = getCatalog();
  return NextResponse.json({
    ...catalog,
    skills: catalog.skills.map(({ skillMd: _skillMd, ...skill }) => skill),
  });
}
