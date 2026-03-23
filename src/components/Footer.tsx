const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl text-primary mb-4">XIILIO<span className="text-muted-foreground">.io</span></h3>
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
          <p className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-4">Contact</p>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li>hello@xiilio.io</li>
            <li>London, UK</li>
            <li>Worldwide Remote</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-xs text-muted-foreground">
          © 2026 Xiilio.io. All rights reserved.
        </p>
        <p className="font-body text-xs text-muted-foreground">
          Built with AI. Powered by results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
