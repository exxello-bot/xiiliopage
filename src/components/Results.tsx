import { motion } from "framer-motion";

const results = [
  { metric: "200%", label: "ROI Increase", desc: "E-commerce brand scaled from £10k to £30k/mo in ad-driven revenue within 90 days." },
  { metric: "£250K", label: "Pipeline Built", desc: "B2B SaaS company generated a £250k qualified pipeline using AI-powered outreach." },
  { metric: "48hrs", label: "Go-Live Time", desc: "Full landing page + ad campaign + chatbot deployed in under 48 hours." },
];

const Results = () => {
  return (
    <section className="section-padding noise-overlay">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Case Studies
          </p>
          <h2 className="font-display text-5xl md:text-7xl">
            REAL <span className="text-primary">RESULTS</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {results.map((result, i) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-sm p-8 hover:border-glow transition-all duration-500"
            >
              <p className="font-display text-5xl md:text-6xl text-primary text-glow mb-2">
                {result.metric}
              </p>
              <p className="font-body text-sm font-semibold uppercase tracking-widest mb-4">
                {result.label}
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {result.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
