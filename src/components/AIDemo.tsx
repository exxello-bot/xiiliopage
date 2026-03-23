import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";

const VAPI_DEMO_URL =
  "https://vapi.ai?demo=true&shareKey=e663a366-f475-4185-875f-d3841fa1a9a4&assistantId=503990f1-ec84-494b-91b2-3f013c6c591c";

const AIDemo = () => {
  const [showAgent, setShowAgent] = useState(false);

  const toggleAgent = () => setShowAgent((prev) => !prev);

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
            {/* Ambient glow layers */}
            <div
              className={`absolute -inset-6 rounded-full blur-[30px] transition-all duration-700 ${
                showAgent
                  ? "bg-primary/30 animate-pulse"
                  : "bg-primary/20"
              }`}
            />
            <div
              className={`absolute -inset-3 rounded-full blur-[15px] transition-all duration-500 ${
                showAgent
                  ? "bg-primary/25"
                  : "bg-primary/15"
              }`}
            />

            <button
              onClick={toggleAgent}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                showAgent
                  ? "bg-primary/20 text-primary scale-110"
                  : "bg-primary text-primary-foreground hover:scale-105"
              }`}
              style={{
                boxShadow: showAgent
                  ? "0 8px 32px -4px hsl(var(--primary) / 0.5), inset 0 -4px 12px hsl(var(--primary) / 0.2), inset 0 4px 8px hsl(0 0% 100% / 0.1)"
                  : "0 8px 32px -4px hsl(var(--primary) / 0.5), 0 2px 8px hsl(0 0% 0% / 0.3), inset 0 -4px 12px hsl(var(--primary) / 0.3), inset 0 4px 8px hsl(0 0% 100% / 0.2)",
              }}
              aria-label={showAgent ? "Close voice agent" : "Start voice agent"}
            >
              {/* Waveform bars when active */}
              {showAgent && (
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
              {showAgent ? (
                <Volume2 className="w-8 h-8 md:w-10 md:h-10 relative z-10 animate-pulse drop-shadow-lg" />
              ) : (
                <Mic className="w-8 h-8 md:w-10 md:h-10 relative z-10 drop-shadow-lg" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center mb-6">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            {showAgent ? "Agent active — speak now" : "Tap to speak"}
          </p>
        </div>

        {/* Vapi agent embed — shown when mic is tapped */}
        {showAgent && (
          <motion.div
            initial={{ opacity: 0, y: 30, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 30, height: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-sm overflow-hidden border border-border"
          >
            <iframe
              src={VAPI_DEMO_URL}
              title="Xiilio AI Voice Agent"
              className="w-full h-[500px] md:h-[600px] bg-card"
              allow="microphone"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AIDemo;
