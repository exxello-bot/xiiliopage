import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [activeTab, setActiveTab] = useState<"form" | "calendar">("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: form,
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      toast({ title: "Something went wrong", description: "Please try again or email us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">Get in touch</p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6">
            LET'S BUILD
            <br />
            <span className="text-primary text-glow">TOGETHER</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            Ready to turn your growth on autopilot? Drop us a message and
            we'll get back to you within 24 hours with a custom strategy outline.
          </p>
          <div className="space-y-3 font-body text-sm text-muted-foreground">
            <p><a href="mailto:letsgo@xiilio.ai" className="hover:text-primary transition-colors">letsgo@xiilio.ai</a></p>
            <p>London, UK · Worldwide Remote</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex mb-6 border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-widest py-3 transition-all ${
                activeTab === "form"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-primary"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Message
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-widest py-3 transition-all ${
                activeTab === "calendar"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-primary"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Book a Call
            </button>
          </div>

          {activeTab === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                  Name *
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  maxLength={100}
                  className="bg-card border-border font-body text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  maxLength={255}
                  className="bg-card border-border font-body text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                  Company
                </label>
                <Input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your company"
                  maxLength={100}
                  className="bg-card border-border font-body text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                  Message *
                </label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  maxLength={1000}
                  rows={5}
                  className="bg-card border-border font-body text-sm focus:border-primary resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full font-body text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:box-glow py-6 rounded-sm font-semibold"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          ) : (
            <div className="bg-card border border-border rounded-sm p-6 text-center">
              <div className="rounded-sm overflow-hidden">
                <iframe
                  src="https://cal.com/mark-mcclafferty-uqlsss"
                  className="w-full h-[500px] border-0"
                  title="Book a Strategy Call"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
