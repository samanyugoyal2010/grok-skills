import { NextRequest, NextResponse } from "next/server";
import {
  getCatalog,
  searchSkills,
  type RuntimeFilter,
} from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? "";
  const runtime = (searchParams.get("runtime") as RuntimeFilter) || "all";

  const catalog = getCatalog();
  const skills = searchSkills(catalog.skills, query, runtime);

  return NextResponse.json({
    query,
    skills,
    count: skills.length,
  });
}
