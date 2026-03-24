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
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">UK Team</p>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li><span className="text-foreground">Mark</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">Founder. Bad Boy Made Good.</span></li>
            <li><span className="text-foreground">Carl</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">Partner. The Gentleman.</span></li>
            <li><span className="text-foreground">Maddy</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">The Posh Bird.</span></li>
          </ul>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4 mt-6">USA Team</p>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li><span className="text-foreground">Nick</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">Partner. The Godfather.</span></li>
            <li><span className="text-foreground">Don</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">The All American Boy.</span></li>
            <li><span className="text-foreground">Theo</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">The Face.</span></li>
            <li><span className="text-foreground">CJ</span> — <span className="bg-gradient-to-r from-blue-400 via-slate-400 to-blue-500 bg-clip-text text-transparent">The Brain.</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 2.658L16.8 9.99l-2.302 2.302L5.864 2.658z"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] uppercase leading-none">Get it on</div>
              <div className="text-sm font-semibold leading-tight">Google Play</div>
            </div>
          </a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] uppercase leading-none">Download on the</div>
              <div className="text-sm font-semibold leading-tight">App Store</div>
            </div>
          </a>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
      </div>
    </footer>
  );
};

export default Footer;