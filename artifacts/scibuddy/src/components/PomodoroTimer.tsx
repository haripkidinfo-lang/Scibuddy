import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Brain, Coffee, Settings, X, Check } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

const DEFAULT_FOCUS = 25;
const DEFAULT_BREAK = 5;

export function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useState(DEFAULT_FOCUS);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<"Focus" | "Break">("Focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [draftFocus, setDraftFocus] = useState(DEFAULT_FOCUS);
  const [draftBreak, setDraftBreak] = useState(DEFAULT_BREAK);

  const focusTime = focusMinutes * 60;
  const breakTime = breakMinutes * 60;
  const totalTime = sessionType === "Focus" ? focusTime : breakTime;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      handleSkip();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive((p) => !p);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionType === "Focus" ? focusTime : breakTime);
  };

  const handleSkip = () => {
    if (sessionType === "Focus") {
      setSessionType("Break");
      setTimeLeft(breakTime);
      setSessionCount((p) => p + 1);
    } else {
      setSessionType("Focus");
      setTimeLeft(focusTime);
    }
    setIsActive(false);
  };

  const openSettings = () => {
    setDraftFocus(focusMinutes);
    setDraftBreak(breakMinutes);
    setShowSettings(true);
  };

  const saveSettings = () => {
    const f = Math.max(1, Math.min(120, draftFocus));
    const b = Math.max(1, Math.min(60, draftBreak));
    setFocusMinutes(f);
    setBreakMinutes(b);
    setIsActive(false);
    setSessionType("Focus");
    setTimeLeft(f * 60);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-8 relative z-10">
        <h2 className="text-lg md:text-xl font-display font-semibold text-white/90 flex items-center gap-2">
          {sessionType === "Focus" ? (
            <Brain className="w-5 h-5 text-primary flex-shrink-0" />
          ) : (
            <Coffee className="w-5 h-5 text-accent flex-shrink-0" />
          )}
          <span className="hidden sm:inline">{sessionType} Session</span>
          <span className="sm:hidden">{sessionType}</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="bg-white/10 px-2.5 py-1 rounded-full text-xs md:text-sm font-medium text-white/70 border border-white/5">
            <span className="hidden sm:inline">Completed: </span>
            <span className="text-primary font-bold">{sessionCount}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openSettings}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white/90 transition-colors"
            title="Timer settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-4 z-20 bg-background/95 backdrop-blur-xl border border-white/15 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white font-display font-bold text-lg">Timer Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white/90 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Focus Duration: <span className="text-primary font-bold">{draftFocus} min</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={120}
                  value={draftFocus}
                  onChange={(e) => setDraftFocus(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full bg-white/10"
                />
                <div className="flex justify-between text-white/30 text-xs mt-1">
                  <span>1 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Break Duration: <span className="text-accent font-bold">{draftBreak} min</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={draftBreak}
                  onChange={(e) => setDraftBreak(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 rounded-full bg-white/10"
                />
                <div className="flex justify-between text-white/30 text-xs mt-1">
                  <span>1 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[15, 25, 45, 60, 90].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDraftFocus(m)}
                    className={cn(
                      "py-2 rounded-xl text-sm font-medium border transition-all",
                      draftFocus === m
                        ? "bg-primary/30 border-primary/50 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/80"
                    )}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveSettings}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Check className="w-4 h-4" />
              Apply & Reset Timer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Circle */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-2">
        <div className="relative flex items-center justify-center w-[240px] h-[240px] md:w-[280px] md:h-[280px]">
          <svg className="transform -rotate-90 w-full h-full drop-shadow-lg" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
            <motion.circle
              cx="130"
              cy="130"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="round"
              className={cn(
                "transition-colors duration-500",
                sessionType === "Focus"
                  ? "text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                  : "text-accent drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0.5, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-white drop-shadow-md"
              >
                {formatTime(timeLeft)}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs text-white/50 font-medium mt-1.5 uppercase tracking-widest">
              {isActive ? "Running" : "Paused"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 mt-6 md:mt-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300",
              sessionType === "Focus"
                ? "bg-gradient-to-tr from-primary to-purple-500 shadow-primary/25 hover:shadow-primary/40 border-t border-white/20"
                : "bg-gradient-to-tr from-cyan-500 to-accent shadow-accent/25 hover:shadow-accent/40 border-t border-white/20"
            )}
          >
            {isActive ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSkip}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-colors"
            title="Skip Session"
          >
            <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
