import { motion } from "framer-motion";
import { Shield, Lock, Globe, Fingerprint, Server, Eye, FileDown } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "GDPR Compliant",
    desc: "Full data protection compliance across EU and international regulations.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "All data encrypted in transit and at rest with AES-256 standards.",
  },
  {
    icon: Fingerprint,
    title: "Voice-Print Analytics",
    desc: "Proprietary voice analysis for sentiment tracking and lead scoring.",
  },
  {
    icon: Server,
    title: "Shield Architecture",
    desc: "Multi-layered infrastructure with automatic failover and 99.9% uptime.",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    desc: "Low-latency AI processing across 40+ global edge locations.",
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    desc: "24/7 threat detection and anomaly monitoring across all systems.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SecurityPlatform = () => (
  <section id="security" className="section-padding noise-overlay">
    <div className="relative z-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
          Platform & Security
        </p>
        <h2 className="font-display text-5xl md:text-7xl mb-4">
          ENTERPRISE-GRADE <span className="text-primary">SECURITY</span>
        </h2>
        <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6">
          Built on a secure foundation so your data and your clients' data stay protected at every layer.
        </p>
        <a
          href="https://neysfqvxhkegxbgpsbqr.supabase.co/storage/v1/object/public/documents/Xiilio_CRM_Security.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary/10 border border-primary/30 text-primary font-body text-sm hover:bg-primary/20 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Download CRM Security Overview
        </a>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group relative bg-card border border-border rounded-sm p-6 hover:border-primary/40 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SecurityPlatform;
