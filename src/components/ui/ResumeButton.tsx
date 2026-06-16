import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ResumeButtonProps {
  className?: string;
  resumeUrl?: string;
}

const DRIVE_FILE_ID = '1cuPFyM5g54188X2fGUGGPn7Y6CTDq67u';
const DRIVE_PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;
const DRIVE_VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=drive_link`;
const DRIVE_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;

const ResumeButton: React.FC<ResumeButtonProps> = ({ className, resumeUrl = DRIVE_VIEW_URL }) => {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      <motion.button
        type="button"
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
          'bg-card/60 border border-border/60 text-foreground',
          'hover:bg-card hover:border-border transition-colors',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          className,
        )}
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        <span className="font-medium text-sm">Resume</span>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-border/60 flex-row items-center justify-between space-y-0 gap-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              Resume
            </DialogTitle>
            <div className="flex items-center gap-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open
              </a>
              <a
                href={DRIVE_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" /> Download
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-black/40">
            <iframe
              src={DRIVE_PREVIEW_URL}
              title="Resume preview"
              loading="lazy"
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeButton;
