import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, ArrowRight, Loader2, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ChatCoach } from "@/components/ChatCoach";
import { AnalysisSessionsSidebar } from "@/components/AnalysisSessionsSidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createAnalysisSession, getAnalysisSession } from "@/api/analysis-session/analysis-session.api";
import { useQuery } from "@tanstack/react-query";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisStatus, GeminiModel, RelationshipType } from "@/common/enums";
import type { AnalysisSession as AnalysisSessionType } from "@/types/analysis-session";

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [addToSidebar, setAddToSidebar] = React.useState<((session: AnalysisSessionType) => void) | null>(null);
  const [currentSession, setCurrentSession] = React.useState<AnalysisSessionType | null>(null);

  const { isConnected: socketConnected, error: socketError } = useWebSocket({
    sessionId,
    onAnalysisResponse: (data) => {
      if (step !== "results") {
        console.log("Analysis complete, updating UI:", data);
        setAnalysisData(data);
        setStep("results");
        toast.success("Analysis complete!");
      } else {
        console.log("Ignoring analysis response - results already displayed");
      }
    },
    onJoinedConversation: (data) => {
      console.log("Successfully joined conversation:", data);
    },
    onSessionComplete: async (data) => {
      console.log("Received analysis session complete:", data);
      // Update with the actual analysis result
      if (data.analysisResult) {
        setAnalysisData(data.analysisResult);
        setStep("results");
        toast.success("Analysis complete!");

        // Fetch updated session to get relationship type
        try {
          const updatedSession = await getAnalysisSession(data.sessionId);
          setCurrentSession(updatedSession);
        } catch (error) {
          console.error("Failed to fetch session details:", error);
        }
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

  const getRelationshipColor = (type?: string) => {
    if (!type) return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    const normalizedType = type.toLowerCase();

    switch (normalizedType) {
      case RelationshipType.PARTNER:
      case RelationshipType.ROMANTIC:
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20";
      case RelationshipType.FRIEND:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case RelationshipType.FAMILY:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case RelationshipType.COLLEAGUE:
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case RelationshipType.ACQUAINTANCE:
        return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const formatRelationshipType = (type?: string) => {
    if (!type) return "Unknown";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

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

      if (addToSidebar) {
        addToSidebar(result);
      }
      setCurrentSession(result);
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
    setUploadProgress(0);
    setSessionId(null);
    setCurrentSession(null);
    setStep("upload");
  };

  const { data: fetchedSession, isLoading: isSessionLoading } = useQuery({
    queryKey: ["analysisSession", sessionId],
    queryFn: () => getAnalysisSession(sessionId!),
    enabled: !!sessionId,
  });

  React.useEffect(() => {
    if (fetchedSession) {
      setCurrentSession(fetchedSession);
      if (fetchedSession.status === AnalysisStatus.COMPLETED && fetchedSession.result) {
        setAnalysisData(fetchedSession.result);
        setStep("results");
      } else if (fetchedSession.status === AnalysisStatus.PROCESSING || fetchedSession.status === AnalysisStatus.PENDING) {
        setStep("analyzing");
      }
    }
  }, [fetchedSession]);

  const handleSessionSelect = (session: AnalysisSessionType) => {
    setSessionId(session.id);
    // Optimistically set the session to show immediate feedback
    setCurrentSession(session);

    // Check local state first for immediate UI feedback while fetching fresh data
    if (session.status === AnalysisStatus.COMPLETED && session.result) {
      setAnalysisData(session.result);
      setStep("results");
    } else if (session.status === AnalysisStatus.PROCESSING || session.status === AnalysisStatus.PENDING) {
      setStep("analyzing");
    }
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
    <div className="flex min-h-screen gradient-calm">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:relative inset-y-0 left-0 z-40 h-screen"
          >
            <AnalysisSessionsSidebar
              onSessionSelect={handleSessionSelect}
              currentSessionId={sessionId}
              onNewSession={(callback) => setAddToSidebar(() => callback)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Reopen Sidebar Button */}
      {!isSidebarOpen && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-4 top-4 z-30 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 p-2 hover:bg-card transition-colors shadow-lg"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </motion.button>
      )}

      {/* Main Content */}
      <motion.div
        layout
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden"
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <Header
          user={user}
          onProfileClick={() => navigate("/profile")}
          onSignOut={signOut}
        />

        <main className="container py-8 flex-1 overflow-hidden">
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
                className="grid gap-8 lg:grid-cols-2 h-full overflow-hidden"
              >
                <div className="space-y-4 overflow-y-auto pr-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-2xl font-bold">Analysis Results</h2>
                      {currentSession?.relationship?.relation && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-medium",
                            getRelationshipColor(currentSession.relationship.relation)
                          )}
                        >
                          {formatRelationshipType(currentSession.relationship.relation)}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={resetAnalysis}>
                      New Analysis
                    </Button>
                  </div>
                  <AnalysisResults data={analysisData} />
                </div>

                <div className="h-full overflow-hidden">
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
      </motion.div>
    </div>
  );
}
