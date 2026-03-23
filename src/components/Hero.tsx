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
      {/* Grid background with parallax */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }} className="absolute inset-0 grid-bg opacity-40" />
      
      {/* Glowing orb with parallax */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow"
      />

      <motion.div style={{ y, opacity }} className="relative z-10 section-padding text-center max-w-6xl mx-auto">
        {/* Logo with glowing pulsing background - seamlessly merged */}
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
            style={{ mixBlendMode: 'screen' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-6"
        >
          AI-Powered Growth Agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tight text-glow"
        >
          WE BUILD
          <br />
          <span className="text-primary">MACHINES</span>
          <br />
          THAT SELL
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-8 mb-12"
        >
          AI automations, performance marketing & revenue systems 
          that turn clicks into customers — at scale.
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
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
