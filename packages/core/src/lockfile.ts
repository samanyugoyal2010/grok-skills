import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface LockEntry {
  source: string;
  sha?: string;
  installedAt: string;
}

export interface Lockfile {
  skills: Record<string, LockEntry>;
}

export async function readLockfile(path: string): Promise<Lockfile> {
  if (!existsSync(path)) {
    return { skills: {} };
  }
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as Lockfile;
  if (!parsed.skills || typeof parsed.skills !== "object") {
    return { skills: {} };
  }
  return parsed;
}

export async function writeLockfile(path: string, lock: Lockfile): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
}

export async function copySkillDirectory(srcDir: string, destDir: string): Promise<void> {
  await rm(destDir, { recursive: true, force: true });
  await cp(srcDir, destDir, { recursive: true, force: true });
}
