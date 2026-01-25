import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalysisRequest {
  imageUrls: string[];
  contextMessage: string;
}

// Required keys in the JSON schema
const REQUIRED_KEYS = [
  "confidence",
  "conversation_summary",
  "emotion_analysis",
  "intent_analysis",
  "communication_coach",
  "emotional_red_flags",
  "growth_insight"
];

function validateAnalysisJSON(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  
  const obj = data as Record<string, unknown>;
  
  // Check all required top-level keys
  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) {
      console.log(`Missing required key: ${key}`);
      return false;
    }
  }
  
  // Validate confidence is one of the allowed values
  if (!["high", "medium", "low"].includes(obj.confidence as string)) {
    console.log(`Invalid confidence value: ${obj.confidence}`);
    return false;
  }
  
  // Validate nested objects exist
  if (typeof obj.conversation_summary !== "object" || obj.conversation_summary === null) return false;
  if (typeof obj.emotion_analysis !== "object" || obj.emotion_analysis === null) return false;
  if (typeof obj.intent_analysis !== "object" || obj.intent_analysis === null) return false;
  if (typeof obj.communication_coach !== "object" || obj.communication_coach === null) return false;
  if (!Array.isArray(obj.emotional_red_flags)) return false;
  
  return true;
}

const MASTER_SYSTEM_PROMPT = `You are an AI Relationship & Communication Coach combining psychology and emotional intelligence.

You will receive:
- Images or video containing chat conversations
- Optional user-provided context

You MUST internally perform the following roles:

1) Emotion Analyzer Agent
- Identify emotional tone, intensity, and emotional shifts
- Detect underlying emotions, not just surface words

2) Intent Detector Agent
- Infer the speaker's intent (even if poorly expressed)
- Detect misunderstandings, emotional mismatch, or defensive patterns

3) Communication Coach Agent
- Suggest healthier communication strategies
- Provide emotionally intelligent rewordings
- Offer practical next-step advice

IMPORTANT MEDIA RULES:
- The media is already readable by you
- DO NOT mention OCR, transcription, or technical steps
- Assume you fully understand the conversation from the media

SAFETY & ETHICS:
- Do NOT provide therapy, diagnosis, or medical advice
- Use supportive, non-judgmental language
- Avoid blaming language
- This is coaching, not mental health treatment

CRITICAL OUTPUT RULE:
- You MUST output ONLY valid JSON
- No markdown
- No explanations outside JSON
- No trailing comments
- No emojis
- No extra text

If you cannot confidently analyze, return JSON with:
"confidence": "low" and explain why inside the JSON only.

JSON FORMAT IS MANDATORY.

You MUST use this EXACT JSON schema:
{
  "confidence": "high | medium | low",
  "conversation_summary": {
    "context": "string",
    "relationship_type": "romantic | friendship | family | work | unknown",
    "main_issue": "string"
  },
  "emotion_analysis": {
    "primary_emotions": [
      {
        "speaker": "self | other | both",
        "emotion": "string",
        "intensity": 0.0
      }
    ],
    "emotional_pattern": "string"
  },
  "intent_analysis": {
    "detected_intents": [
      {
        "speaker": "self | other",
        "intent": "string",
        "misalignment": true
      }
    ],
    "core_misunderstanding": "string"
  },
  "communication_coach": {
    "what_went_wrong": "string",
    "healthier_reframe": [
      {
        "original_style": "string",
        "suggested_rewrite": "string",
        "why_it_works": "string"
      }
    ],
    "suggested_next_message": "string",
    "what_to_avoid": ["string"]
  },
  "emotional_red_flags": ["string"],
  "growth_insight": "string"
}`;

const RETRY_PROMPT = `Your previous response was NOT valid JSON.

You must:
- Output ONLY valid JSON
- Match EXACTLY the required schema
- Do NOT add or remove fields
- Do NOT include explanations or text outside JSON

Fix your response and return the corrected JSON now.`;

async function callAI(
  apiKey: string,
  messages: Array<{ role: string; content: unknown }>
): Promise<Response> {
  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      max_tokens: 4000,
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, contextMessage }: AnalysisRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("No images provided for analysis");
    }

    console.log(`Analyzing ${imageUrls.length} images with context: ${contextMessage}`);

    // Build the content array with images for vision analysis
    const imageContent = imageUrls.map((url: string) => ({
      type: "image_url",
      image_url: { url }
    }));

    const userPrompt = contextMessage 
      ? `Analyze the conversation in these images. User context: "${contextMessage}"`
      : "Analyze the conversation in these images.";

    const initialMessages = [
      { role: "system", content: MASTER_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          ...imageContent
        ]
      }
    ];

    let analysisResult: unknown = null;
    let lastContent = "";
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      console.log(`Attempt ${attempt + 1} of ${MAX_RETRIES}`);

      const messages = attempt === 0 
        ? initialMessages 
        : [
            ...initialMessages,
            { role: "assistant", content: lastContent },
            { role: "user", content: RETRY_PROMPT }
          ];

      const response = await callAI(LOVABLE_API_KEY, messages);

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in AI response");
      }

      lastContent = content;

      // Try to parse as JSON
      try {
        // Remove markdown code blocks if present
        const cleanContent = content
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        
        const parsed = JSON.parse(cleanContent);
        
        // Validate the structure
        if (validateAnalysisJSON(parsed)) {
          analysisResult = parsed;
          console.log(`Valid JSON received on attempt ${attempt + 1}`);
          break;
        } else {
          console.log(`Invalid JSON structure on attempt ${attempt + 1}`);
        }
      } catch (e) {
        console.log(`JSON parse error on attempt ${attempt + 1}:`, e);
      }
    }

    if (!analysisResult) {
      console.error("Failed to get valid JSON after all retries");
      return new Response(
        JSON.stringify({ 
          error: "Unable to analyze the conversation. Please try again with clearer images.",
          confidence: "low"
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
