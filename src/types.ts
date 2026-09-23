import * as z from "zod/v4";

export const approvedContextSchema = z.object({
  path: z.string().min(1).max(500),
  reason: z.string().min(1).max(500),
  content: z.string().max(20_000)
}).strict();

export const compileSkillInputSchema = z.object({
  task: z.string().min(1).max(4_000),
  search_query: z.string().min(1).max(500),
  project_brief: z.string().max(20_000).optional(),
  approved_context: z.array(approvedContextSchema).max(10)
}).strict();

export const riskNoteSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  category: z.string(),
  explanation: z.string()
});

export const compileSkillOutputSchema = z.object({
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    sourceHash: z.string(),
    matchReason: z.string()
  })),
  contextManifest: z.array(z.object({
    path: z.string(),
    reason: z.string(),
    characterCount: z.number().int().nonnegative()
  })),
  changeSummary: z.array(z.string()),
  riskNotes: z.array(riskNoteSchema),
  skillMarkdown: z.string()
});

export type CompileSkillInput = z.infer<typeof compileSkillInputSchema>;

export type RiskSeverity = "low" | "medium" | "high";

export interface RiskNote {
  severity: RiskSeverity;
  category: string;
  explanation: string;
}

export interface SkillSource {
  url: string;
  title: string;
  sourceHash: string;
  matchReason: string;
  content: string;
}

export interface SkillSourceSummary {
  url: string;
  title: string;
  sourceHash: string;
  matchReason: string;
}

export type SkillRetrievalStatus = "complete" | "partial" | "failed";

export interface CompileSkillResponse {
  sources: SkillSourceSummary[];
  contextManifest: Array<{
    path: string;
    reason: string;
    characterCount: number;
  }>;
  changeSummary: string[];
  riskNotes: RiskNote[];
  skillMarkdown: string;
}

export interface SkillRetriever {
  search(query: string, signal?: AbortSignal): Promise<SkillSource[]>;
  getLastSearchStatus?: () => SkillRetrievalStatus;
}
