import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Smartphone className="w-10 h-10 text-primary" />
        </div>

        <h1 className="font-display text-4xl mb-4">
          INSTALL <span className="text-primary">XIILIO</span>
        </h1>

        {installed ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="font-body text-muted-foreground">
              App installed! Check your home screen.
            </p>
          </div>
        ) : deferredPrompt ? (
          <>
            <p className="font-body text-muted-foreground mb-8">
              Install Xiilio on your device for instant access — works offline, loads fast, feels native.
            </p>
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest rounded-sm hover:box-glow transition-all"
            >
              <Download className="w-5 h-5" />
              Install App
            </button>
          </>
        ) : (
          <>
            <p className="font-body text-muted-foreground mb-6">
              Install Xiilio directly from your browser:
            </p>
            <div className="text-left space-y-4 font-body text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">iPhone/iPad:</strong> Tap the Share button (↑) in Safari, then "Add to Home Screen"
              </p>
              <p>
                <strong className="text-foreground">Android:</strong> Tap the menu (⋮) in Chrome, then "Install app" or "Add to Home Screen"
              </p>
              <p>
                <strong className="text-foreground">Desktop:</strong> Click the install icon in the address bar
              </p>
            </div>
          </>
        )}

        <a
          href="/"
          className="inline-block mt-8 font-body text-xs uppercase tracking-widest text-primary hover:underline"
        >
          ← Back to Xiilio
        </a>
      </div>
    </div>
  );
};

export default Install;
