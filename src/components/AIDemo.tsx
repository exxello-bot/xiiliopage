import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Bot, User, Loader2, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

// Generate a persistent session ID per browser tab
const SESSION_ID = crypto.randomUUID();

const AIDemo = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const recognitionRef = useRef<any>(null);
  const shouldAutoListenRef = useRef(false);
  const startListeningRef = useRef<(() => void) | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-greet when section comes into view
  useEffect(() => {
    if (!sectionRef.current || hasGreeted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasGreeted) {
          setHasGreeted(true);
          const greeting = "Welcome to Xiilio! I'm your AI growth agent. Ask me anything about our AI-powered lead generation, performance marketing, or how we can scale your business. What would you like to know?";
          setMessages([{ role: "assistant", content: greeting }]);
          // Delay speak to let TTS voices load
          setTimeout(() => {
            if (voiceEnabled && "speechSynthesis" in window) {
              const clean = greeting.replace(/[#*_`~>\[\]()!|]/g, "").replace(/\n+/g, ". ").replace(/\s+/g, " ").trim();
              const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
              let idx = 0;
              const speakNextGreet = () => {
                if (idx >= sentences.length) {
                  setIsSpeaking(false);
                  shouldAutoListenRef.current = true;
                  setTimeout(() => startListeningRef.current?.(), 600);
                  return;
                }
                const s = sentences[idx].trim();
                if (!s) { idx++; speakNextGreet(); return; }
                const utt = new SpeechSynthesisUtterance(s);
                const voices = window.speechSynthesis.getVoices();
                const names = ["Google UK English Female","Google UK English Male","Samantha","Karen","Daniel"];
                let v = null;
                for (const n of names) { v = voices.find(x => x.name.includes(n)); if (v) break; }
                if (!v) v = voices.find(x => x.lang.startsWith("en")) || voices[0];
                if (v) utt.voice = v;
                utt.rate = 0.95 + Math.random() * 0.15;
                utt.pitch = 0.95 + Math.random() * 0.1;
                utt.onstart = () => setIsSpeaking(true);
                utt.onend = () => { idx++; setTimeout(speakNextGreet, 80 + Math.random() * 120); };
                utt.onerror = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utt);
              };
              speakNextGreet();
            }
          }, 500);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasGreeted, voiceEnabled]);

  // Select the best available voice for richer, more human sound
  const selectedVoice = useMemo(() => {
    if (!("speechSynthesis" in window)) return null;

    const getVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return null;

      // Prioritize high-quality voices
      const preferredVoices = [
        "Google UK English Female",
        "Google UK English Male",
        "Samantha", // macOS
        "Karen",    // macOS Australian
        "Daniel",   // macOS British
        "Moira",    // macOS Irish
        "Fiona",    // macOS Scottish
        "Google US English",
        "Microsoft Zira",
        "Microsoft Mark",
      ];

      for (const name of preferredVoices) {
        const v = voices.find(v => v.name.includes(name));
        if (v) return v;
      }

      // Fallback: prefer en-GB or en-US voices
      const enVoice = voices.find(v => v.lang.startsWith("en-GB")) ||
                      voices.find(v => v.lang.startsWith("en-US")) ||
                      voices.find(v => v.lang.startsWith("en"));
      return enVoice || voices[0];
    };

    // Voices may load async
    let voice = getVoice();
    if (!voice) {
      window.speechSynthesis.onvoiceschanged = () => { /* will re-select on next speak */ };
    }
    return voice;
  }, []);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[#*_`~>\[\]()!|]/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return;

    // Split into sentences for more natural delivery with pauses
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];

    let currentIndex = 0;
    const speakNext = () => {
      if (currentIndex >= sentences.length) {
        setIsSpeaking(false);
        // Auto-listen after agent finishes speaking
        if (shouldAutoListenRef.current) {
          setTimeout(() => startListening(), 600);
        }
        return;
      }

      const sentence = sentences[currentIndex].trim();
      if (!sentence) {
        currentIndex++;
        speakNext();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentence);

      // Get best voice at speak time (voices may have loaded since init)
      const voices = window.speechSynthesis.getVoices();
      const preferredNames = [
        "Google UK English Female", "Google UK English Male",
        "Samantha", "Karen", "Daniel", "Moira", "Fiona",
        "Google US English", "Microsoft Zira",
      ];
      let voice = null;
      for (const name of preferredNames) {
        voice = voices.find(v => v.name.includes(name));
        if (voice) break;
      }
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith("en-GB")) ||
                voices.find(v => v.lang.startsWith("en-US")) ||
                voices.find(v => v.lang.startsWith("en")) ||
                voices[0];
      }
      if (voice) utterance.voice = voice;

      // Dynamic speech parameters for more human feel
      utterance.rate = 0.95 + Math.random() * 0.15;  // Slight rate variation
      utterance.pitch = 0.95 + Math.random() * 0.1;  // Subtle pitch variation
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        currentIndex++;
        // Small pause between sentences
        setTimeout(speakNext, 80 + Math.random() * 120);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }, [voiceEnabled]);

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const streamChat = async (allMessages: Msg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages, sessionId: SESSION_ID }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || `Status ${resp.status}`);
    }
    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantSoFar += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
              }
              return [...prev, { role: "assistant", content: assistantSoFar }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (assistantSoFar) {
      speakText(assistantSoFar);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput;
    if (!text || isLoading) return;
    stopSpeaking();
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsLoading(true);

    try {
      await streamChat(updated);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    if (isListening || isLoading) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      shouldAutoListenRef.current = true;
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, isLoading, handleSend]);

  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast({ title: "Not supported", description: "Speech recognition is not supported in this browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      shouldAutoListenRef.current = false;
      return;
    }

    stopSpeaking();
    shouldAutoListenRef.current = true;
    startListening();
  };

  return (
    <section id="ai-demo" className="section-padding noise-overlay">
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Live Demo
          </p>
          <h2 className="font-display text-5xl md:text-7xl mb-4">
            TALK TO OUR <span className="text-primary">AI AGENT</span>
          </h2>
          <p className="font-body text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Tap the mic, ask anything about Xiilio — our agent listens, thinks, and speaks back.
          </p>
        </motion.div>

        {/* Central mic button with 3D glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Ambient glow layers */}
            <div className={`absolute -inset-6 rounded-full blur-[30px] transition-all duration-700 ${
              isListening
                ? "bg-destructive/40 animate-pulse"
                : isSpeaking
                  ? "bg-primary/30 animate-pulse"
                  : "bg-primary/20"
            }`} />
            <div className={`absolute -inset-3 rounded-full blur-[15px] transition-all duration-500 ${
              isListening
                ? "bg-destructive/30"
                : isSpeaking
                  ? "bg-primary/25"
                  : "bg-primary/15"
            }`} />

            <button
              onClick={toggleMic}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                isListening
                  ? "bg-destructive text-destructive-foreground scale-110"
                  : isSpeaking
                    ? "bg-primary/20 text-primary"
                    : "bg-primary text-primary-foreground hover:scale-105"
              }`}
              style={{
                boxShadow: isListening
                  ? "0 8px 32px -4px hsl(var(--destructive) / 0.6), inset 0 -4px 12px hsl(var(--destructive) / 0.3), inset 0 4px 8px hsl(0 0% 100% / 0.15)"
                  : isSpeaking
                    ? "0 8px 32px -4px hsl(var(--primary) / 0.5), inset 0 -4px 12px hsl(var(--primary) / 0.2), inset 0 4px 8px hsl(0 0% 100% / 0.1)"
                    : "0 8px 32px -4px hsl(var(--primary) / 0.5), 0 2px 8px hsl(0 0% 0% / 0.3), inset 0 -4px 12px hsl(var(--primary) / 0.3), inset 0 4px 8px hsl(0 0% 100% / 0.2)",
              }}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {/* Waveform bars */}
              {(isListening || isSpeaking) && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const delay = i * 0.08;
                    return (
                      <span
                        key={i}
                        className="absolute w-1 rounded-full bg-current opacity-60"
                        style={{
                          height: '12px',
                          left: '50%',
                          top: '50%',
                          transformOrigin: '50% 0%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${isSpeaking ? 38 : 34}px)`,
                          animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out ${delay}s infinite alternate`,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {isListening ? (
                <MicOff className="w-8 h-8 md:w-10 md:h-10 relative z-10 drop-shadow-lg" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 md:w-10 md:h-10 relative z-10 animate-pulse drop-shadow-lg" />
              ) : (
                <Mic className="w-8 h-8 md:w-10 md:h-10 relative z-10 drop-shadow-lg" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex justify-center mb-6">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Tap to speak"}
          </p>
        </div>

        {/* Chat area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-sm overflow-hidden"
        >
          <div className="h-72 md:h-80 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    Hi! I'm Xiilio's AI agent. Tap the mic and ask me anything.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {["What services do you offer?", "Tell me about your AI agents", "What results have you achieved?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="font-body text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-sm hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-sm p-3 font-body text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-sm p-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice toggle */}
          <div className="border-t border-border p-3 md:p-4 flex items-center justify-center gap-3">
            <button
              onClick={() => { setVoiceEnabled(!voiceEnabled); stopSpeaking(); }}
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                voiceEnabled
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
              aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
              title={voiceEnabled ? "Voice responses on" : "Voice responses off"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="font-body text-xs text-muted-foreground">
              {voiceEnabled ? "Voice responses on" : "Voice responses off"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIDemo;
