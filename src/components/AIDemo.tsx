import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = "e663a366-f475-4185-875f-d3841fa1a9a4";
const ASSISTANT_ID = "503990f1-ec84-494b-91b2-3f013c6c591c";

const AIDemo = () => {
  const [agentActive, setAgentActive] = useState(false);
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);

  const toggleAgent = useCallback(() => {
    if (agentActive) {
      // Stop the call
      vapiRef.current?.stop();
      setAgentActive(false);
    } else {
      // Start inline voice call
      if (!vapiRef.current) {
        vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

        vapiRef.current.on("call-start", () => setAgentActive(true));
        vapiRef.current.on("call-end", () => setAgentActive(false));
        vapiRef.current.on("error", (err) => {
          console.error("Vapi error:", err);
          setAgentActive(false);
        });
      }

      setAgentActive(true);
      const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const systemPrompt = `You are Aria, a friendly and professional AI voice assistant for Xiilio.ai — an enterprise-grade AI marketing agency (tagline: "working 24twelve"). Today's date is ${today}.

YOUR SOLE PURPOSE:
- Answer questions ONLY about Xiilio, its services, and its team.
- Book follow-up appointments with a Xiilio team member for the caller.
- You must NOT discuss topics unrelated to Xiilio. Politely redirect any off-topic questions back to Xiilio's services or booking an appointment.

XIILIO SERVICES:
- AI-powered lead generation and autonomous marketing
- Performance marketing and paid media management
- AI agent deployment for sales and customer engagement
- Full-funnel strategy and conversion design
- GDPR-compliant, proprietary shield architecture
- Rapid 24-48 hour deployment

TEAM MEMBERS (for booking appointments):
UK-based: Mark, Carl, Maddy
USA-based: Nick, Don, CJ, Theo

When booking, ask the caller:
1. Their name and company
2. Preferred date and time (remind them today is ${today})
3. Whether they prefer a UK or USA team member, then suggest available names
4. Their email for confirmation

Always be warm, concise, and professional. Introduce yourself as Aria. Never pretend to be human. Never discuss competitors or unrelated services.`;

      vapiRef.current.start(ASSISTANT_ID, {
        variableValues: { current_date: today },
        firstMessage: `Hi, I'm Aria from Xiilio. Today is ${today}. How can I help you?`,
        model: {
          provider: "openai" as const,
          model: "gpt-4o",
          messages: [{ role: "system" as const, content: systemPrompt }],
        },
      });
    }
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
            MEET <span className="text-primary">ARIA</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Tap the mic to speak with Aria — she'll answer your questions about Xiilio and book a call with our team.
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
                  ? "bg-blue-400/30 animate-pulse"
                  : "bg-blue-400/20"
              }`}
            />
            <div
              className={`absolute -inset-3 rounded-full blur-[15px] transition-all duration-500 ${
                agentActive
                  ? "bg-blue-400/25"
                  : "bg-blue-400/15"
              }`}
            />

            <button
              onClick={toggleAgent}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 text-white ${
                agentActive
                  ? "scale-110"
                  : "hover:scale-105"
              }`}
              style={{
                background: agentActive
                  ? "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(148,163,184,0.2))"
                  : "linear-gradient(135deg, #60a5fa, #94a3b8, #3b82f6)",
                boxShadow: agentActive
                  ? "0 8px 32px -4px rgba(96,165,250,0.5), inset 0 -4px 12px rgba(96,165,250,0.2), inset 0 4px 8px rgba(255,255,255,0.1)"
                  : "0 8px 32px -4px rgba(96,165,250,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 -4px 12px rgba(59,130,246,0.3), inset 0 4px 8px rgba(255,255,255,0.2)",
              }}
              aria-label={agentActive ? "Stop Aria" : "Talk to Aria"}
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
            {agentActive ? "Aria is listening — speak now" : "Tap to speak with Aria"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
