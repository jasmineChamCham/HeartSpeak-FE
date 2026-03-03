import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, ArrowRight, Loader2, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ChatCoach } from "@/components/ChatCoach";
import { AnalysisSessionsSidebar } from "@/components/AnalysisSessionsSidebar";
import { AnalysisTextSelectionMenu } from "@/components/AnalysisTextSelectionMenu";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createAnalysisSession, getAnalysisSession, refineAnalysisSession } from "@/api/analysis-session/analysis-session.api";
import { useQuery } from "@tanstack/react-query";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(() => window.innerWidth >= 1024);
  const [sidebarActions, setSidebarActions] = React.useState<{
    upsertSession: (session: AnalysisSessionType) => void;
    refreshSessions: () => void;
  } | null>(null);
  const [currentSession, setCurrentSession] = React.useState<AnalysisSessionType | null>(null);
  const [pendingRefinements, setPendingRefinements] = React.useState<{ id: string; selection: string; comment: string }[]>([]);

  const { isConnected: socketConnected, error: socketError } = useWebSocket({
    sessionId,
    onAnalysisResponse: (data) => {
      if (step !== "results") {
        console.log("Analysis complete, updating UI:", data);
        setAnalysisData(data);
        setStep("results");
        toast.success(t('analysis_session.complete_msg'));
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
        toast.success(t('analysis_session.complete_msg'));

        // Fetch updated session to get relationship type
        try {
          const updatedSession = await getAnalysisSession(data.sessionId);
          setCurrentSession(updatedSession);
          if (sidebarActions) {
            sidebarActions.upsertSession(updatedSession);
            sidebarActions.refreshSessions();
          }
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
      toast.error(t('analysis_session.upload_error'));
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

      toast.info(t('analysis_session.setup_msg'));
      const result = await createAnalysisSession(
        {
          contextMessage: context || undefined,
          model,
        },
        urls
      );

      setSessionId(result.id);

      if (sidebarActions) {
        sidebarActions.upsertSession(result);
        sidebarActions.refreshSessions();
      }
      setCurrentSession(result);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : t('analysis_session.create_error'));
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

  const handleRefine = async () => {
    if (!sessionId || pendingRefinements.length === 0) {
      toast.error(t('analysis_session.refine_error1'));
      return;
    }

    try {
      setStep("analyzing");

      const comments = pendingRefinements.map((ref) => ({
        text: ref.comment,
        quote: ref.selection,
        section: "Specific Selection",
      }));

      await refineAnalysisSession(sessionId, comments);
      setPendingRefinements([]);
      toast.info(t('analysis_session.refine_msg'));
    } catch (error) {
      console.error("Refinement error:", error);
      toast.error(t('analysis_session.refine_error2'));
      setStep("results");
    }
  };

  const handleContextualRefine = (selection: string, comment: string) => {
    if (!sessionId) return "";

    // Generate simple ID (timestamp + random)
    const id = `refine-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    setPendingRefinements(prev => [...prev, { id, selection, comment }]);
    toast.success(t('analysis_session.comment_added'));
    return id;
  };

  const handleEditRefinement = (id: string, newComment: string) => {
    setPendingRefinements(prev => prev.map(ref =>
      ref.id === id ? { ...ref, comment: newComment } : ref
    ));
    toast.success(t('analysis_session.comment_updated'));
  };

  const handleDeleteRefinement = (id: string) => {
    setPendingRefinements(prev => prev.filter(ref => ref.id !== id));
    toast.info(t('analysis_session.comment_removed'));
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

  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (step !== "upload") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const newFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            newFiles.push(file);
          }
        }
      }

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [step]);

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
    <div className="flex h-screen overflow-hidden gradient-calm">
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
              onNewSession={(actions) => setSidebarActions(actions)}
              onNewAnalysisClick={resetAnalysis}
              onClose={() => {
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
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
          onSignOut={signOut}
        />

        <main
          className={cn(
            "container py-8 flex-1",
            step === "results" ? "overflow-y-auto lg:overflow-hidden" : "overflow-y-auto"
          )}
        >
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
                  <h1 className="font-display text-3xl font-bold">{t('analysis_session.title')}</h1>
                  <p className="mt-2 text-muted-foreground">
                    {t('analysis_session.subtitle')}
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
                    {t('analysis_session.context_label')}
                  </label>
                  <Textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={t('analysis_session.context_placeholder')}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-4">
                  <Select value={model} onValueChange={(value) => setModel(value as GeminiModel)}>
                    <SelectTrigger className="w-[180px] h-11">
                      <SelectValue placeholder={t('analysis_session.select_model')} />
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
                    {t('analysis_session.btn_analyze')}
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
                <h2 className="mt-6 font-display text-2xl font-semibold">{t('analysis_session.analyzing_title')}</h2>
                <p className="mt-2 text-muted-foreground">{t('analysis_session.analyzing_subtitle')}</p>
              </motion.div>
            )}

            {step === "results" && analysisData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid gap-8 lg:grid-cols-2 lg:h-full lg:overflow-hidden"
              >
                <div className="space-y-4 overflow-y-auto pr-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-2xl font-bold">{t('analysis_session.results_title')}</h2>
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
                    <Button
                      variant={pendingRefinements.length > 0 ? "default" : "outline"}
                      onClick={handleRefine}
                      disabled={pendingRefinements.length === 0}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t('analysis_session.btn_refine')} {pendingRefinements.length > 0 && `(${pendingRefinements.length})`}
                    </Button>
                  </div>
                  <AnalysisTextSelectionMenu
                    onRefine={handleContextualRefine}
                    onEdit={handleEditRefinement} // Pass handler
                    onDelete={handleDeleteRefinement} // Pass handler
                  >
                    <AnalysisResults
                      data={analysisData}
                    />
                  </AnalysisTextSelectionMenu>
                </div>

                <div className="h-[600px] lg:h-full overflow-hidden">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                    <div className="flex items-center gap-2 border-b border-border bg-sage-light/50 px-4 py-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <span className="font-display font-semibold">{t('analysis_session.chat_coach')}</span>
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
    </div >
  );
}
