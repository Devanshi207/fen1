import { describe, expect, it } from "vitest";
import { readResume, resumeProblem, RESUME_MAX_BYTES } from "@/lib/resume";
import { saveEnquiry } from "@/lib/inbox";
import { _fileStoreForTests } from "@/lib/store";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("resumes", () => {
  it("accepts PDF and Word files under the size limit, and nothing else", () => {
    expect(resumeProblem("cv.pdf", 1000)).toBeNull();
    expect(resumeProblem("cv.DOCX", 1000)).toBeNull();
    expect(resumeProblem("cv.exe", 1000)).not.toBeNull();
    expect(resumeProblem("cv.pdf", RESUME_MAX_BYTES + 1)).not.toBeNull();
    expect(resumeProblem("cv.pdf", 0)).not.toBeNull();
  });

  it("reads an upload from the form, strips path characters from the name and rejects bad data", () => {
    expect(readResume({ name: "a/b\cv.pdf", data: btoa("hello") })).toEqual({ name: "abcv.pdf", data: btoa("hello") });
    expect(readResume({ name: "cv.pdf", data: "not base64!" })).toBeNull();
    expect(readResume({ name: "cv.exe", data: btoa("hello") })).toBeNull();
    expect(readResume(null)).toBeNull();
  });

  it("keeps the file with the application, under the same id, and notes its name in the details", async () => {
    const store = _fileStoreForTests(join(tmpdir(), `fen1-resume-${Date.now()}.json`));
    const saved = await saveEnquiry(store, { kind: "careers", name: "A", company: "", email: "a@b.co", phone: "1", message: "", details: { role: "Estimator" } }, new Date(), { name: "cv.pdf", data: btoa("hello") });
    expect(saved.details).toEqual({ role: "Estimator", resume: "cv.pdf" });
    expect(await store.get("resumes", saved.id)).toEqual({ name: "cv.pdf", data: btoa("hello") });
  });
});
