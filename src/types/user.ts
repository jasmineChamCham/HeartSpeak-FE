import { MBTI, LoveLanguage, ZodiacSign, RoleType } from "@/common/enums";

/**
 * User update request body based on backend UpdateUserByIdRequestBody
 * Only include fields that need to be updated
 */
export interface UpdateUserRequestBody {
  displayName?: string;
  avatarUrl?: string;
  email?: string;
  role?: RoleType;
  mbti?: MBTI;
  zodiacSign?: ZodiacSign;
  loveLanguages?: LoveLanguage[];
  isAllowUserData?: boolean;
}

/**
 * User data returned from API
 */
export interface User {
  id: string;
  displayName?: string;
  avatarUrl?: string;
  email: string;
  role: RoleType;
  mbti?: MBTI;
  zodiacSign?: ZodiacSign;
  loveLanguages?: LoveLanguage[];
  isAllowUserData?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
