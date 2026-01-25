import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingStepProps } from "@/types/onboarding";
import { MBTI } from "@/common/enums";
import { Brain, ArrowLeft } from "lucide-react";

const mbtiOptions = [
  { value: MBTI.INTJ, label: "INTJ", description: "The Architect", image: "/mbti/mbti_intj_architect_1769330519394.png" },
  { value: MBTI.INTP, label: "INTP", description: "The Logician", image: "/mbti/mbti_intp_logician_1769330535596.png" },
  { value: MBTI.ENTJ, label: "ENTJ", description: "The Commander", image: "/mbti/mbti_entj_commander_1769330553403.png" },
  { value: MBTI.ENTP, label: "ENTP", description: "The Debater", image: "/mbti/mbti_entp_debater_1769330570005.png" },
  { value: MBTI.INFJ, label: "INFJ", description: "The Advocate", image: "/mbti/mbti_infj_advocate_1769330584466.png" },
  { value: MBTI.INFP, label: "INFP", description: "The Mediator", image: "/mbti/mbti_infp_mediator_1769330598854.png" },
  { value: MBTI.ENFJ, label: "ENFJ", description: "The Protagonist", image: "/mbti/mbti_enfj_protagonist_1769330613633.png" },
  { value: MBTI.ENFP, label: "ENFP", description: "The Campaigner", image: "/mbti/mbti_enfp_campaigner_1769330628884.png" },
  { value: MBTI.ISTJ, label: "ISTJ", description: "The Logistician", image: "/mbti/mbti_istj_logistician_1769330644548.png" },
  { value: MBTI.ISFJ, label: "ISFJ", description: "The Defender", image: "/mbti/mbti_isfj_defender_1769330657827.png" },
  { value: MBTI.ESTJ, label: "ESTJ", description: "The Executive", image: "/mbti/mbti_estj_executive_1769330674381.png" },
  { value: MBTI.ESFJ, label: "ESFJ", description: "The Consul", image: "/mbti/mbti_esfj_consul_1769330689282.png" },
  { value: MBTI.ISTP, label: "ISTP", description: "The Virtuoso", image: "/mbti/mbti_istp_virtuoso_1769330704359.png" },
  { value: MBTI.ISFP, label: "ISFP", description: "The Adventurer", image: "/mbti/mbti_isfp_adventurer_1769330718249.png" },
  { value: MBTI.ESTP, label: "ESTP", description: "The Entrepreneur", image: "/mbti/mbti_estp_entrepreneur_1769330732201.png" },
  { value: MBTI.ESFP, label: "ESFP", description: "The Entertainer", image: "/mbti/mbti_esfp_entertainer_1769330748403.png" },
];

export function MBTIStep({ onNext, onSkip, onBack }: OnboardingStepProps) {
  const [selectedMBTI, setSelectedMBTI] = React.useState<MBTI | null>(null);

  const handleContinue = () => {
    if (selectedMBTI) {
      onNext({ mbti: selectedMBTI });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage-light mb-2">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold">What's your personality type?</h1>
        <p className="text-muted-foreground">
          Select your MBTI type to help us understand your communication style better
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mbtiOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedMBTI === option.value
                  ? "border-primary border-2 bg-sage-light/50"
                  : "border-border"
              }`}
              onClick={() => setSelectedMBTI(option.value)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 text-left space-y-0.5">
                  <p className="font-bold text-base">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={option.image} 
                    alt={option.description}
                    className="h-full w-auto object-contain"
                  />
                </div>
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
            disabled={!selectedMBTI}
            className="min-w-[120px]"
          >
          Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
