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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <SmoothTransition>
      <div className="relative min-h-dvh">
        {/* Single quiet ambient wash — no animated orbs, no particles */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 45% at 80% 0%, hsl(var(--primary) / 0.05), transparent 70%), radial-gradient(50% 40% at 10% 100%, hsl(var(--accent) / 0.04), transparent 70%)',
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

        <main className="relative">
          <HeroSection />
          <div className="section-divider"><AboutSection /></div>
          <div className="section-divider"><SkillsSection /></div>
          <div className="section-divider"><ProjectsSection /></div>
          <div className="section-divider"><ExperienceSection /></div>
          <div className="section-divider"><CertificatesSection /></div>
          <ChatbotButton />
        </main>

        <Footer />
      </div>
    </SmoothTransition>
  );
};

export default memo(Index);
