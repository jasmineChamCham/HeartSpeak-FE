import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart,
  MessageCircle,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Target,
  Shield,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { extractAnalysisText } from "@/common/utils";

import { AnalysisResponse } from "@/types/analysis.types";
import { EmotionBar } from "@/components/ui/emotion-bar";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AnalysisResultsProps {
  data: AnalysisResponse;
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

interface EmotionData {
  summary: string;
  emotions: Record<string, number>;
}

interface EmotionSectionProps {
  title: string;
  emotionData: EmotionData;
}

function EmotionSection({ title, emotionData }: EmotionSectionProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  // Sort emotions by intensity (highest first)
  const emotions = emotionData.emotions || {};
  const sortedEmotions = Object.entries(emotions).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-7 text-xs"
        >
          {showDetails ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              {t("analysis_results.hide_details")}
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              {t("analysis_results.show_details")}
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        {sortedEmotions.length > 0 ? (
          sortedEmotions.map(([emotion, intensity], index) => (
            <EmotionBar
              key={emotion}
              emotion={emotion}
              intensity={intensity}
              index={index}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">{t("analysis_results.no_emotions")}</p>
        )}
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-border bg-card/50 p-3 mt-2">
              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={extractAnalysisText(emotionData.summary)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmotionalAnalysisCard({ emotionAnalysis }: { emotionAnalysis: AnalysisResponse["emotionAnalysis"] }) {
  const { t } = useTranslation();
  return (
    <motion.div variants={itemVariants}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Heart className="h-5 w-5 text-peach" />
            {t("analysis_results.emotional_analysis")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {emotionAnalysis.user && (
            <EmotionSection
              title={t("analysis_results.your_emotions")}
              emotionData={emotionAnalysis.user}
            />
          )}

          {emotionAnalysis.partner && (
            <EmotionSection
              title={t("analysis_results.partner_emotions")}
              emotionData={emotionAnalysis.partner}
            />
          )}

          {emotionAnalysis.overallTone && (
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="text-sm">
                <span className="font-medium">{t("analysis_results.overall_tone")} </span>
                <MarkdownRenderer content={extractAnalysisText(emotionAnalysis.overallTone)} className="inline-block" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

const getRelationshipIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "romantic":
      return <Heart className="h-4 w-4" />;
    case "family":
      return <Users className="h-4 w-4" />;
    case "friendship":
      return <Users className="h-4 w-4" />;
    default:
      return <MessageCircle className="h-4 w-4" />;
  }
};

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const { t } = useTranslation();

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{t("analysis_results.no_results")}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="glass-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-sage-light to-lavender-light pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-display text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                {t("analysis_results.analysis_summary")}
              </CardTitle>
              {data.relationshipType && (
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(data.relationshipType)}
                  <Badge variant="outline" className="capitalize">
                    {t(`relationship.${data.relationshipType.toLowerCase()}`, { defaultValue: data.relationshipType })}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {data.summary && (
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer content={extractAnalysisText(data.summary)} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Analysis */}
      {data.emotionAnalysis && (
        <EmotionalAnalysisCard emotionAnalysis={data.emotionAnalysis} />
      )}

      {/* Intent Analysis */}
      {data.intentAnalysis && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Target className="h-5 w-5 text-lavender" />
                {t("analysis_results.intent_analysis")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.intentAnalysis.user && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("analysis_results.your_intent")}</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <div className="text-sm leading-relaxed">
                      <MarkdownRenderer content={extractAnalysisText(data.intentAnalysis.user)} />
                    </div>
                  </div>
                </div>
              )}

              {data.intentAnalysis.partner && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{t("analysis_results.partner_intent")}</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <div className="text-sm leading-relaxed">
                      <MarkdownRenderer content={extractAnalysisText(data.intentAnalysis.partner)} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Relationship Insights */}
      {data.relationshipInsights && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("analysis_results.relationship_insights")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={extractAnalysisText(data.relationshipInsights)} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Red Flags */}
      {data.redFlags && data.redFlags.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                {t("analysis_results.red_flags")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <MarkdownRenderer content={flag} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Communication Advice */}
      {data.communicationAdvice && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                {t("analysis_results.communication_advice")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed">
                <MarkdownRenderer content={extractAnalysisText(data.communicationAdvice)} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Healthy Responses */}
      {data.healthyResponses && data.healthyResponses.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card bg-gradient-to-br from-card to-sage-light/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                {t("analysis_results.healthy_responses")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.healthyResponses.map((response, i) => (
                  <li key={i} className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                    <div className="text-sm font-medium text-primary italic">
                      <MarkdownRenderer content={`"${extractAnalysisText(response)}"`} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
