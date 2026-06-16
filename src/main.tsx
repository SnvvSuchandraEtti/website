import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Lock the document to dark mode at boot; light mode and system theme are
// intentionally not supported in this portfolio.
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
  document.documentElement.style.colorScheme = 'dark';
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
