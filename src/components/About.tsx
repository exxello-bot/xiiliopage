import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="section-padding noise-overlay">
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Who We Are
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6">
            NOT AN AGENCY.
            <br />
            <span className="text-primary">YOUR GROWTH</span>
            <br />
            PARTNER.
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-6">
            Based across major international hubs, we partner with ambitious businesses 
            at every stage — from disruptive startups to multi-billion dollar brands. 
            We combine AI automation with proven marketing strategy to replace the slow, 
            costly, and inconsistent processes that hold businesses back.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Multinational expertise across 15+ countries, serving SaaS, hospitality, 
            finance, insurance, energy, healthcare, and beyond. We're embedded in your 
            business and accountable for your results.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { val: "4×", desc: "Average ROAS" },
            { val: "48hr", desc: "Average Go-Live" },
            { val: "200%", desc: "ROI First Month" },
            { val: "80+", desc: "Languages Supported" },
          ].map((item, i) => (
            <motion.div
              key={item.desc}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-sm p-6 hover:border-glow transition-all duration-300"
            >
              <p className="font-display text-3xl md:text-4xl text-primary">{item.val}</p>
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground mt-2">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
