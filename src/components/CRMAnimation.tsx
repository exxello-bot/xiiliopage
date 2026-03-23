import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, TrendingUp, CheckCircle, Clock, Star } from "lucide-react";

const LEADS = [
  { name: "Sarah Mitchell", company: "Apex Digital", email: "sarah@apex.io", phone: "+1 (415) 555-0142", status: "Qualified", score: 92, stage: "Proposal Sent" },
  { name: "James Carter", company: "NovaTech Labs", email: "james@novatech.co", phone: "+1 (310) 555-0198", status: "New Lead", score: 67, stage: "Discovery" },
  { name: "Priya Sharma", company: "CloudSync AI", email: "priya@cloudsync.ai", phone: "+1 (212) 555-0231", status: "Contacted", score: 81, stage: "Demo Scheduled" },
  { name: "Marcus Johnson", company: "UrbanFlow Inc", email: "marcus@urbanflow.com", phone: "+1 (773) 555-0087", status: "Qualified", score: 95, stage: "Negotiation" },
  { name: "Elena Vasquez", company: "BrightPath Co", email: "elena@brightpath.co", phone: "+1 (512) 555-0164", status: "New Lead", score: 54, stage: "Outreach" },
];

const ACTIVITIES = [
  { action: "Email sent", target: "Sarah Mitchell", time: "Just now", icon: Mail },
  { action: "Call logged", target: "Marcus Johnson", time: "2m ago", icon: Phone },
  { action: "Lead scored", target: "Priya Sharma", time: "5m ago", icon: TrendingUp },
  { action: "Deal updated", target: "James Carter", time: "8m ago", icon: CheckCircle },
];

const statusColor = (status: string) => {
  switch (status) {
    case "Qualified": return "bg-green-500/20 text-green-400";
    case "Contacted": return "bg-blue-500/20 text-blue-400";
    default: return "bg-yellow-500/20 text-yellow-400";
  }
};

