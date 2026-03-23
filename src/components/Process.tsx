import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "DISCOVERY", desc: "Deep dive into your business, audience & bottlenecks. We audit everything and map your growth levers." },
  { num: "02", title: "BUILD", desc: "We design, develop and deploy your AI-powered growth system — ads, funnels, automations, everything." },
  { num: "03", title: "SCALE", desc: "Data-driven optimisation. We test, iterate and scale what works. Your revenue compounds month over month." },
];

const Process = () => {
  return (
    <section className="section-padding border-y border-border">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            How It Works
          </p>
          <h2 className="font-display text-5xl md:text-7xl">
            THREE STEPS TO <span className="text-primary">GROWTH</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative"
            >
              <span className="font-display text-8xl text-primary/10 absolute -top-4 -left-2">
                {step.num}
              </span>
              <div className="relative pt-16">
                <h3 className="font-display text-3xl mb-4 text-primary">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
