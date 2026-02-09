export interface AnalysisResponse {
  id: string;
  sessionId: string;
  relationshipType: string;
  emotionAnalysis: {
    user: {
      summary: string;
      emotions: Record<string, number>;
    };
    partner: {
      summary: string;
      emotions: Record<string, number>;
    };
    overallTone: string;
  };
  intentAnalysis: {
    user: string;
    partner: string;
  };
  communicationAdvice: string;
  relationshipInsights: string;
  redFlags: string[];
  healthyResponses: string[];
  summary: string;
  createdAt: string;
}

export interface AnalysisSessionCompletePayload {
  sessionId: string;
  status: string;
  analysisResult: AnalysisResponse;
}
