import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import xiilioLogo from "@/assets/xiilio-logo.png";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay bg-background">
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }} className="absolute inset-0 grid-bg opacity-40" />
      
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow"
      />

      <motion.div style={{ y, opacity }} className="relative z-10 section-padding text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center mb-8"
        >
          <div className="absolute w-80 h-80 rounded-full bg-primary/15 blur-[100px] animate-pulse-glow" />
          <div className="absolute w-52 h-52 rounded-full bg-primary/25 blur-[60px] animate-pulse" />
          <div className="absolute w-36 h-36 rounded-full bg-primary/10 blur-[30px] animate-ping" style={{ animationDuration: '3s' }} />
          <img
            src={xiilioLogo}
            alt="Xiilio logo"
            className="relative w-42 h-42 object-contain"
            style={{
              mixBlendMode: 'screen',
              maskImage: 'radial-gradient(ellipse 65% 60% at center, black 30%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at center, black 30%, transparent 90%)',
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-6"
        >
          AI-Driven Lead Generation Agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight text-glow"
        >
          THE NEXT TOP
          <br />
          <span className="text-primary">PERFORMER</span>
          <br />
          ISN'T HUMAN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-8 mb-12"
        >
          AI agents, performance marketing & autonomous growth systems
          that operate 24/7 — delivering measurable results from day one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group flex items-center gap-2 bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-sm text-sm uppercase tracking-widest hover:box-glow transition-all duration-300"
          >
            Book a Strategy Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#services"
            className="font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-8 py-4 border border-border rounded-sm hover:border-glow"
          >
            See Our Work
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Get it now on</p>
          <div className="flex items-center gap-3">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="#4285F4"/>
                <path d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z" fill="#34A853"/>
                <path d="M17.698 9.508l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 13l2.302-2.492z" fill="#FBBC04"/>
                <path d="M5.864 2.658L16.8 9.99l-2.302 2.302L5.864 2.658z" fill="#EA4335"/>
              </svg>
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-foreground">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
