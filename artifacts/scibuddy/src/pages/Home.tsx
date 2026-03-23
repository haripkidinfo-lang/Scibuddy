import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, Timer, MessageCircle } from "lucide-react";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AiChat } from "@/components/AiChat";
import { Background } from "@/components/Background";
import { cn } from "@/lib/utils";

type Tab = "timer" | "chat";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  return (
    <div className="relative min-h-screen selection:bg-primary/30">
      <Background />

      <main className="relative z-10 flex flex-col h-screen max-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 flex-shrink-0 border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-purple-900 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-t border-white/20 flex-shrink-0">
              <Atom className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Sci<span className="text-primary">Buddy</span>
              </h1>
              <p className="text-[10px] md:text-xs text-white/40 font-medium uppercase tracking-widest hidden sm:block">
                Neural Study Environment
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-white/60">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent border border-black/50" />
            </span>
            Systems Nominal
          </div>
        </motion.header>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex-shrink-0 flex gap-1 mx-4 mt-3 bg-white/5 rounded-xl p-1 border border-white/10">
          {([
            { id: "timer", label: "Focus Timer", icon: Timer },
            { id: "chat", label: "AI Assistant", icon: MessageCircle },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-primary/80 text-white shadow-lg"
                  : "text-white/50 hover:text-white/80"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content — Mobile: single tab, Desktop: side-by-side */}
        <div className="flex-1 min-h-0 px-4 md:px-8 py-4 md:py-6">

          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="col-span-5 h-full flex flex-col"
            >
              <PomodoroTimer />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="col-span-7 h-full flex flex-col"
            >
              <AiChat />
            </motion.div>
          </div>

          {/* Mobile layout — animated tab panels */}
          <div className="lg:hidden h-full">
            <AnimatePresence mode="wait">
              {activeTab === "timer" ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <PomodoroTimer />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <AiChat />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
