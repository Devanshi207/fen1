/** A resume sent with a job application: a PDF or a Word file, small enough for the database to hold. */
export const RESUME_MAX_BYTES = 700 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;
export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_HINT = "PDF or Word, up to 700 KB";

export interface ResumeUpload {
  name: string;
  /** The file's bytes, base64 */
  data: string;
}

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
export const resumeType = (name: string) => TYPES[extensionOf(name)] ?? "application/octet-stream";

/** Null when the file is acceptable, otherwise what to tell the person. */
export function resumeProblem(name: string, bytes: number): string | null {
  if (!(RESUME_EXTENSIONS as readonly string[]).includes(extensionOf(name))) return "Please attach a PDF or Word file";
  if (bytes > RESUME_MAX_BYTES) return "That file is too large: please keep it under 700 KB";
  if (bytes === 0) return "That file is empty";
  return null;
}

/** Reads and checks a resume coming from the form (or null if it is not one). */
export function readResume(input: unknown): ResumeUpload | null {
  if (typeof input !== "object" || input === null) return null;
  const { name, data } = input as { name?: unknown; data?: unknown };
  if (typeof name !== "string" || typeof data !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) return null;
  const bytes = Math.floor((data.length * 3) / 4) - (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);
  const clean = name.replace(/[\\/\r\n"]/g, "").slice(0, 120);
  if (!clean || resumeProblem(clean, bytes)) return null;
  return { name: clean, data };
}
