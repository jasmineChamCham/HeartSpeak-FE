import { MBTI, LoveLanguage, ZodiacSign } from "@/common/enums";

export interface OnboardingStepProps {
  onNext: (data?: OnboardingStepData) => void;
  onSkip: () => void;
  onBack?: () => void;
  userId: string;
}

export type OnboardingStepData =
  | { mbti: MBTI }
  | { zodiacSign: ZodiacSign }
  | { loveLanguages: LoveLanguage[] };

export enum OnboardingStep {
  MBTI = "mbti",
  ZODIAC = "zodiac",
  LOVE_LANGUAGES = "love_languages",
  COMPLETE = "complete",
}

export interface SelectionOption<T = string> {
  value: T;
  label: string;
  image: string;
  description?: string;
}
