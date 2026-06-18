import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAmbientAudio } from "@/context/AmbientAudioProvider";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  className?: string;
}

const AmbientToggle: React.FC<Props> = ({ className }) => {
  const { enabled, toggle, reducedMotion } = useAmbientAudio();
  if (reducedMotion) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={enabled}
          aria-label={enabled ? "Disable ambient mode" : "Enable ambient mode"}
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 rounded-md",
            "border border-border text-muted-foreground",
            "hover:text-foreground hover:bg-muted transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            enabled && "text-foreground bg-muted",
            className,
          )}
        >
          {enabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        Ambient mode {enabled ? "on" : "off"}
      </TooltipContent>
    </Tooltip>
  );
};

export default AmbientToggle;
