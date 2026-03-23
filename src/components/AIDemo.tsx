import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";

const AIDemo = () => {
  const [agentActive, setAgentActive] = useState(false);

  const toggleAgent = () => {
    if (!agentActive) {
      // Open Vapi in a new window/tab — the mic button triggers it
      window.open(
        "https://vapi.ai?demo=true&shareKey=e663a366-f475-4185-875f-d3841fa1a9a4&assistantId=503990f1-ec84-494b-91b2-3f013c6c591c",
        "_blank",
        "noopener,noreferrer"
      );
    }
    setAgentActive((prev) => !prev);
  };

  // Auto-reset active state after 3s so user can re-tap
  useEffect(() => {
    if (!agentActive) return;
    const timer = setTimeout(() => setAgentActive(false), 3000);
    return () => clearTimeout(timer);
  }, [agentActive]);

  return (
    <section id="ai-demo" className="section-padding noise-overlay">
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
            Tap the mic, ask anything about Xiilio — our agent listens, thinks, and speaks back.
          </p>
        </motion.div>

        {/* Central mic button with 3D glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div
              className={`absolute -inset-6 rounded-full blur-[30px] transition-all duration-700 ${
                agentActive
                  ? "bg-primary/30 animate-pulse"
                  : "bg-primary/20"
              }`}
            />
            <div
              className={`absolute -inset-3 rounded-full blur-[15px] transition-all duration-500 ${
                agentActive
                  ? "bg-primary/25"
                  : "bg-primary/15"
              }`}
            />

            <button
              onClick={toggleAgent}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                agentActive
                  ? "bg-primary/20 text-primary scale-110"
                  : "bg-primary text-primary-foreground hover:scale-105"
              }`}
              style={{
                boxShadow: agentActive
                  ? "0 8px 32px -4px hsl(var(--primary) / 0.5), inset 0 -4px 12px hsl(var(--primary) / 0.2), inset 0 4px 8px hsl(0 0% 100% / 0.1)"
                  : "0 8px 32px -4px hsl(var(--primary) / 0.5), 0 2px 8px hsl(0 0% 0% / 0.3), inset 0 -4px 12px hsl(var(--primary) / 0.3), inset 0 4px 8px hsl(0 0% 100% / 0.2)",
              }}
              aria-label={agentActive ? "Agent launching..." : "Start voice agent"}
            >
              {agentActive && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const delay = i * 0.08;
                    return (
                      <span
                        key={i}
                        className="absolute w-1 rounded-full bg-current opacity-60"
                        style={{
                          height: "12px",
                          left: "50%",
                          top: "50%",
                          transformOrigin: "50% 0%",
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-38px)`,
                          animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out ${delay}s infinite alternate`,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {agentActive ? (
                <Volume2 className="w-8 h-8 md:w-10 md:h-10 relative z-10 animate-pulse drop-shadow-lg" />
              ) : (
                <Mic className="w-8 h-8 md:w-10 md:h-10 relative z-10 drop-shadow-lg" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center mb-6">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            {agentActive ? "Launching agent..." : "Tap to speak"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
