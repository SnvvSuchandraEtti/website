import { describe, it, expect } from "vitest";
import { annotateCitations, type Citation } from "@/services/openai-service";

const citations: Citation[] = [
  { id: "P1", category: "project", label: "HOOT 2.0", snippet: "EdTech" },
  { id: "S1", category: "skill", label: "Mobile", snippet: "Flutter" },
];

describe("annotateCitations", () => {
  it("returns text unchanged when no citations", () => {
    const r = annotateCitations("hello", []);
    expect(r.text).toBe("hello");
    expect(r.ordered).toEqual([]);
  });

  it("renumbers inline tags in citation order", () => {
    const { text, ordered } = annotateCitations(
      "Built HOOT [P1]. Uses Flutter [S1]. Also HOOT [P1].",
      citations
    );
    expect(text).toContain("`[1]`");
    expect(text).toContain("`[2]`");
    expect(ordered.map((c) => c.id)).toEqual(["P1", "S1"]);
  });

  it("drops unknown ids", () => {
    const { text, ordered } = annotateCitations("Test [Z9]", citations);
    expect(text).toBe("Test");
    expect(ordered).toEqual([]);
  });
});
