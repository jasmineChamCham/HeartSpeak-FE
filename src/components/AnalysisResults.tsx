import { motion } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp,
  Sparkles,
  Target,
  Shield,
  ArrowRight,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PrimaryEmotion {
  speaker: "self" | "other" | "both";
  emotion: string;
  intensity: number;
}

interface EmotionAnalysis {
  primary_emotions: PrimaryEmotion[];
  emotional_pattern: string;
}

interface DetectedIntent {
  speaker: "self" | "other";
  intent: string;
  misalignment: boolean;
}

interface IntentAnalysis {
  detected_intents: DetectedIntent[];
  core_misunderstanding: string;
}

interface HealthierReframe {
  original_style: string;
  suggested_rewrite: string;
  why_it_works: string;
}

interface CommunicationCoach {
  what_went_wrong: string;
  healthier_reframe: HealthierReframe[];
  suggested_next_message: string;
  what_to_avoid: string[];
}

interface ConversationSummary {
  context: string;
  relationship_type: "romantic" | "friendship" | "family" | "work" | "unknown";
  main_issue: string;
}

interface AnalysisData {
  confidence: "high" | "medium" | "low";
  conversation_summary: ConversationSummary;
  emotion_analysis: EmotionAnalysis;
  intent_analysis: IntentAnalysis;
  communication_coach: CommunicationCoach;
  emotional_red_flags: string[];
  growth_insight: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case "high":
      return "bg-primary/10 text-primary border-primary/20";
    case "medium":
      return "bg-peach text-accent-foreground border-peach";
    case "low":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getRelationshipIcon = (type: string) => {
  switch (type) {
    case "romantic":
      return <Heart className="h-4 w-4" />;
    case "family":
      return <Users className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
};

const getSpeakerLabel = (speaker: string) => {
  switch (speaker) {
    case "self":
      return "You";
    case "other":
      return "Other Person";
    case "both":
      return "Both";
    default:
      return speaker;
  }
};

const getIntensityWidth = (intensity: number) => {
  return `${Math.round(intensity * 100)}%`;
};

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Confidence & Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sage-light to-lavender-light pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Conversation Summary
              </CardTitle>
              <Badge className={`${getConfidenceColor(data.confidence)} capitalize`}>
                {data.confidence} confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-2">
              {getRelationshipIcon(data.conversation_summary.relationship_type)}
              <Badge variant="outline" className="capitalize">
                {data.conversation_summary.relationship_type} relationship
              </Badge>
            </div>
            <p className="text-foreground leading-relaxed">
              {data.conversation_summary.context}
            </p>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm">
                <span className="font-medium text-primary">Main Issue: </span>
                {data.conversation_summary.main_issue}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Analysis */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Heart className="h-5 w-5 text-peach" />
              Emotional Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.emotion_analysis.primary_emotions?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Primary Emotions</p>
                {data.emotion_analysis.primary_emotions.map((emotion, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getSpeakerLabel(emotion.speaker)}
                        </Badge>
                        <span className="capitalize font-medium">{emotion.emotion}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {Math.round(emotion.intensity * 100)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: getIntensityWidth(emotion.intensity) }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-sage to-lavender"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {data.emotion_analysis.emotional_pattern && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm">
                  <span className="font-medium">Emotional Pattern: </span>
                  {data.emotion_analysis.emotional_pattern}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Intent Analysis */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Target className="h-5 w-5 text-lavender" />
              Intent Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.intent_analysis.detected_intents?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Detected Intents</p>
                {data.intent_analysis.detected_intents.map((intent, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3">
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {getSpeakerLabel(intent.speaker)}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{intent.intent}</p>
                      {intent.misalignment && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Misalignment detected
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {data.intent_analysis.core_misunderstanding && (
              <div className="rounded-lg bg-peach/30 border border-peach p-3">
                <p className="text-sm">
                  <span className="font-medium">Core Misunderstanding: </span>
                  {data.intent_analysis.core_misunderstanding}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Red Flags */}
      {data.emotional_red_flags && data.emotional_red_flags.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emotional Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.emotional_red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Communication Coach */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              Communication Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What Went Wrong */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">What Went Wrong</p>
              <p className="text-sm leading-relaxed">{data.communication_coach.what_went_wrong}</p>
            </div>

            {/* Healthier Reframes */}
            {data.communication_coach.healthier_reframe?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Healthier Ways to Say It</p>
                <Accordion type="single" collapsible className="space-y-2">
                  {data.communication_coach.healthier_reframe.map((reframe, i) => (
                    <AccordionItem
                      key={i}
                      value={`reframe-${i}`}
                      className="rounded-lg border border-border px-4 bg-card/50"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-destructive/70 line-through">{reframe.original_style}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-primary font-medium">{reframe.suggested_rewrite}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-3">
                        <p className="text-sm text-muted-foreground bg-sage-light/50 rounded-lg p-3">
                          <span className="font-medium text-foreground">Why it works: </span>
                          {reframe.why_it_works}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Suggested Next Message */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Suggested Next Message</p>
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                <p className="text-sm font-medium text-primary italic">
                  "{data.communication_coach.suggested_next_message}"
                </p>
              </div>
            </div>

            {/* What to Avoid */}
            {data.communication_coach.what_to_avoid?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">What to Avoid</p>
                <ul className="space-y-1">
                  {data.communication_coach.what_to_avoid.map((avoid, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-destructive/80">
                      <span className="text-destructive">✗</span>
                      {avoid}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Growth Insight */}
      {data.growth_insight && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card bg-gradient-to-br from-card to-sage-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Growth Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {data.growth_insight}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