const CRMAnimation = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [scores, setScores] = useState(LEADS.map((l) => l.score));
  const [statuses, setStatuses] = useState(LEADS.map((l) => l.status));
  const [stages, setStages] = useState(LEADS.map((l) => l.stage));
  const [activityIndex, setActivityIndex] = useState(0);
  const [typingField, setTypingField] = useState<{ row: number; field: string } | null>(null);

  // Cycle active row highlight
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRow((prev) => (prev + 1) % LEADS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-update scores
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * LEADS.length);
      const delta = Math.floor(Math.random() * 8) - 2;
      setScores((prev) => prev.map((s, i) => (i === idx ? Math.min(100, Math.max(0, s + delta)) : s)));
      setTypingField({ row: idx, field: "score" });
      setTimeout(() => setTypingField(null), 800);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-update statuses
  useEffect(() => {
    const cycle = ["New Lead", "Contacted", "Qualified"];
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * LEADS.length);
      setStatuses((prev) =>
        prev.map((s, i) => (i === idx ? cycle[(cycle.indexOf(s) + 1) % cycle.length] : s))
      );
      setTypingField({ row: idx, field: "status" });
      setTimeout(() => setTypingField(null), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-update stages
  useEffect(() => {
    const stagesCycle = ["Outreach", "Discovery", "Demo Scheduled", "Proposal Sent", "Negotiation", "Closed Won"];
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * LEADS.length);
      setStages((prev) =>
        prev.map((s, i) => {
          if (i !== idx) return s;
          const ci = stagesCycle.indexOf(s);
          return stagesCycle[(ci + 1) % stagesCycle.length];
        })
      );
      setTypingField({ row: idx, field: "stage" });
      setTimeout(() => setTypingField(null), 800);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Cycle activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const visibleActivities = [
    ACTIVITIES[activityIndex % ACTIVITIES.length],
    ACTIVITIES[(activityIndex + 1) % ACTIVITIES.length],
    ACTIVITIES[(activityIndex + 2) % ACTIVITIES.length],
  ];

  return (
    <section className="section-padding noise-overlay border-y border-border overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Intelligent Automation
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl mb-4">
            YOUR CRM, <span className="text-primary">ON AUTOPILOT</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Watch leads get scored, statuses updated, and pipelines managed — all automatically by our AI agents.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-sm overflow-hidden shadow-2xl"
        >
          {/* CRM Top Bar */}
          <div className="flex items-center justify-between border-b border-border px-4 md:px-6 py-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-display text-sm tracking-wide">PIPELINE</span>
              <span className="font-body text-xs text-muted-foreground ml-2">
                {LEADS.length} leads
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="font-body text-xs text-green-400">AI Active</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Main Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {["Contact", "Company", "Status", "Score", "Stage"].map((h) => (
                      <th
                        key={h}
                        className="font-body text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground px-3 md:px-4 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((lead, i) => {
                    const isActive = i === activeRow;
                    const isScoreUpdating = typingField?.row === i && typingField?.field === "score";
                    const isStatusUpdating = typingField?.row === i && typingField?.field === "status";
                    const isStageUpdating = typingField?.row === i && typingField?.field === "stage";

                    return (
                      <motion.tr
                        key={lead.name}
                        className={`border-b border-border/50 transition-colors duration-500 ${
                          isActive ? "bg-primary/5" : "bg-transparent"
                        }`}
                        animate={isActive ? { backgroundColor: "hsl(var(--primary) / 0.05)" } : {}}
                      >
                        <td className="px-3 md:px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="font-display text-[10px] text-primary">
                                {lead.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-body text-xs md:text-sm truncate">{lead.name}</p>
                              <p className="font-body text-[10px] text-muted-foreground truncate">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <span className="font-body text-xs md:text-sm text-muted-foreground">{lead.company}</span>
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <motion.span
                            key={statuses[i]}
                            initial={isStatusUpdating ? { scale: 1.15, opacity: 0.6 } : false}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`inline-block font-body text-[10px] md:text-xs px-2 py-0.5 rounded-sm ${statusColor(statuses[i])} ${
                              isStatusUpdating ? "ring-1 ring-primary/50" : ""
                            }`}
                          >
                            {statuses[i]}
                          </motion.span>
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 md:w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary rounded-full"
                                animate={{ width: `${scores[i]}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                            </div>
                            <motion.span
                              key={scores[i]}
                              initial={isScoreUpdating ? { scale: 1.3, color: "hsl(var(--primary))" } : false}
                              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                              transition={{ duration: 0.5 }}
                              className="font-body text-xs md:text-sm w-6 text-right"
                            >
                              {scores[i]}
                            </motion.span>
                          </div>
                        </td>
                        <td className="px-3 md:px-4 py-3">
                          <motion.span
                            key={stages[i]}
                            initial={isStageUpdating ? { x: -4, opacity: 0 } : false}
                            animate={{ x: 0, opacity: 1 }}
                            className={`font-body text-[10px] md:text-xs text-muted-foreground ${
                              isStageUpdating ? "text-primary" : ""
                            }`}
                          >
                            {stages[i]}
                          </motion.span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Activity Sidebar */}
            <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-display text-[10px] uppercase tracking-wider">Live Activity</span>
              </div>
              <div className="space-y-3">
                {visibleActivities.map((activity, i) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={`${activity.action}-${activityIndex}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] md:text-xs">{activity.action}</p>
                        <p className="font-body text-[10px] text-muted-foreground">{activity.target}</p>
                        <p className="font-body text-[9px] text-muted-foreground/60">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mini stats */}
              <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                {[
                  { label: "Conversion", value: "34%", icon: TrendingUp },
                  { label: "Avg Score", value: `${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}`, icon: Star },
                ].map(({ label, value, icon: StatIcon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <StatIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="font-body text-[10px] text-muted-foreground">{label}</span>
                    </div>
                    <span className="font-display text-xs text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CRMAnimation;
