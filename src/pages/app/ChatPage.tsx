import AIDemo from "@/components/AIDemo";

const ChatPage = () => {
  return (
    <div className="px-4 py-6">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-widest text-primary font-body mb-1">AI Assistant</p>
        <h1 className="font-display text-3xl text-foreground">Chat with Aria</h1>
      </div>
      <AIDemo />
    </div>
  );
};

export default ChatPage;
