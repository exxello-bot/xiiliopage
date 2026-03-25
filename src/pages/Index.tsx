import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Lazy load below-fold sections
const VideoSection = lazy(() => import("@/components/VideoSection"));
const StatsBar = lazy(() => import("@/components/StatsBar"));
const About = lazy(() => import("@/components/About"));
const Marquee = lazy(() => import("@/components/Marquee"));
const Services = lazy(() => import("@/components/Services"));
const AIAgents = lazy(() => import("@/components/AIAgents"));
const Process = lazy(() => import("@/components/Process"));
const Results = lazy(() => import("@/components/Results"));
const CRMAnimation = lazy(() => import("@/components/CRMAnimation"));
const AIDemo = lazy(() => import("@/components/AIDemo"));
const SecurityPlatform = lazy(() => import("@/components/SecurityPlatform"));
const Pricing = lazy(() => import("@/components/Pricing"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CTA = lazy(() => import("@/components/CTA"));
const ContactForm = lazy(() => import("@/components/ContactForm"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <VideoSection />
        <StatsBar />
        <About />
        <Marquee />
        <Services />
        <AIAgents />
        <AIDemo />
        <Process />
        <Results />
        <CRMAnimation />
        <SecurityPlatform />
        <Pricing />
        <Testimonials />
        <CTA />
        <ContactForm />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
