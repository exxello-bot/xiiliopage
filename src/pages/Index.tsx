import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import StatsBar from "@/components/StatsBar";
import About from "@/components/About";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import AIAgents from "@/components/AIAgents";
import Process from "@/components/Process";
import Results from "@/components/Results";
import CRMAnimation from "@/components/CRMAnimation";
import AIDemo from "@/components/AIDemo";
import SecurityPlatform from "@/components/SecurityPlatform";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
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
    </div>
  );
};

export default Index;
