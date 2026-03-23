import { motion } from "framer-motion";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import agent4 from "@/assets/agent-4.jpg";
import agent5 from "@/assets/agent-5.jpg";
import agent6 from "@/assets/agent-6.jpg";

// Each agent gets a unique idle animation pattern + eye position for glow effect
const agents = [
  { img: agent1, name: "NOVA", role: "Lead Generation Agent", anim: { x: [0, 8, -4, 0], y: [0, -6, 3, 0], rotate: [0, 1.5, -1, 0], scale: [1, 1.06, 1.03, 1], duration: 8 }, scanDelay: 0, eyes: { x: "50%", y: "35%" } },
  { img: agent2, name: "ARIA", role: "Conversational AI Agent", anim: { x: [0, -6, 5, 0], y: [0, 4, -5, 0], rotate: [0, -2, 1.5, 0], scale: [1, 1.04, 1.07, 1], duration: 10 }, scanDelay: 1.5, eyes: { x: "50%", y: "35%" } },
  { img: agent3, name: "CORTEX", role: "Analytics & Insights Agent", anim: { x: [0, 5, -7, 0], y: [0, -3, 6, 0], rotate: [0, 1, -2, 0], scale: [1, 1.05, 1.02, 1], duration: 9 }, scanDelay: 3, eyes: { x: "50%", y: "35%" } },
  { img: agent4, name: "NEXUS", role: "Automation Agent", anim: { x: [0, -4, 6, 0], y: [0, 5, -4, 0], rotate: [0, -1.5, 2, 0], scale: [1, 1.07, 1.04, 1], duration: 11 }, scanDelay: 0.8, eyes: { x: "50%", y: "35%" } },
  { img: agent5, name: "SENTINEL", role: "Ad Targeting Agent", anim: { x: [0, 7, -3, 0], y: [0, -5, 4, 0], rotate: [0, 2, -1.5, 0], scale: [1, 1.03, 1.06, 1], duration: 7 }, scanDelay: 2.2, eyes: { x: "50%", y: "35%" } },
  { img: agent6, name: "HERALD", role: "Outreach & Engagement Agent", anim: { x: [0, -5, 4, 0], y: [0, 3, -6, 0], rotate: [0, -1, 1.8, 0], scale: [1, 1.06, 1.03, 1], duration: 12 }, scanDelay: 4, eyes: { x: "50%", y: "35%" } },
];

const AIAgents = () => {
  return (
    <section id="agents" className="section-padding noise-overlay">
      {/* Scan-line keyframes */}
      <style>{`
        @keyframes scanline-sweep {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Meet The Team
          </p>
          <h2 className="font-display text-5xl md:text-7xl">
            OUR <span className="text-primary">AI AGENTS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="group relative overflow-hidden rounded-sm border border-border hover:border-glow transition-all duration-500 hover:box-glow"
            >
              {/* Glowing pulse overlay on hover */}
              <div className="absolute inset-0 z-10 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ boxShadow: "inset 0 0 40px hsl(40 90% 55% / 0.1), 0 0 60px hsl(40 90% 55% / 0.08)" }}
              />
              <div className="absolute inset-0 z-10 rounded-sm opacity-0 group-hover:opacity-100 group-hover:animate-pulse-glow pointer-events-none bg-primary/5" />

              {/* Scan-line sweep effect */}
              <div
                className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, hsl(40 90% 55% / 0.8) 30%, hsl(40 90% 55% / 1) 50%, hsl(40 90% 55% / 0.8) 70%, transparent 100%)',
                  boxShadow: '0 0 15px 4px hsl(40 90% 55% / 0.4), 0 0 30px 8px hsl(40 90% 55% / 0.15)',
                  animation: `scanline-sweep 4s ease-in-out infinite`,
                  animationDelay: `${agent.scanDelay}s`,
                }}
              />

              <div className="aspect-square overflow-hidden relative">
                <motion.img
                  src={agent.img}
                  alt={`${agent.name} - ${agent.role}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  animate={{
                    x: agent.anim.x,
                    y: agent.anim.y,
                    rotate: agent.anim.rotate,
                    scale: agent.anim.scale,
                  }}
                  transition={{
                    duration: agent.anim.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Warm color overlay to harmonize cyan images with gold theme */}
                <div className="absolute inset-0 bg-primary/15 mix-blend-overlay" />

                {/* Glowing eyes on hover */}
                <div
                  className="absolute z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    left: agent.eyes.x,
                    top: agent.eyes.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Left eye */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      left: '-12px',
                      background: 'hsl(40 90% 55%)',
                      boxShadow: '0 0 12px 6px hsl(40 90% 55% / 0.8), 0 0 30px 12px hsl(40 90% 55% / 0.4), 0 0 50px 20px hsl(40 90% 55% / 0.2)',
                    }}
                  />
                  {/* Right eye */}
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      right: '-12px',
                      background: 'hsl(40 90% 55%)',
                      boxShadow: '0 0 12px 6px hsl(40 90% 55% / 0.8), 0 0 30px 12px hsl(40 90% 55% / 0.4), 0 0 50px 20px hsl(40 90% 55% / 0.2)',
                    }}
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-2xl md:text-3xl text-primary text-glow group-hover:drop-shadow-[0_0_12px_hsl(40,90%,55%)] transition-all duration-500">
                  {agent.name}
                </h3>
                <p className="font-body text-xs md:text-sm text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors duration-500">
                  {agent.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIAgents;