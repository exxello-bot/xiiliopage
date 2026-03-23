import xiilioLogo from "@/assets/xiilio-logo.png";

const Footer = () => {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <a href="#" className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-glow" />
            <img
              src={xiilioLogo}
              alt="Xiilio.ai"
              className="relative h-[151.2px] w-auto"
              style={{
                mixBlendMode: 'screen',
                maskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 40%, transparent 90%)',
              }}
            />
          </a>
          <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">
            AI-powered growth systems that turn clicks into customers. 
            We don't do campaigns — we build revenue machines.
          </p>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">Navigate</p>
          <ul className="space-y-2">
            {["About", "Services", "Results", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">Locations</p>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li>London, UK</li>
            <li>New York, USA</li>
            <li>Los Angeles, USA</li>
            <li>Dubai, UAE</li>
            <li className="text-primary/80 pt-1">Worldwide Remote</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-muted-foreground">
          © 2026 Xiilio.ai. All rights reserved.
        </p>
        <p className="font-body text-xs text-muted-foreground">
          <a href="mailto:itsgotime@24twelve.co" className="hover:text-primary transition-colors">letsgo@xiilio.ai</a>
        </p>
        <p className="font-body text-xs text-muted-foreground">
          Built with AI. Powered by results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;