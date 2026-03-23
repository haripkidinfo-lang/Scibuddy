import { motion } from "framer-motion";

export function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background">
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/cyber-bg.png)` }}
      />
      
      <div className="absolute inset-0 bg-grid-pattern" />
      
      <motion.div 
        className="glow-orb glow-orb-primary w-[600px] h-[600px]"
        initial={{ top: '20%', left: '20%', scale: 0.8 }}
        animate={{ 
          top: ['20%', '25%', '15%', '20%'],
          left: ['20%', '15%', '25%', '20%'],
          scale: [0.8, 1, 0.9, 0.8]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="glow-orb glow-orb-accent w-[500px] h-[500px]"
        initial={{ bottom: '10%', right: '10%', scale: 0.9 }}
        animate={{ 
          bottom: ['10%', '5%', '15%', '10%'],
          right: ['10%', '15%', '5%', '10%'],
          scale: [0.9, 1.1, 0.8, 0.9]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="absolute inset-0" 
           style={{ background: 'radial-gradient(circle at center, transparent 30%, hsl(var(--background)) 100%)' }} />
    </div>
  );
}
