import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  hoverScale = 1.02, 
  hoverY = -5,
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: { type: "spring", stiffness: 300 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = "", glowColor = "rgba(59, 130, 246, 0.5)" }: GlowCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl blur-lg opacity-0"
        style={{ 
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)` 
        }}
        whileHover={{ 
          opacity: 0.6,
          transition: { duration: 0.3 }
        }}
      />
      <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        {children}
      </Card>
    </motion.div>
  );
}

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientCard({ 
  children, 
  className = "", 
  gradient = "from-primary/10 to-blue-600/10" 
}: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className={className}
    >
      <Card className={`bg-gradient-to-br ${gradient} backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
        {children}
      </Card>
    </motion.div>
  );
}

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  iconGradient?: string;
}

export function IconCard({ 
  icon, 
  title, 
  description, 
  className = "",
  iconGradient = "from-primary to-blue-600"
}: IconCardProps) {
  return (
    <AnimatedCard className={className}>
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="text-center">
          <motion.div 
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${iconGradient} flex items-center justify-center shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </AnimatedCard>
  );
}