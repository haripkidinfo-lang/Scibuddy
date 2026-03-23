import { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@workspace/api-client-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm SciBuddy, your AI study assistant. Ask me anything about science, or let's review what you're focusing on today." }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useSendChatMessage({
    mutation: {
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply }
        ]);
      },
      onError: (error) => {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I'm sorry, I encountered an error connecting to my neural network. Please try again." }
        ]);
      }
    }
  });

  const sendMessage = (content: string) => {
    if (!content.trim() || mutation.isPending) return;

    // Save previous history to send to API
    const history = messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content
    }));

    // Optimistically update UI with user's message
    setMessages((prev) => [...prev, { role: "user", content }]);
    
    // Trigger mutation
    mutation.mutate({
      data: {
        message: content,
        history,
      }
    });
  };

  return {
    messages,
    sendMessage,
    isPending: mutation.isPending,
    messagesEndRef
  };
}
