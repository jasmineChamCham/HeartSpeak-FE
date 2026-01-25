import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingStepProps } from "@/types/onboarding";
import { ZodiacSign } from "@/common/enums";
import { Stars, ArrowLeft } from "lucide-react";

const zodiacOptions = [
  { value: ZodiacSign.ARIES, label: "Aries", emoji: "♈", dates: "Mar 21 - Apr 19" },
  { value: ZodiacSign.TAURUS, label: "Taurus", emoji: "♉", dates: "Apr 20 - May 20" },
  { value: ZodiacSign.GEMINI, label: "Gemini", emoji: "♊", dates: "May 21 - Jun 20" },
  { value: ZodiacSign.CANCER, label: "Cancer", emoji: "♋", dates: "Jun 21 - Jul 22" },
  { value: ZodiacSign.LEO, label: "Leo", emoji: "♌", dates: "Jul 23 - Aug 22" },
  { value: ZodiacSign.VIRGO, label: "Virgo", emoji: "♍", dates: "Aug 23 - Sep 22" },
  { value: ZodiacSign.LIBRA, label: "Libra", emoji: "♎", dates: "Sep 23 - Oct 22" },
  { value: ZodiacSign.SCORPIO, label: "Scorpio", emoji: "♏", dates: "Oct 23 - Nov 21" },
  { value: ZodiacSign.SAGITTARIUS, label: "Sagittarius", emoji: "♐", dates: "Nov 22 - Dec 21" },
  { value: ZodiacSign.CAPRICORN, label: "Capricorn", emoji: "♑", dates: "Dec 22 - Jan 19" },
  { value: ZodiacSign.AQUARIUS, label: "Aquarius", emoji: "♒", dates: "Jan 20 - Feb 18" },
  { value: ZodiacSign.PISCES, label: "Pisces", emoji: "♓", dates: "Feb 19 - Mar 20" },
];

export function ZodiacStep({ onNext, onSkip, onBack }: OnboardingStepProps) {
  const [selectedZodiac, setSelectedZodiac] = React.useState<ZodiacSign | null>(null);

  const handleContinue = () => {
    if (selectedZodiac) {
      onNext({ zodiacSign: selectedZodiac });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-light mb-2">
          <Stars className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">What's your zodiac sign?</h1>
        <p className="text-muted-foreground">
          Your star sign can give us insights into your personality traits
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {zodiacOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedZodiac === option.value
                  ? "border-primary border-2 bg-sage-light/50"
                  : "border-border"
              }`}
              onClick={() => setSelectedZodiac(option.value)}
            >
              <div className="text-center space-y-1">
                <p className="text-2xl">{option.emoji}</p>
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.dates}</p>
              </div>
            </Card>
          </motion.div>
        ))}
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
            disabled={!selectedZodiac}
            className="min-w-[120px]"
          >
          Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
