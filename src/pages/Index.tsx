import React, { useEffect, memo } from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import SkillsSection from '@/components/home/SkillsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import ExperienceSection from '@/components/home/ExperienceSection';
import CertificatesSection from '@/components/home/CertificatesSection';
import ChatbotButton from '@/components/ui/ChatbotButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothTransition from '@/components/ui/SmoothTransition';
import SEO from '@/components/seo/SEO';

const Index: React.FC = () => {
  // Ensure we start at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothTransition>
      <div className="relative min-h-dvh flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
        {/*
          Quiet ambient wash.
          Strictly minimal, no intense glows or animations.
        */}
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              background: `
                radial-gradient(circle at 80% 0%, hsl(var(--primary)), transparent 40%),
                radial-gradient(circle at 20% 100%, hsl(var(--accent)), transparent 40%)
              `,
              filter: 'blur(100px)',
            }}
          />
        </div>

        <SEO
          title="Suchandra Etti — Full-Stack & Mobile Developer"
          description="Portfolio of Suchandra Etti — Flutter, React, Node and AI projects shipped to 28K+ users."
          path="/"
          ogType="profile"
        />

        <Navbar />

        <main className="relative flex-grow">
          <HeroSection />
          <div className="section-divider"><AboutSection /></div>
          <div className="section-divider"><SkillsSection /></div>
          <div className="section-divider"><ProjectsSection /></div>
          <div className="section-divider"><ExperienceSection /></div>
          <div className="section-divider"><CertificatesSection /></div>
        </main>

        <Footer />

        <ChatbotButton />
      </div>
    </SmoothTransition>
  );
};

export default memo(Index);
