import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { matchJobDescription, type JdMatchResult } from "@/services/jd-match-service";
import { projects } from "@/data/projects";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PROJECT_BY_ID = new Map(projects.map((p) => [p.id, p]));

const JdMatchSheet: React.FC<Props> = ({ open, onClose }) => {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JdMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
    return () => abortRef.current?.abort();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = useCallback(async () => {
    if (jd.trim().length < 20) {
      setError("Paste a longer job description (at least 20 characters).");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await matchJobDescription(jd.trim(), ctrl.signal);
      setResult(r);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [jd]);

  const reset = () => {
    setResult(null);
    setError(null);
    setJd("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const copyPitch = async () => {
    if (!result) return;
    const text = [
      "Tailored pitch — Suchandra Etti",
      ...result.pitch.map((p, i) => `${i + 1}. ${p}`),
      "",
      `Fit: ${result.roleFit}`,
      result.gaps.length ? `\nGaps: ${result.gaps.join(" / ")}` : "",
    ].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="jd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md"
            aria-hidden="true"
          />
          <motion.div
            key="jd-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Match a job description"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-[70] inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-12 md:bottom-12 md:w-[min(720px,92vw)] surface flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">Match a job description</h2>
                  <p className="text-[11px] text-muted-foreground">
                    Paste a JD — I'll return a tailored pitch grounded in real projects.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {!result && (
                <div className="space-y-3">
                  <label className="eyebrow eyebrow-accent block">Job description</label>
                  <textarea
                    ref={textareaRef}
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the JD here — role, responsibilities, requirements…"
                    rows={10}
                    disabled={loading}
                    className="w-full rounded-lg bg-card border border-white/[0.08] focus:border-primary/40 focus:ring-2 focus:ring-primary/20 outline-none px-4 py-3 text-sm leading-relaxed resize-y min-h-[180px] font-mono text-foreground placeholder:text-muted-foreground/50 transition-colors"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-muted-foreground">
                      {jd.trim().length} chars · stays on your device until you submit
                    </p>
                    <Button
                      onClick={submit}
                      disabled={loading || jd.trim().length < 20}
                      className="rounded-full"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Matching…</>
                      ) : (
                        <>Generate pitch <ArrowRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Fit line */}
                  {result.roleFit && (
                    <div>
                      <p className="eyebrow eyebrow-accent mb-2">Overall fit</p>
                      <p className="text-foreground text-base leading-relaxed">{result.roleFit}</p>
                    </div>
                  )}

                  {/* Pitch */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="eyebrow eyebrow-accent">Tailored pitch</p>
                      <button
                        onClick={copyPitch}
                        className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <ol className="space-y-2.5">
                      {result.pitch.map((p, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed">
                          <span className="font-mono text-primary text-xs pt-0.5 shrink-0">0{i + 1}</span>
                          <span className="text-foreground/90">{p}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Matching projects */}
                  {result.projectIds.length > 0 && (
                    <div>
                      <p className="eyebrow eyebrow-accent mb-3">Most relevant work</p>
                      <div className="space-y-2">
                        {result.projectIds.map((pid) => {
                          const proj = PROJECT_BY_ID.get(pid);
                          if (!proj) return null;
                          return (
                            <Link
                              key={pid}
                              to={`/projects/${pid}`}
                              onClick={onClose}
                              className="group block surface surface-hover px-4 py-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className="text-sm font-medium text-foreground">{proj.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{proj.description}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Skill matches */}
                  {result.skillMatches.length > 0 && (
                    <div>
                      <p className="eyebrow eyebrow-accent mb-3">Matching skills</p>
                      <div className="flex flex-wrap gap-2">
                        {result.skillMatches.map((s) => (
                          <span
                            key={s.skill}
                            title={s.reason}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs"
                          >
                            {s.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gaps */}
                  {result.gaps.length > 0 && (
                    <div>
                      <p className="eyebrow mb-2">Honest gaps</p>
                      <ul className="space-y-1.5">
                        {result.gaps.map((g, i) => (
                          <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                            <span className="text-muted-foreground/60">—</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={reset}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Try another JD
                    </button>
                    <Link
                      to="/contact"
                      onClick={onClose}
                      className={cn(
                        "inline-flex items-center gap-2 h-9 px-4 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
                      )}
                    >
                      Get in touch <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JdMatchSheet;
