import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ChatCoach } from "@/components/ChatCoach";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createAnalysisSession } from "@/api/analysis-session/analysis-session.api";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GeminiModel } from "@/common/enums";

type Step = "upload" | "analyzing" | "results";

export default function AnalysisSession() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);
  const [context, setContext] = React.useState("");
  const [model, setModel] = React.useState<GeminiModel>(GeminiModel.GEMINI_3_PRO_PREVIEW);
  const [step, setStep] = React.useState<Step>("upload");
  const [analysisData, setAnalysisData] = React.useState<any>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  // WebSocket connection for real-time analysis updates
  const { isConnected: socketConnected, error: socketError } = useWebSocket({
    sessionId,
    onAnalysisResponse: (data) => {
      console.log("Analysis complete, updating UI:", data);
      setAnalysisData(data);
      setStep("results");
      toast.success("Analysis complete!");
    },
    onJoinedConversation: (data) => {
      console.log("Successfully joined conversation:", data);
    },
    onSessionComplete: (data) => {
      console.log("Received analysis session complete:", data);
      // Update with the actual analysis result
      if (data.analysisResult) {
        setAnalysisData(data.analysisResult);
        setStep("results");
        toast.success("Analysis complete!");
      }
    },
  });

  // Redirect unauthenticated users to login
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Handle socket errors
  React.useEffect(() => {
    if (socketError) {
      console.error("WebSocket error:", socketError);
      toast.error(`Connection error: ${socketError}`);
    }
  }, [socketError]);

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one screenshot");
      return;
    }

    setIsUploading(true);
    setStep("analyzing");

    try {
      const urls = await uploadMultipleToCloudinary(files, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedUrls(urls);
      setIsUploading(false);
      setUploadProgress(100);

      toast.info("Setting up an analysis session...");
      const result = await createAnalysisSession(
        {
          contextMessage: context || undefined,
          model,
        },
        urls
      );

      setSessionId(result.id);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create analysis session");
      setStep("upload");
    } finally {
      setIsUploading(false);
    }
  };

  const resetAnalysis = () => {
    setFiles([]);
    setUploadedUrls([]);
    setContext("");
    setAnalysisData(null);
    setUploadProgress(0);
    setSessionId(null);
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
    return null;
  }

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src="/logo-without-background.png" alt="Logo" className="h-8 w-10" />
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
              className="mx-auto max-w-2xl space-y-4"
            >
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold">Analyze Your Conversation</h1>
                <p className="mt-2 text-muted-foreground">
                  Upload screenshots of your chat to get personalized insights
                </p>
              </div>

              <FileUpload
                files={files}
                onFilesChange={setFiles}
                uploadedUrls={uploadedUrls}
                onUploadedUrlsChange={setUploadedUrls}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />


              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Context (optional)
                </label>
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. 'This is a conversation with my partner' or 'We recently argued about X'"
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-4">
                <Select value={model} onValueChange={(value) => setModel(value as GeminiModel)}>
                  <SelectTrigger className="w-[180px] h-11">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GeminiModel).map((modelValue) => (
                      <SelectItem key={modelValue} value={modelValue}>
                        {modelValue.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAnalyze}
                  disabled={files.length === 0}
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
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
                    sessionId={sessionId}
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
