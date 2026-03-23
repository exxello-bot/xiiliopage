import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Rocket, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "$2,500",
    period: "/mo",
    description: "For startups ready to automate their first lead gen system.",
    features: [
      "1 AI agent deployed",
      "Up to 1,000 leads/month",
      "Basic CRM integration",
      "Email outreach automation",
      "Weekly performance reports",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    icon: Rocket,
    price: "$5,500",
    period: "/mo",
    description: "For scaling teams that need multi-channel lead generation.",
    features: [
      "3 AI agents deployed",
      "Up to 10,000 leads/month",
      "Full CRM integration",
      "Multi-channel outreach",
      "A/B testing & optimization",
      "Real-time analytics dashboard",
      "Dedicated account manager",
      "Priority support",
    ],
    cta: "Scale Now",
    highlighted: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "Custom",
    period: "",
    description: "For organizations needing full AI-driven growth infrastructure.",
    features: [
      "Unlimited AI agents",
      "Unlimited leads",
      "Custom integrations",
      "White-label solutions",
      "Voice-print analytics",
      "GDPR & compliance suite",
      "Dedicated engineering team",
      "24/7 priority support",
      "Quarterly strategy reviews",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Pricing = () => (
  <section id="pricing" className="section-padding noise-overlay">
    <div className="relative z-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
          Pricing
        </p>
        <h2 className="font-display text-5xl md:text-7xl mb-4">
          INVEST IN <span className="text-primary">GROWTH</span>
        </h2>
        <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          Transparent pricing designed to scale with your business. Every plan delivers measurable ROI from day one.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={item}
            className={`relative group rounded-sm p-6 md:p-8 flex flex-col transition-all duration-300 ${
              plan.highlighted
                ? "bg-card border-2 border-primary"
                : "bg-card border border-border hover:border-primary/40"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="font-body text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1 rounded-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-4">
                <plan.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-1">{plan.name}</h3>
              <p className="font-body text-xs text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl md:text-5xl">{plan.price}</span>
              {plan.period && (
                <span className="font-body text-sm text-muted-foreground">{plan.period}</span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-body text-sm text-muted-foreground">{feat}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`group/btn flex items-center justify-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-6 py-4 rounded-sm transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:box-glow"
                  : "border border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Pricing;
