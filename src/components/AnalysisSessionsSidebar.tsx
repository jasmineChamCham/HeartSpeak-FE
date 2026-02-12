import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Loader2,
    MessageSquare,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getMyAnalysisSessions } from "@/api/analysis-session/analysis-session.api";
import { AnalysisSession } from "@/types/analysis-session";
import { AnalysisStatus, RelationshipType } from "@/common/enums";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnalysisSessionsSidebarProps {
    onSessionSelect: (session: AnalysisSession) => void;
    currentSessionId?: string | null;
    isCollapsed?: boolean;
    onNewSession?: (actions: {
        upsertSession: (session: AnalysisSession) => void;
        refreshSessions: () => void;
    }) => void;
    onClose?: () => void;
}

export function AnalysisSessionsSidebar({
    onSessionSelect,
    currentSessionId,
    isCollapsed = false,
    onNewSession,
    onClose,
}: AnalysisSessionsSidebarProps) {
    const [sessions, setSessions] = React.useState<AnalysisSession[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<AnalysisStatus | "all">("all");
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    const observerTarget = React.useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 20;

    const loadSessions = React.useCallback(
        async (pageToLoad: number, isReset: boolean = false) => {
            try {
                setIsLoading(true);

                const result = await getMyAnalysisSessions({
                    page: pageToLoad,
                    perPage: ITEMS_PER_PAGE,
                    search: searchQuery || undefined,
                    order: "createdAt:desc",
                });

                const newSessions = result.data;
                const total = result.meta.total;

                if (isReset) {
                    setSessions(newSessions);
                } else {
                    setSessions((prev) => {
                        const existingIds = new Set(prev.map(s => s.id));
                        const uniqueNewSessions = newSessions.filter(s => !existingIds.has(s.id));
                        return [...prev, ...uniqueNewSessions];
                    });
                }

                setPage(pageToLoad);

                // Logic for hasMore with 0-based pagination
                // If we received fewer items than requested, we are done.
                if (newSessions.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                } else {
                    // If we got a full page, check if there are more items in total
                    // (pageToLoad + 1) * ITEMS_PER_PAGE is the count of items we would have if all pages up to this one were full
                    setHasMore(total > (pageToLoad + 1) * ITEMS_PER_PAGE);
                }

            } catch (error) {
                console.error("Failed to load sessions:", error);
                toast.error("Failed to load analysis sessions");
            } finally {
                setIsLoading(false);
            }
        },
        [searchQuery]
    );

    // Initial load & Filter change
    React.useEffect(() => {
        loadSessions(0, true);
    }, [loadSessions]);

    // Intersection Observer
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadSessions(page + 1, false);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, isLoading, loadSessions, page]);


    const upsertSession = React.useCallback((session: AnalysisSession) => {
        setSessions((prev) => {
            const index = prev.findIndex((s) => s.id === session.id);
            if (index !== -1) {
                const newSessions = [...prev];
                newSessions[index] = session;
                // Move updated session to top
                newSessions.splice(index, 1);
                return [session, ...newSessions];
            }
            return [session, ...prev];
        });
    }, []);

    React.useEffect(() => {
        if (onNewSession) {
            onNewSession({
                upsertSession: upsertSession as any,
                refreshSessions: () => loadSessions(0, true)
            });
        }
    }, [upsertSession, loadSessions, onNewSession]);

    const getStatusIcon = (status: AnalysisStatus) => {
        switch (status) {
            case AnalysisStatus.COMPLETED:
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case AnalysisStatus.PROCESSING:
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case AnalysisStatus.FAILED:
                return <XCircle className="h-4 w-4 text-red-500" />;
            case AnalysisStatus.PENDING:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: AnalysisStatus) => {
        switch (status) {
            case AnalysisStatus.COMPLETED:
                return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
            case AnalysisStatus.PROCESSING:
                return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
            case AnalysisStatus.FAILED:
                return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
            case AnalysisStatus.PENDING:
                return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
        }
    };

    const getRelationshipColor = (type?: RelationshipType) => {
        if (!type) return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";

        switch (type) {
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

    const formatRelationshipType = (type?: RelationshipType) => {
        if (!type) return "Unknown";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } else if (diffInHours < 48) {
            return "Yesterday";
        } else if (diffInHours < 168) {
            return date.toLocaleDateString([], { weekday: "short" });
        } else {
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        }
    };

    if (isCollapsed) {
        return null;
    }

    return (
        <div className="flex h-full w-80 flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm">
            {/* Header */}
            <div className="border-b border-border/50 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo-without-background.png" alt="HeartSpeak" className="h-8 w-10" />
                        <span className="font-display text-lg font-semibold">HeartSpeak</span>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                            <XCircle className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 bg-background/50"
                    />
                </div>
            </div>

            {/* Sessions List */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {isLoading && sessions.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground">No sessions found</p>
                            {(searchQuery || statusFilter !== "all") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setStatusFilter("all");
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {sessions.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <button
                                        onClick={() => {
                                            onSessionSelect(session);
                                            if (onClose) onClose();
                                        }}
                                        className={cn(
                                            "group relative w-full rounded-lg border p-3 mb-2 text-left transition-all hover:shadow-md",
                                            currentSessionId === session.id
                                                ? "border-primary/50 bg-primary/5 shadow-sm"
                                                : "border-border/50 bg-background/50 hover:border-primary/30 hover:bg-background/80"
                                        )}
                                    >
                                        {/* Relationship Type Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge
                                                variant="outline"
                                                className={cn("text-xs font-medium", getRelationshipColor((session as any).relationship?.relation.toLowerCase()))}
                                            >
                                                {formatRelationshipType((session as any).relationship?.relation)}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                {formatDate(session.createdAt)}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                            {session.title || "Untitled Session"}
                                        </h3>

                                        {/* Context Preview */}
                                        {session.contextMessage && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                {session.contextMessage}
                                            </p>
                                        )}

                                        {/* Arrow indicator for current session */}
                                        {currentSessionId === session.id && (
                                            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {/* Loading Indicator for Infinite Scroll */}
                    <div ref={observerTarget} className="h-4 w-full" />
                    {isLoading && sessions.length > 0 && (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
