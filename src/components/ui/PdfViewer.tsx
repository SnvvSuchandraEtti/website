import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize,
  X,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PdfViewerProps {
  pdfUrl: string | null;
  title: string;
  className?: string;
  showControls?: boolean;
  onClose?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  pdfUrl,
  title,
  className,
  showControls = true,
  onClose
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = () => {
    if (!pdfUrl) {
      toast({
        title: "Download Error",
        description: "PDF file not available for download",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `Downloading ${title} certificate`,
    });
  };

  const handleExternalOpen = () => {
    if (!pdfUrl) {
      toast({
        title: "Error",
        description: "PDF file not available",
        variant: "destructive",
      });
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  if (!pdfUrl) {
    return (
      <div className={cn(
        "border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center",
        className
      )}>
        <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          PDF Not Available
        </h3>
        <p className="text-sm text-muted-foreground">
          The certificate PDF will be available once uploaded to the assets folder.
        </p>
      </div>
    );
  }

  const ViewerContent = () => (
    <div className={cn(
      "relative bg-background border border-border rounded-lg overflow-hidden",
      isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : className
    )}>
      {showControls && (
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm truncate max-w-[200px]" title={title}>
              {title}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-xs font-medium px-2 min-w-[60px] text-center">
              {zoom}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExternalOpen}
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <X className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '600px' }}>
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#zoom=${zoom}`}
          className="w-full h-full border-0"
          title={`${title} Certificate PDF`}
          loading="lazy"
        />
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40"
          onClick={toggleFullscreen}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-50"
          style={{ inset: '1rem' }}
        >
          <ViewerContent />
        </motion.div>
      </AnimatePresence>
    );
  }

  return <ViewerContent />;
};

export default PdfViewer;