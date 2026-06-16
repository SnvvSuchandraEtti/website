import React, { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface Props {
  pdfUrl?: string;
  title: string;
  className?: string;
}

/**
 * Lightweight, lazy thumbnail of a PDF's first page for the certificates
 * listing grid. Uses IntersectionObserver to defer fetch/parse until near
 * the viewport. Aspect ratio of the actual page is preserved (object-contain
 * semantics) so both portrait and landscape certificates render correctly
 * inside the consistent fixed-height frame.
 */
const CertificatePdfThumb: React.FC<Props> = ({ pdfUrl, title, className }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Defer load until near viewport
  useEffect(() => {
    if (!wrapperRef.current || !pdfUrl) return;
    const el = wrapperRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pdfUrl]);

  useEffect(() => {
    if (!visible || !pdfUrl) return;
    cancelledRef.current = false;

    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = await (pdfjsLib as any).getDocument({ url: pdfUrl }).promise;
        if (cancelledRef.current) return;
        const page = await doc.getPage(1);
        if (cancelledRef.current) return;

        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrapper || !canvas) return;

        const vp1 = page.getViewport({ scale: 1 });
        const ratio = vp1.width / vp1.height;

        const boxW = wrapper.clientWidth;
        const boxH = wrapper.clientHeight;
        // Fit (contain) within the frame, preserving aspect ratio
        const fitScale =
          ratio > boxW / boxH ? boxW / vp1.width : boxH / vp1.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const viewport = page.getViewport({ scale: fitScale * dpr });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
        if (!cancelledRef.current) setLoaded(true);
      } catch (err) {
        console.warn('[CertificatePdfThumb] render failed', err);
        if (!cancelledRef.current) setErrored(true);
      }
    })();

    return () => {
      cancelledRef.current = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [visible, pdfUrl]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden bg-white/[0.03] border-b border-white/[0.06]',
        className,
      )}
    >
      {pdfUrl ? (
        <>
          <canvas
            ref={canvasRef}
            className={cn(
              'block transition-opacity duration-300 shadow-sm',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            aria-label={`${title} — first page preview`}
          />
          {!loaded && !errored && (
            <div className="absolute inset-0 animate-pulse bg-white/[0.02]" />
          )}
          {errored && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
              <FileText className="h-8 w-8" />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground/50">
          <FileText className="h-8 w-8 mb-1.5" />
          <span className="text-[10px] font-mono uppercase tracking-wider">No PDF</span>
        </div>
      )}
    </div>
  );
};

export default CertificatePdfThumb;
