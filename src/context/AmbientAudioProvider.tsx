import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { resolveTrackForPath, type AmbientTrack } from "@/lib/ambientAudio";

const STORAGE_KEY = "ambientAudio";
const FADE_MS = 1200;

type Ctx = {
  enabled: boolean;
  toggle: () => void;
  currentTrackId: string | null;
  blocked: boolean;
  reducedMotion: boolean;
};

const AmbientAudioContext = createContext<Ctx | null>(null);

export const useAmbientAudio = () => {
  const ctx = useContext(AmbientAudioContext);
  if (!ctx) throw new Error("useAmbientAudio must be used within AmbientAudioProvider");
  return ctx;
};

type Buffer = {
  el: HTMLAudioElement;
  trackId: string | null;
  cancelFade: (() => void) | null;
};

function fadeVolume(
  el: HTMLAudioElement,
  to: number,
  ms: number,
  onDone?: () => void,
): () => void {
  const from = el.volume;
  const start = performance.now();
  let raf = 0;
  let cancelled = false;
  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / ms);
    el.volume = Math.max(0, Math.min(1, from + (to - from) * t));
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  };
  raf = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}

export const AmbientAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const buffersRef = useRef<{ a: Buffer; b: Buffer } | null>(null);
  const activeRef = useRef<"a" | "b">("a");

  // Init audio elements once
  useEffect(() => {
    const make = (): Buffer => {
      const el = new Audio();
      el.loop = true;
      el.preload = "auto";
      el.volume = 0;
      el.crossOrigin = "anonymous";
      return { el, trackId: null, cancelFade: null };
    };
    buffersRef.current = { a: make(), b: make() };

    return () => {
      const bufs = buffersRef.current;
      if (bufs) {
        bufs.a.cancelFade?.();
        bufs.b.cancelFade?.();
        bufs.a.el.pause();
        bufs.b.el.pause();
        bufs.a.el.src = "";
        bufs.b.el.src = "";
      }
    };
  }, []);

  // prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  const stopAll = useCallback(() => {
    const bufs = buffersRef.current;
    if (!bufs) return;
    (["a", "b"] as const).forEach((k) => {
      const b = bufs[k];
      b.cancelFade?.();
      b.cancelFade = fadeVolume(b.el, 0, 200, () => {
        b.el.pause();
      });
    });
    setCurrentTrackId(null);
  }, []);

  const playTrack = useCallback(
    async (track: AmbientTrack) => {
      const bufs = buffersRef.current;
      if (!bufs) return;
      const activeKey = activeRef.current;
      const idleKey = activeKey === "a" ? "b" : "a";
      const active = bufs[activeKey];
      const idle = bufs[idleKey];

      // Same track already playing: just ensure correct volume
      if (active.trackId === track.id && !active.el.paused) {
        active.cancelFade?.();
        active.cancelFade = fadeVolume(active.el, track.volume, FADE_MS);
        return;
      }

      // Load idle buffer with new track
      idle.cancelFade?.();
      try {
        if (idle.el.src !== window.location.origin + track.src && !idle.el.src.endsWith(track.src)) {
          idle.el.src = track.src;
        }
        idle.el.loop = true;
        idle.el.volume = 0;
        idle.trackId = track.id;
        await idle.el.play();
        setBlocked(false);
      } catch (err) {
        setBlocked(true);
        return;
      }

      // Crossfade
      idle.cancelFade = fadeVolume(idle.el, track.volume, FADE_MS);
      if (active.trackId) {
        active.cancelFade?.();
        active.cancelFade = fadeVolume(active.el, 0, FADE_MS, () => {
          active.el.pause();
          active.trackId = null;
        });
      }

      activeRef.current = idleKey;
      setCurrentTrackId(track.id);
    },
    [],
  );

  // React to route changes
  useEffect(() => {
    if (!enabled) return;
    const track = resolveTrackForPath(location.pathname);
    if (!track) {
      stopAll();
      return;
    }
    playTrack(track);
  }, [enabled, location.pathname, playTrack, stopAll]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // ignore
      }
      if (!next) {
        stopAll();
      } else {
        // Kick off immediately within the user gesture
        const track = resolveTrackForPath(window.location.pathname);
        if (track) playTrack(track);
      }
      return next;
    });
  }, [playTrack, stopAll]);

  // Restore preference (does not auto-play; flagged as blocked until user clicks)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "on") setBlocked(true);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ enabled, toggle, currentTrackId, blocked, reducedMotion }),
    [enabled, toggle, currentTrackId, blocked, reducedMotion],
  );

  return <AmbientAudioContext.Provider value={value}>{children}</AmbientAudioContext.Provider>;
};
