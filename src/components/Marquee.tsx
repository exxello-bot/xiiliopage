const items = [
  "AI AUTOMATIONS",
  "PAID MEDIA",
  "LEAD GENERATION",
  "CONVERSION DESIGN",
  "REVENUE SYSTEMS",
  "4× ROAS",
  "FULL-FUNNEL STRATEGY",
  "200% ROI",
];

const Marquee = () => {
  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-8 px-8">
      <span className="font-display text-3xl md:text-5xl bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent whitespace-nowrap">
        {item}
      </span>
      <span className="w-2 h-2 rounded-full bg-primary/40" />
    </span>
  ));

  return (
    <section className="py-8 overflow-hidden">
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </section>
  );
};

export default Marquee;
