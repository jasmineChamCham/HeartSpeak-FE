export interface AnalysisResult {
  id: string;
  sessionId: string;
  emotionAnalysis?: EmotionAnalysis;
  intentAnalysis?: IntentAnalysis;
  communicationAdvice?: string;
  relationshipInsights?: string;
  redFlags?: RedFlag[];
  healthyResponses?: HealthyResponse[];
  summary?: string;
  createdAt: string;
}

export interface EmotionAnalysis {
  dominantEmotion?: string;
  emotionalTone?: string;
  intensity?: number;
  details?: string;
}

export interface IntentAnalysis {
  primaryIntent?: string;
  secondaryIntents?: string[];
  communicationStyle?: string;
  details?: string;
}

export interface RedFlag {
  type: string;
  description: string;
  severity?: string;
}

export interface HealthyResponse {
  situation: string;
  response: string;
  rationale?: string;
}
