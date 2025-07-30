"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, CheckCircle, Loader2, Clock } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    avgGenerationTime: string;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  index: number;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statData = [
    { title: "Total Projets", value: stats.totalProjects, icon: FolderOpen, color: "from-blue-500 to-cyan-500" },
    { title: "Terminés", value: stats.completedProjects, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
    { title: "En Cours", value: stats.inProgressProjects, icon: Loader2, color: "from-purple-500 to-violet-500" },
    { title: "Temps Moyen", value: stats.avgGenerationTime, icon: Clock, color: "from-orange-500 to-amber-500" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {statData.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
              <motion.p 
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15, delay: index * 0.1 + 0.2 }}
              >
                {value}
              </motion.p>
            </div>
            <motion.div
              className={`w-2.5rem h-2.5rem sm:w-3rem sm:h-3rem bg-gradient-to-r ${color} rounded-lg flex items-center justify-center text-white flex-shrink-0 ml-0.5rem`}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}