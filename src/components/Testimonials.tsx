import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "They built our entire lead gen system in a week. We went from zero to 200+ qualified leads per month. Absolute game-changer.",
    name: "Sarah Mitchell",
    role: "CEO, ScaleUp Digital",
  },
  {
    quote: "The AI chatbot they deployed handles 80% of our customer enquiries automatically. Our team can finally focus on closing deals.",
    name: "James Carter",
    role: "Founder, TechBridge Solutions",
  },
  {
    quote: "4.2× ROAS on our first campaign together. They don't just run ads — they build revenue systems. Best investment we've made.",
    name: "Priya Sharma",
    role: "Marketing Director, Luxe Interiors",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-5xl md:text-7xl">
            WHAT CLIENTS <span className="text-primary">SAY</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-sm p-8 flex flex-col"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="font-body text-sm text-foreground/80 leading-relaxed flex-1 mb-6">
                "{t.quote}"
              </p>
              <div>
                <p className="font-body text-sm font-semibold">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
