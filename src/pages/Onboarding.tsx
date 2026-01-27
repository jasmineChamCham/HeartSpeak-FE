import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingStep } from "@/types/onboarding";
import { MBTIStep } from "@/components/onboarding/MBTIStep";
import { ZodiacStep } from "@/components/onboarding/ZodiacStep";
import { LoveLanguagesStep } from "@/components/onboarding/LoveLanguagesStep";
import { MBTI, ZodiacSign, LoveLanguage } from "@/common/enums";
import { updateUser } from "@/api/user/user.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MAIN_PAGE } from "@/common/constant";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = React.useState<OnboardingStep>(OnboardingStep.MBTI);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [userData, setUserData] = React.useState<{
    mbti?: MBTI;
    zodiacSign?: ZodiacSign;
    loveLanguages: LoveLanguage[];
  }>({
    loveLanguages: [],
  });

  const [localUser, setLocalUser] = React.useState<any>(null);

  // Check for user in localStorage on mount (more reliable than waiting for auth context)
  React.useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        setLocalUser(JSON.parse(userJson));
      } catch (e) {
        navigate(MAIN_PAGE);
      }
    } else {
      navigate(MAIN_PAGE);
    }
  }, [navigate]);

  // Use either the auth context user or the localStorage user
  const currentUser = user || localUser;

  const handleNext = async (data?: any) => {
    // Update local state
    if (data) {
      setUserData((prev) => ({ ...prev, ...data }));
    }

    // Move to next step
    switch (currentStep) {
      case OnboardingStep.MBTI:
        setCurrentStep(OnboardingStep.ZODIAC);
        break;
      case OnboardingStep.ZODIAC:
        setCurrentStep(OnboardingStep.LOVE_LANGUAGES);
        break;
      case OnboardingStep.LOVE_LANGUAGES:
        // Save all data and complete onboarding
        await completeOnboarding({ ...userData, ...data });
        break;
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleBack = () => {
    switch (currentStep) {
      case OnboardingStep.ZODIAC:
        setCurrentStep(OnboardingStep.MBTI);
        break;
      case OnboardingStep.LOVE_LANGUAGES:
        setCurrentStep(OnboardingStep.ZODIAC);
        break;
      // MBTI is the first step, can't go back
      default:
        break;
    }
  };

  const completeOnboarding = async (finalData: typeof userData) => {
    if (!currentUser?.id) return;

    setIsUpdating(true);
    try {
      await updateUser(currentUser.id, finalData);
      
      // Update user in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...finalData }));
      }

      toast.success("Profile completed! Let's get started!");
      navigate(MAIN_PAGE);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      toast.error("Failed to save your preferences. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getProgress = () => {
    switch (currentStep) {
      case OnboardingStep.MBTI:
        return 33;
      case OnboardingStep.ZODIAC:
        return 66;
      case OnboardingStep.LOVE_LANGUAGES:
        return 100;
      default:
        return 0;
    }
  };

  if (!currentUser) {
    return null;
  }

  if (isUpdating) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-calm">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Saving your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-calm flex flex-col">
      {/* Header with Progress */}
      <div className="container py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo-without-background.png" alt="Logo" className="h-6 w-6" />
              <span className="font-display text-lg font-semibold text-primary">HeartSpeak</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(MAIN_PAGE)}
            >
              Skip All
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Complete Your Profile</span>
              <span>{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="flex-1 container py-8">
        <AnimatePresence mode="wait">
          {currentStep === OnboardingStep.MBTI && (
            <motion.div
              key="mbti"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MBTIStep
                onNext={handleNext}
                onSkip={handleSkip}
                onBack={handleBack}
                userId={currentUser.id}
              />
            </motion.div>
          )}

          {currentStep === OnboardingStep.ZODIAC && (
            <motion.div
              key="zodiac"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ZodiacStep
                onNext={handleNext}
                onSkip={handleSkip}
                onBack={handleBack}
                userId={currentUser.id}
              />
            </motion.div>
          )}

          {currentStep === OnboardingStep.LOVE_LANGUAGES && (
            <motion.div
              key="love-languages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoveLanguagesStep
                onNext={handleNext}
                onSkip={handleSkip}
                onBack={handleBack}
                userId={currentUser.id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
