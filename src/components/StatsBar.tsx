import { motion } from "framer-motion";

const stats = [
  { value: "600+", label: "Leads Generated" },
  { value: "4×", label: "Average ROAS" },
  { value: "38%", label: "ROI Increase" },
  { value: "80+", label: "Languages" },
];

const StatsBar = () => {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <p className="font-display text-4xl md:text-5xl text-primary text-glow">
              {stat.value}
            </p>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
