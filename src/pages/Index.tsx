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
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => {
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
      <Process />
      <Results />
      <CRMAnimation />
      <AIDemo />
      <Testimonials />
      <CTA />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
