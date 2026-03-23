import { useState } from "react";
import { Menu, X, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#pricing" },
  { label: "AI Demo", href: "#ai-demo" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Xiilio.ai", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share link copied to clipboard." });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <a href="mailto:letsgo@xiilio.ai" className="relative font-display text-sm md:text-base tracking-widest bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent hover:from-yellow-300 hover:to-amber-400 transition-all">
          letsgo@xiilio.ai
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={handleShare}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <a
            href="#contact"
            className="font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2 rounded-sm font-semibold hover:box-glow transition-all"
          >
            Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-6 space-y-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { handleShare(); setOpen(false); }}
            className="flex items-center gap-2 font-body text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block font-body text-sm uppercase tracking-widest bg-primary text-primary-foreground px-5 py-3 rounded-sm font-semibold text-center"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
