import { motion } from "framer-motion";
import { Bot, Target, Zap, BarChart3, Globe, Megaphone, Video, Mail } from "lucide-react";

const services = [
  { icon: Bot, title: "AI Agents & Personas", desc: "Autonomous AI workers that qualify leads, book meetings, handle support & close sales — 24/7, fluent in 80+ languages." },
  { icon: Target, title: "AI-Powered Lead Generation", desc: "Intelligent outreach that identifies ideal prospects, builds targeted campaigns & delivers qualified leads to your pipeline." },
  { icon: Zap, title: "Digital Advertising", desc: "High-performance paid campaigns across search, social & display — engineered for ROI from the first week." },
  { icon: Mail, title: "Email Marketing & Automation", desc: "Smart, personalized sequences that nurture prospects, re-engage past customers & convert interest into revenue." },
  { icon: Megaphone, title: "Social Media Management", desc: "Consistent, on-brand content & growth strategy across all platforms — without consuming your team's time." },
  { icon: Video, title: "AI Video Creation & Cloning", desc: "Bespoke AI influencers or cloned spokespeople generating high-quality video content on demand." },
  { icon: Globe, title: "Web Design & SEO", desc: "Fast, modern websites built to rank on Google and convert visitors into paying customers." },
];

const Services = () => {
  return (
    <section id="services" className="section-padding noise-overlay">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            What We Do
          </p>
          <h2 className="font-display text-5xl md:text-7xl">
            SERVICES THAT <span className="text-primary">SCALE</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-card border border-border rounded-sm p-8 hover:border-glow transition-all duration-500 cursor-default"
            >
              <service.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-display text-2xl mb-3">{service.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
