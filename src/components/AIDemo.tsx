import { motion } from "framer-motion";
import { useRef } from "react";

const VAPI_DEMO_URL =
  "https://vapi.ai?demo=true&shareKey=e663a366-f475-4185-875f-d3841fa1a9a4&assistantId=503990f1-ec84-494b-91b2-3f013c6c591c";

const AIDemo = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="ai-demo" className="section-padding noise-overlay">
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Live Demo
          </p>
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            TALK TO OUR <span className="text-primary">AI AGENT</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Speak with our AI growth agent — ask anything about Xiilio's services, AI-powered lead generation, or how we can scale your business.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-sm overflow-hidden border border-border"
        >
          <iframe
            src={VAPI_DEMO_URL}
            title="Xiilio AI Voice Agent"
            className="w-full h-[500px] md:h-[600px] bg-card"
            allow="microphone"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AIDemo;
