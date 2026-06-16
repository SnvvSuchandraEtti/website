import React, { useEffect, useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type Orientation = 'portrait' | 'landscape';

interface AdaptivePdfViewerProps {
  pdfUrl?: string;
  title: string;
  className?: string;
  orientationHint?: Orientation;
  onOrientationDetected?: (o: Orientation) => void;
}

/**
 * Renders page 1 of the PDF to a <canvas> using PDF.js. The container's
 * aspect ratio is set from the real page viewport so the preview always
 * fills the box with no empty space and no scrollbars. The full-screen
 * viewer (separate component) handles zoom/scroll via iframe.
 */
const AdaptivePdfViewer: React.FC<AdaptivePdfViewerProps> = ({
  pdfUrl,
  title,
  className,
  orientationHint = 'portrait',
  onOrientationDetected,
}) => {
  const fallbackRatio = orientationHint === 'landscape' ? 1.414 : 1 / 1.414;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  const [aspectRatio, setAspectRatio] = useState<number>(fallbackRatio);
  const [loading, setLoading] = useState<boolean>(!!pdfUrl);
  const [errored, setErrored] = useState<boolean>(false);

  // Load PDF + page 1 once per url
  useEffect(() => {
    cancelledRef.current = false;
    pageRef.current = null;
    setErrored(false);
    if (!pdfUrl) {
      setLoading(false);
      return;
    }
    setLoading(true);

    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = await (pdfjsLib as any).getDocument({ url: pdfUrl }).promise;
        if (cancelledRef.current) return;
        const page = await doc.getPage(1);
        if (cancelledRef.current) return;
        pageRef.current = page;

        const vp = page.getViewport({ scale: 1 });
        const ratio = vp.width / vp.height;
        setAspectRatio(ratio);
        onOrientationDetected?.(ratio >= 1 ? 'landscape' : 'portrait');

        await renderToCanvas();
      } catch (err) {
        console.warn('[AdaptivePdfViewer] render failed', err);
        if (!cancelledRef.current) setErrored(true);
      } finally {
        if (!cancelledRef.current) setLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // Re-render the canvas at the wrapper's current width
  const renderToCanvas = async () => {
    const page = pageRef.current;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!page || !canvas || !wrapper) return;

    const cssWidth = wrapper.clientWidth;
    if (cssWidth <= 0) return;

    const vp1 = page.getViewport({ scale: 1 });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scale = (cssWidth / vp1.width) * dpr;
    const viewport = page.getViewport({ scale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore
      }
    }
    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
    } catch {
      /* cancelled */
    }
  };

  // Re-render on resize
  useEffect(() => {
    if (!wrapperRef.current) return;
    let timer: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pageRef.current) renderToCanvas();
      }, 120);
    });
    ro.observe(wrapperRef.current);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [pdfUrl]);

  if (!pdfUrl) {
    return (
      <div
        className={cn(
          'border border-dashed border-white/[0.1] rounded-xl p-10 text-center bg-white/[0.02]',
          className,
        )}
      >
        <FileText className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">PDF not yet uploaded</p>
      </div>
    );
  }

  const isLandscape = aspectRatio >= 1;

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={wrapperRef}
        className={cn(
          'mx-auto rounded-xl overflow-hidden border border-white/[0.08] bg-white relative',
          isLandscape ? 'max-w-full' : 'max-w-[640px]',
        )}
        style={{ aspectRatio }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" aria-label={`${title} — preview`} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {errored && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Preview unavailable — use "View full certificate".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptivePdfViewer;
