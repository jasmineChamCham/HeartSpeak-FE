import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmotionBarProps {
    emotion: string;
    intensity: number; // 0-1
    index?: number;
}

const emotionColors = [
    "from-lime-500 to-green-600",
    "from-emerald-500 to-teal-600",
    "from-cyan-500 to-blue-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-fuchsia-600",
    "from-pink-500 to-rose-600",
];

export function EmotionBar({ emotion, intensity, index = 0 }: EmotionBarProps) {
    const percentage = Math.round(intensity * 100);
    const colorClass = emotionColors[index % emotionColors.length];

    const emotionLabel =
        emotion.charAt(0).toUpperCase() + emotion.slice(1).replace(/-/g, " ");

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{emotionLabel}</span>
                <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "easeOut",
                    }}
                    className={cn(
                        "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
                        colorClass
                    )}
                />
            </div>
        </div>
    );
}
