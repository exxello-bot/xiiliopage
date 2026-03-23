import { motion } from "framer-motion";
import { Bot, Target, Zap, BarChart3, Globe, Megaphone } from "lucide-react";

const services = [
  { icon: Bot, title: "AI Chatbots & Automations", desc: "24/7 lead qualification, booking & follow-up bots that never sleep." },
  { icon: Target, title: "Performance Ads", desc: "Meta, Google & TikTok campaigns engineered for ROAS, not vanity metrics." },
  { icon: Zap, title: "Funnel & Landing Pages", desc: "Conversion-optimized pages that turn traffic into revenue." },
  { icon: BarChart3, title: "CRM & Pipeline Build", desc: "Automated sales pipelines that nurture leads from click to close." },
  { icon: Globe, title: "Website Design & Dev", desc: "High-performance sites built to convert, not just look pretty." },
  { icon: Megaphone, title: "Content & Social Strategy", desc: "AI-assisted content engines that keep your brand omnipresent." },
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
