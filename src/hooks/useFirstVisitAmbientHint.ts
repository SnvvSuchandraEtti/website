import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAmbientAudio } from "@/context/AmbientAudioProvider";

const HINT_KEY = "ambientHintShown";
const HINT_DELAY_MS = 2500;

/**
 * Shows a one-time "ambient mode available" hint on first visit.
 * No-op when reduced motion is on, ambient is already enabled, or the hint
 * was previously dismissed.
 */
export function useFirstVisitAmbientHint() {
  const { toggle, reducedMotion, enabled } = useAmbientAudio();

  // Keep the latest toggle reference without re-running the effect.
  const toggleRef = useRef(toggle);
  toggleRef.current = toggle;

  useEffect(() => {
    if (reducedMotion || enabled) return;

    try {
      if (localStorage.getItem(HINT_KEY)) return;
    } catch {
      return;
    }

    const t = window.setTimeout(() => {
      toast("Ambient mode available", {
        description: "Subtle audio per section. Click the speaker in the nav.",
        duration: 6000,
        action: {
          label: "Enable",
          onClick: () => toggleRef.current(),
        },
      });
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {
        /* storage unavailable — ignore */
      }
    }, HINT_DELAY_MS);

    return () => window.clearTimeout(t);
  }, [reducedMotion, enabled]);
}
