
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SEO from '@/components/seo/SEO';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-dvh flex flex-col">
      <SEO title="Page not found" description="The page you're looking for doesn't exist." path={location.pathname} />
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full relative"
        >
          {/* Animated background elements */}
          <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl animate-pulse"></div>
          <div className="absolute -z-10 inset-0">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-xl"></div>
          </div>
          
          <div className="glass-effect p-8 rounded-xl text-center relative z-10 border border-white/10 shadow-xl">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-6 mx-auto w-32 h-32"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-xl"></div>
              <div className="relative flex items-center justify-center h-full">
                <AlertCircle className="h-16 w-16 text-primary" />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="absolute text-7xl font-bold text-gradient"
                >
                  404
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              
              <p className="text-muted-foreground mb-8">
                Sorry, the page you're looking for doesn't exist or has been moved.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/" className="flex items-center justify-center w-full px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium hover:from-primary/90 hover:to-primary/70 transition-all">
                    <Home className="mr-2 h-4 w-4" /> Go Home
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button 
                    onClick={() => window.history.back()}
                    className="flex items-center justify-center w-full px-6 py-3 rounded-md glass-effect backdrop-blur-md text-foreground font-medium hover:bg-white/5 transition-all"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
    </div>
  );
};

export default NotFound;
