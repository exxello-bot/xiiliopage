import { Bot, Target, Zap, Globe, Megaphone, Video, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  { icon: Bot, title: "AI Agents & Personas", desc: "Autonomous AI workers that qualify leads, book meetings & handle support 24/7." },
  { icon: Target, title: "AI-Powered Lead Gen", desc: "Intelligent outreach that delivers qualified leads to your pipeline." },
  { icon: Zap, title: "Digital Advertising", desc: "High-performance paid campaigns engineered for ROI." },
  { icon: Mail, title: "Email Marketing", desc: "Smart sequences that nurture prospects and convert interest into revenue." },
  { icon: Megaphone, title: "Social Media", desc: "On-brand content & growth strategy across all platforms." },
  { icon: Video, title: "AI Video Creation", desc: "AI influencers or cloned spokespeople generating video on demand." },
  { icon: Globe, title: "Web Design & SEO", desc: "Fast, modern websites built to rank and convert." },
];

const ServicesPage = () => {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-body mb-1">What We Do</p>
        <h1 className="font-display text-3xl text-foreground">Our Services</h1>
      </div>
      <div className="space-y-3">
        {services.map((s) => (
          <Card key={s.title} className="p-4 border-border flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
