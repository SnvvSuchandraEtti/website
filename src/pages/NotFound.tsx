import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SEO from '@/components/seo/SEO';
import PageTransition from '@/components/ui/PageTransition';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col">
        <SEO 
          title="404 — Page not found" 
          description="The page you're looking for doesn't exist." 
          path={location.pathname} 
          noindex 
        />
        <Navbar />
        
        <main className="flex-grow flex items-center justify-center pt-24 pb-20 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md w-full"
          >
            <p className="font-mono text-sm text-muted-foreground mb-3" aria-hidden="true">
              Error 404
            </p>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-foreground mb-6">
              Not Found
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
              The page you are looking for doesn't exist, has been moved, or the link is broken.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 h-11 w-full sm:w-auto px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <Home className="h-4 w-4" aria-hidden="true" /> 
                Return Home
              </Link>
              
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 h-11 w-full sm:w-auto px-6 rounded-full bg-muted/40 border border-border text-foreground text-sm font-medium hover:bg-muted/60 hover:border-foreground/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> 
                Go Back
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
};

export default NotFound;
