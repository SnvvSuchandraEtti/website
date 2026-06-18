import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { certificates } from '@/data/certificates';

interface ViewerProps {
  pdfUrl?: string;
  title: string;
  onClose?: () => void;
  /** When true, viewer fills the entire screen (route mode). */
  standalone?: boolean;
}

const ZOOM_STEPS = [75, 100, 125, 150, 200, 300] as const;
type FitMode = 'width' | 'page';

const buildSrc = (url: string, zoom: number, fit: FitMode) => {
  // If user has zoomed off the default, honor the zoom level.
  // Otherwise fall back to fit-to-width / fit-to-page.
  // (PDF viewers ignore `zoom` when a `view=FitH|Fit` param is also present.)
  const frag =
    zoom === 100
      ? `view=${fit === 'width' ? 'FitH' : 'Fit'}`
      : `zoom=${zoom}`;
  return `${url}#${frag}&toolbar=0&navpanes=0`;
};

export const CertificateViewer: React.FC<ViewerProps> = ({
  pdfUrl,
  title,
  onClose,
  standalone,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [fit, setFit] = useState<FitMode>('width');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-' || e.key === '_') zoomOut();
      if (e.key.toLowerCase() === 'f')
        setFit((m) => (m === 'width' ? 'page' : 'width'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const zoomIn = () => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z);
      return next ?? z;
    });
  };
  const zoomOut = () => {
    setZoom((z) => {
      const lower = [...ZOOM_STEPS].reverse().find((s) => s < z);
      return lower ?? z;
    });
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${title}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag: any = standalone ? 'main' : 'div';
  const a11yProps = standalone
    ? { 'aria-label': `Certificate: ${title}` }
    : { role: 'dialog', 'aria-modal': true, 'aria-label': `Full view: ${title}` };

  return (
    <Tag
      className={
        standalone
          ? 'fixed inset-0 z-50 bg-background flex flex-col'
          : 'fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200'
      }
      {...a11yProps}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-14 border-b border-border bg-background/80">
        <div className="flex items-center gap-3 min-w-0">
          {standalone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <span className="truncate text-sm font-medium" title={title}>
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            aria-label="Zoom out"
            title="Zoom out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center text-muted-foreground">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-muted/60 mx-1" />

          <Button
            variant={fit === 'width' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFit('width')}
            title="Fit width (f)"
            className="text-xs"
          >
            <Maximize2 className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Width</span>
          </Button>
          <Button
            variant={fit === 'page' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFit('page')}
            title="Fit page (f)"
            className="text-xs"
          >
            <Minimize2 className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Page</span>
          </Button>

          <div className="w-px h-5 bg-muted/60 mx-1" />

          {pdfUrl && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(pdfUrl, '_blank')}
                aria-label="Open in new tab"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                aria-label="Download PDF"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* PDF surface */}
      <div className="flex-1 min-h-0 bg-neutral-900/40">
        {pdfUrl ? (
          <iframe
            src={buildSrc(pdfUrl, zoom, fit)}
            title={title}
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            PDF not available
          </div>
        )}
      </div>
    </Tag>
  );
};

/**
 * Standalone route wrapper used by /certificates/:id/view
 */
const CertificateFullViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cert = certificates.find((c) => c.id === id);

  useEffect(() => {
    if (!cert) navigate('/certificates', { replace: true });
  }, [cert, navigate]);

  if (!cert) return null;
  return (
    <CertificateViewer pdfUrl={cert.pdfUrl} title={cert.title} standalone />
  );
};

export default CertificateFullViewer;
