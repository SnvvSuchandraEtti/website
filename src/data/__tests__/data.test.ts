import { describe, it, expect } from "vitest";
import { projects } from "@/data/projects";
import { certificates } from "@/data/certificates";

describe("portfolio data", () => {
  it("has projects with required fields", () => {
    expect(projects.length).toBeGreaterThan(0);
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(Array.isArray(p.technologies)).toBe(true);
    }
  });

  it("has unique project ids", () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique certificate ids", () => {
    const ids = certificates.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
