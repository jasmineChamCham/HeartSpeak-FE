import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingStepProps } from "@/types/onboarding";
import { LoveLanguage } from "@/common/enums";
import { Heart, MessageCircle, Gift, HandHeart, Users, ArrowLeft } from "lucide-react";

const loveLanguageOptions = [
  {
    value: LoveLanguage.WORDS_OF_AFFIRMATION,
    label: "Words of Affirmation",
    icon: MessageCircle,
    description: "Verbal compliments and expressions of love",
    bgColor: "bg-white",
    iconColor: "text-rose-500",
  },
  {
    value: LoveLanguage.QUALITY_TIME,
    label: "Quality Time",
    icon: Users,
    description: "Undivided attention and meaningful activities together",
    bgColor: "bg-white",
    iconColor: "text-indigo-500",
  },
  {
    value: LoveLanguage.RECEIVING_GIFTS,
    label: "Receiving Gifts",
    icon: Gift,
    description: "Thoughtful gifts as symbols of love",
    bgColor: "bg-white",
    iconColor: "text-orange-500",
  },
  {
    value: LoveLanguage.ACTS_OF_SERVICE,
    label: "Acts of Service",
    icon: HandHeart,
    description: "Actions that make life easier",
    bgColor: "bg-white",
    iconColor: "text-teal-500",
  },
  {
    value: LoveLanguage.PHYSICAL_TOUCH,
    label: "Physical Touch",
    icon: Heart,
    description: "Physical expressions of affection",
    bgColor: "bg-white",
    iconColor: "text-pink-500",
  },
];

export function LoveLanguagesStep({ onNext, onSkip, onBack }: OnboardingStepProps) {
  const [selectedLanguages, setSelectedLanguages] = React.useState<LoveLanguage[]>([]);

  const toggleLanguage = (language: LoveLanguage) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(language)) {
        // Remove if already selected
        return prev.filter((l) => l !== language);
      } else if (prev.length < 2) {
        // Add only if less than 2 are selected
        return [...prev, language];
      }
      // Do nothing if already 2 selected
      return prev;
    });
  };

  const handleContinue = () => {
    onNext({ loveLanguages: selectedLanguages });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-light mb-2">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">What are your love languages?</h1>
        <p className="text-muted-foreground">
          Select up to 2 ways you prefer to give and receive love
        </p>
      </div>

      {/* First row - 3 items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loveLanguageOptions.slice(0, 3).map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLanguages.includes(option.value);

          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-md h-full ${
                  isSelected
                    ? "border-primary border-2 bg-sage-light/50"
                    : "border-border"
                }`}
                onClick={() => toggleLanguage(option.value)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-4 rounded-xl ${option.bgColor}`}>
                    <Icon className={`h-8 w-8 ${option.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Second row - 2 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loveLanguageOptions.slice(3, 5).map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLanguages.includes(option.value);

          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-md h-full ${
                  isSelected
                    ? "border-primary border-2 bg-sage-light/50"
                    : "border-border"
                }`}
                onClick={() => toggleLanguage(option.value)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`p-4 rounded-xl ${option.bgColor}`}>
                    <Icon className={`h-8 w-8 ${option.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onSkip}>
          Skip for now
        </Button>
        <div className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={selectedLanguages.length === 0}
            className="min-w-[120px]"
          >
          Complete
          </Button>
        </div>
      </div>
    </div>
  );
}
