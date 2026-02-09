export enum MBTI {
  ISTJ = "ISTJ",
  ISFJ = "ISFJ",
  INFJ = "INFJ",
  INTJ = "INTJ",
  ISTP = "ISTP",
  ISFP = "ISFP",
  INFP = "INFP",
  INTP = "INTP",
  ESTP = "ESTP",
  ESFP = "ESFP",
  ENFP = "ENFP",
  ENTP = "ENTP",
  ESTJ = "ESTJ",
  ESFJ = "ESFJ",
  ENFJ = "ENFJ",
  ENTJ = "ENTJ",
}

export enum ZodiacSign {
  ARIES = "aries",
  TAURUS = "taurus",
  GEMINI = "gemini",
  CANCER = "cancer",
  LEO = "leo",
  VIRGO = "virgo",
  LIBRA = "libra",
  SCORPIO = "scorpio",
  SAGITTARIUS = "sagittarius",
  CAPRICORN = "capricorn",
  AQUARIUS = "aquarius",
  PISCES = "pisces",
}

export enum LoveLanguage {
  WORDS_OF_AFFIRMATION = "words_of_affirmation",
  QUALITY_TIME = "quality_time",
  RECEIVING_GIFTS = "receiving_gifts",
  ACTS_OF_SERVICE = "acts_of_service",
  PHYSICAL_TOUCH = "physical_touch",
}

export enum RelationshipType {
  FRIEND = "friend",
  FAMILY = "family",
  COLLEAGUE = "colleague",
  PARTNER = "partner",
  ACQUAINTANCE = "acquaintance",
  ROMANTIC = "romantic",
  OTHER = "other",
}

export enum AnalysisStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export enum RoleType {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export enum WebSocketEvent {
  START_CHAT = "start_chat",
  JOINED_CONVERSATION = "joined_conversation",
  CHAT_ANALYSIS_RESPONSE = "chat_analysis_response",
  ANALYSIS_SESSION_COMPLETE = "analysis_session_complete",
  CHAT_ANALYSIS_PROGRESS = "chat_analysis_progress",
}

export enum GeminiModel {
  GEMINI_2_5_FLASH = "gemini-2.5-flash",
  GEMINI_2_5_PRO = "gemini-2.5-pro",
  GEMINI_2_0_FLASH = "gemini-2.0-flash",
  GEMINI_FLASH_LATEST = "gemini-flash-latest",
  GEMINI_FLASH_LITE_LATEST = "gemini-flash-lite-latest",
  GEMINI_PRO_LATEST = "gemini-pro-latest",
  GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite",
  GEMINI_3_PRO_PREVIEW = "gemini-3-pro-preview",
  GEMINI_3_FLASH_PREVIEW = "gemini-3-flash-preview",
  GEMINI_3_PRO_IMAGE_PREVIEW = "gemini-3-pro-image-preview",
  NANO_BANANA_PRO_PREVIEW = "nano-banana-pro-preview",
}
