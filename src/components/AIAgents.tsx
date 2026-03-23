import { motion } from "framer-motion";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import agent4 from "@/assets/agent-4.jpg";
import agent5 from "@/assets/agent-5.jpg";
import agent6 from "@/assets/agent-6.jpg";

const agents = [
  { img: agent1, name: "NOVA", role: "Lead Generation Agent" },
  { img: agent2, name: "ARIA", role: "Conversational AI Agent" },
  { img: agent3, name: "CORTEX", role: "Analytics & Insights Agent" },
  { img: agent4, name: "NEXUS", role: "Automation Agent" },
  { img: agent5, name: "SENTINEL", role: "Ad Targeting Agent" },
  { img: agent6, name: "HERALD", role: "Outreach & Engagement Agent" },
];

const AIAgents = () => {
  return (
    <section id="agents" className="section-padding noise-overlay">
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

              <div className="aspect-square overflow-hidden relative">
                <img
                  src={agent.img}
                  alt={`${agent.name} - ${agent.role}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Warm color overlay to harmonize cyan images with gold theme */}
                <div className="absolute inset-0 bg-primary/15 mix-blend-overlay" />
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
