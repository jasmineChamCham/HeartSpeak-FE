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
import { AnalysisResponse } from "@/types/analysis.types";

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
  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No analysis results available.</p>
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
                Analysis Summary
              </CardTitle>
              {data.relationshipType && (
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(data.relationshipType)}
                  <Badge variant="outline" className="capitalize">
                    {data.relationshipType}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {data.summary && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm leading-relaxed">{data.summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion Analysis */}
      {data.emotionAnalysis && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Heart className="h-5 w-5 text-peach" />
                Emotional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.emotionAnalysis.user && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your Emotions</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <p className="text-sm leading-relaxed">{data.emotionAnalysis.user}</p>
                  </div>
                </div>
              )}

              {data.emotionAnalysis.partner && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Partner's Emotions</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <p className="text-sm leading-relaxed">{data.emotionAnalysis.partner}</p>
                  </div>
                </div>
              )}

              {data.emotionAnalysis.overallTone && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">
                    <span className="font-medium">Overall Tone: </span>
                    {data.emotionAnalysis.overallTone}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Intent Analysis */}
      {data.intentAnalysis && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <Target className="h-5 w-5 text-lavender" />
                Intent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.intentAnalysis.user && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your Intent</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <p className="text-sm leading-relaxed">{data.intentAnalysis.user}</p>
                  </div>
                </div>
              )}

              {data.intentAnalysis.partner && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Partner's Intent</p>
                  <div className="rounded-lg border border-border bg-card/50 p-3">
                    <p className="text-sm leading-relaxed">{data.intentAnalysis.partner}</p>
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
                Relationship Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.relationshipInsights}</p>
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
                Red Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.redFlags.map((flag, i) => (
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

      {/* Communication Advice */}
      {data.communicationAdvice && (
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                Communication Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{data.communicationAdvice}</p>
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
                Healthy Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.healthyResponses.map((response, i) => (
                  <li key={i} className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                    <p className="text-sm font-medium text-primary italic">
                      "{response}"
                    </p>
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
