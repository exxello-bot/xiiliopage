import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, Bot, User, Loader2, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const AIDemo = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const latestAssistantRef = useRef("");
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown for cleaner speech
    const clean = text
      .replace(/[#*_`~>\[\]()!|]/g, "")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
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
      body: JSON.stringify({ messages: allMessages }),
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
            latestAssistantRef.current = assistantSoFar;
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

    // Speak the full response after streaming completes
    if (assistantSoFar) {
      speakText(assistantSoFar);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput || input.trim();
    if (!text || isLoading) return;
    stopSpeaking();
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updated);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast({ title: "Not supported", description: "Speech recognition is not supported in this browser.", variant: "destructive" });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      // Auto-send voice input
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
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
            Ask anything about Xiilio — tap the mic to speak.
            Our AI reads back every answer aloud.
          </p>
        </motion.div>

        {/* Central mic button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={toggleMic}
            className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              isListening
                ? "bg-destructive text-destructive-foreground scale-110"
                : isSpeaking
                  ? "bg-primary/20 text-primary"
                  : "bg-primary text-primary-foreground hover:box-glow hover:scale-105"
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {/* Pulse rings when active */}
            {(isListening || isSpeaking) && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" />
                <span className="absolute -inset-2 rounded-full animate-pulse opacity-10 bg-current" />
              </>
            )}
            {isListening ? (
              <MicOff className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
            ) : isSpeaking ? (
              <Volume2 className="w-8 h-8 md:w-10 md:h-10 relative z-10 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
            )}
          </button>
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
          {/* Messages */}
          <div className="h-72 md:h-80 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    Hi! I'm Xiilio's AI agent. Ask me anything about our services.
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
