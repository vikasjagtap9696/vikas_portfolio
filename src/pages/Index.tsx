import { useState } from "react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { Certificates } from "@/components/portfolio/Certificates";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { AIChatbot } from "@/components/portfolio/AIChatbot";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { CursorTrail } from "@/components/portfolio/CursorTrail";
import CustomCursor from "@/components/portfolio/CustomCursor";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { SectionIndicator } from "@/components/portfolio/SectionIndicator";
import { ScrollToTop } from "@/components/portfolio/ScrollToTop";
import { ParallaxSection } from "@/components/portfolio/ParallaxSection";
import { LoadingScreen } from "@/components/portfolio/LoadingScreen";
import SkipToContent from "@/components/portfolio/SkipToContent";
import ScrollReveal from "@/components/portfolio/ScrollReveal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <SkipToContent />
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <div 
        className={`page-content ${!isLoading ? "loaded" : ""}`}
        style={{ 
          minHeight: "100vh", 
          background: "var(--color-background)",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease 0.3s",
        }}
      >
        <ScrollProgress />
        <SectionIndicator />
        <ScrollToTop />
        <CursorTrail />
        <CustomCursor />
        <Navbar />
        <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
          <Hero />
          <ScrollReveal animation="fade-up">
            <ParallaxSection variant="circles">
              <About />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <ParallaxSection variant="blobs">
              <Skills />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <ParallaxSection variant="dots">
              <Projects />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <ParallaxSection variant="gradient">
              <Experience />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <ParallaxSection variant="circles">
              <Certificates />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <ParallaxSection variant="blobs">
              <Resume />
            </ParallaxSection>
          </ScrollReveal>
          <ScrollReveal animation="fade-up">
            <ParallaxSection variant="gradient">
              <Contact />
            </ParallaxSection>
          </ScrollReveal>
        </main>
        <Footer />
        <AIChatbot />
        <AdminToolbar />
      </div>
    </>
  );
};

export default Index;
