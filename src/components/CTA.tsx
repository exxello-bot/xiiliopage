import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

const CTA = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <section ref={ref} id="contact" className="section-padding relative overflow-hidden noise-overlay">
      {/* Glow background with parallax */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px]"
      />

      <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-8xl leading-[0.9] mb-6"
        >
          READY TO
          <br />
          <span className="text-primary text-glow">SCALE?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-body text-muted-foreground text-lg mb-10 max-w-xl mx-auto"
        >
          Book a free strategy call. We'll audit your current setup and show you 
          exactly where AI + paid media can unlock your next level of growth.
        </motion.p>

        <motion.a
          href="#contact-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-body font-bold px-10 py-5 rounded-sm text-sm uppercase tracking-widest hover:box-glow transition-all duration-300"
        >
          Get Your Free Growth Audit
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default CTA;
