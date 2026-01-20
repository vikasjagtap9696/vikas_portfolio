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
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { SectionIndicator } from "@/components/portfolio/SectionIndicator";
import { ScrollToTop } from "@/components/portfolio/ScrollToTop";
import { ParallaxSection } from "@/components/portfolio/ParallaxSection";

const Index = () => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      <ScrollProgress />
      <SectionIndicator />
      <ScrollToTop />
      <CursorTrail />
      <Navbar />
      <Hero />
      <ParallaxSection variant="circles">
        <About />
      </ParallaxSection>
      <ParallaxSection variant="blobs">
        <Skills />
      </ParallaxSection>
      <ParallaxSection variant="dots">
        <Projects />
      </ParallaxSection>
      <ParallaxSection variant="gradient">
        <Experience />
      </ParallaxSection>
      <ParallaxSection variant="circles">
        <Certificates />
      </ParallaxSection>
      <ParallaxSection variant="blobs">
        <Resume />
      </ParallaxSection>
      <ParallaxSection variant="gradient">
        <Contact />
      </ParallaxSection>
      <Footer />
      <AIChatbot />
      <AdminToolbar />
    </div>
  );
};

export default Index;
