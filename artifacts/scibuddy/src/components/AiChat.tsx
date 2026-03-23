import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

export function AiChat() {
  const { messages, sendMessage, isPending, messagesEndRef } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px] lg:h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] relative overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-white/10 bg-white/5 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Bot className="w-5 h-5 text-primary-foreground drop-shadow-md" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white tracking-wide flex items-center gap-2">
            Neural Assistant <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          </h2>
          <p className="text-xs text-white/50 font-medium">Online & ready to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex w-full gap-4",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 border",
                msg.role === "user" 
                  ? "bg-gradient-to-br from-violet-500 to-primary border-white/20 shadow-lg"
                  : "bg-white/10 border-white/10"
              )}>
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white/80" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "max-w-[80%] rounded-2xl p-4 shadow-sm",
                msg.role === "user"
                  ? "bg-primary/90 text-white rounded-tr-sm"
                  : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-sm"
              )}>
                <div className="prose prose-sm max-w-none break-words prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mt-1">
              <Bot className="w-4 h-4 text-white/80" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 backdrop-blur-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-white/10 bg-white/5 relative z-10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isPending}
            className="w-full bg-black/40 border border-white/10 text-white placeholder:text-white/30 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || isPending}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </motion.button>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
