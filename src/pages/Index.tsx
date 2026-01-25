import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, MessageCircle, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ChatCoach } from "@/components/ChatCoach";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = "upload" | "analyzing" | "results";

export default function Index() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = React.useState<File[]>([]);
  const [context, setContext] = React.useState("");
  const [step, setStep] = React.useState<Step>("upload");
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAuthSuccess = () => {
    // Redirect to onboarding for new users
    navigate("/onboarding");
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one screenshot");
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      // Convert files to base64 data URLs for the AI
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageUrls, contextMessage: context }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisData(data);
      setStep("results");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
      setStep("upload");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFiles([]);
    setContext("");
    setAnalysisData(null);
    setStep("upload");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-calm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gradient-calm p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-light px-4 py-2">
            <img src="/logo-without-background.png" alt="Logo" className="h-5 w-5" />
            <span className="font-display text-lg font-medium text-primary">HeartSpeak</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Understand Your
            <span className="block text-primary">Conversations Better</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            AI-powered analysis to help you understand people and communicate with clarity and compassion
          </p>
        </motion.div>
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold">HeartSpeak</span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl space-y-6"
            >
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold">Analyze Your Conversation</h1>
                <p className="mt-2 text-muted-foreground">
                  Upload screenshots of your chat to get personalized insights
                </p>
              </div>

              <FileUpload files={files} onFilesChange={setFiles} />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Context (optional)
                </label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. 'This is a conversation with my partner' or 'We recently argued about X'"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={files.length === 0}
                size="lg"
                className="w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-sage-light p-6"
              >
                <Sparkles className="h-12 w-12 text-primary" />
              </motion.div>
              <h2 className="mt-6 font-display text-2xl font-semibold">Analyzing your conversation...</h2>
              <p className="mt-2 text-muted-foreground">Our AI coaches are reviewing the emotional dynamics</p>
            </motion.div>
          )}

          {step === "results" && analysisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8 lg:grid-cols-2"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold">Analysis Results</h2>
                  <Button variant="outline" onClick={resetAnalysis}>
                    New Analysis
                  </Button>
                </div>
                <AnalysisResults data={analysisData} />
              </div>

              <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-8rem)]">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                  <div className="flex items-center gap-2 border-b border-border bg-sage-light/50 px-4 py-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold">Chat with Your Coach</span>
                  </div>
                  <ChatCoach
                    analysisContext={JSON.stringify(analysisData)}
                    className="flex-1"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
