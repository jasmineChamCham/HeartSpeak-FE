import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { sendChatMessage, getChatMessagesBySessionId } from "@/api/chat-message/chat-message.api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatAnalysisProgressPayload } from "@/types/websocket.types";
import { MessageRole } from "@/common/enums";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MediaThumbnail } from "./MediaThumbnail";
import { MediaLightbox } from "./MediaLightbox";

interface Message {
  role: MessageRole;
  content: string;
  mediaUrls?: string[];
  createdAt?: string;
}

export interface ChatCoachProps {
  sessionId: string;
  analysisContext?: string;
  className?: string;
}

export function ChatCoach({ sessionId, analysisContext, className }: ChatCoachProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: MessageRole.ASSISTANT,
      content: "Hi! I'm your communication coach. Based on the analysis we just did, I'm here to help you understand your conversation better and provide guidance. What would you like to explore?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  const fetchMessages = React.useCallback(async (pageNum: number) => {
    try {
      setIsFetchingHistory(true);
      const newMessages = await getChatMessagesBySessionId(sessionId, pageNum, 20);

      if (newMessages.length < 20) {
        setHasMore(false);
      }

      const formattedMessages: Message[] = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        mediaUrls: msg.uploads?.map((u) => u.filePath),
        createdAt: msg.createdAt,
      }));

      setMessages((prev) => {
        // Filter out duplicates based on content and createdAt if possible, 
        // but for now just merging and sorting.
        // Since we don't have unique IDs in Message interface, we rely on state management.
        // Ideally we should use IDs.

        // Combine with previous messages, avoiding duplicates if any overlaps (though simple pagination shouldn't overlap)
        // If page is 0, we might want to replace the initial "Hi" if it's not a real message?
        // But the "Hi" message is local state.

        // If it's page 0, we can replace the default state IF we have history.
        const sortedNew = formattedMessages.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

        if (pageNum === 0) {
          // If we have history, replace the default message
          if (sortedNew.length > 0) {
            return sortedNew;
          }
          // If no history, keep the default message (which is already in prev if we just reset, or we can ensure it)
          // valid case: prev is default, sortedNew is empty -> return prev
          return prev;
        }

        // Prepend for older pages
        return [...sortedNew, ...prev];
      });

    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsFetchingHistory(false);
    }
  }, [sessionId]);

  React.useEffect(() => {
    // Initial fetch
    // Reset to default state
    setMessages([
      {
        role: MessageRole.ASSISTANT,
        content: "Hi! I'm your communication coach. Based on the analysis we just did, I'm here to help you understand your conversation better and provide guidance. What would you like to explore?",
      },
    ]);
    setPage(0);
    setHasMore(true);
    fetchMessages(0);
  }, [sessionId, fetchMessages]);

  const onScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMore && !isFetchingHistory) {
      // Load previous page
      const nextPage = page + 1;
      setPage(nextPage);

      // Save scroll height before loading to adjust scroll position
      const scrollHeightBefore = target.scrollHeight;

      fetchMessages(nextPage).then(() => {
        // Adjust scroll position after render (useEffect or useLayoutEffect better?)
        // We can do it in a layout effect dependency on messages?
        // But messages change on send too.
      });
    }
  }, [hasMore, isFetchingHistory, page, fetchMessages]);

  // Scroll adjustment for history load
  React.useEffect(() => {
    // This simple logic might conflict with auto-scroll to bottom on new message.
    // We need to distinguish between "loaded history" and "new message".
    // One way is checking if we just fetched history.
    if (isFetchingHistory) return;

    // If we are at page > 0, we probably just loaded history?
    // No, isFetchingHistory is false when done.

    // Auto-scroll to bottom only if we are near bottom OR if it's the very first load?
    if (scrollRef.current && page === 0) {
      // simple scroll to bottom for now
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, page, isFetchingHistory]);

  // Better scroll handling:
  // When messages update:
  // 1. If new message sent/received (added to end) -> scroll to bottom.
  // 2. If history loaded (added to start) -> maintain relative scroll position.

  const previousMessagesLength = React.useRef(messages.length);

  React.useLayoutEffect(() => {
    const scrollContainer = viewportRef.current;
    if (!scrollContainer) return;

    const isNewMessage = messages.length > previousMessagesLength.current && messages[messages.length - 1].role !== messages[previousMessagesLength.current - 1]?.role; // Not robust enough logic

    // If we added messages at the beginning (history load)
    // The length increased, and the last message is likely same?? No.

    // Simple logic:
    // If we authenticated/mounted (page 0), scroll to bottom.
    // If user scrolled to top and we engaged pagination, we want to maintain position.

    if (page === 0) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    } else if (previousMessagesLength.current < messages.length) {
      // History loaded?
      const addedCount = messages.length - previousMessagesLength.current;
      // Ideally calculate height difference.
      // Since we don't have easy DOM access to exact items height here easily without extensive refs,
      // we might assume we are at top (0) and we want to scroll down by (newScrollHeight - oldScrollHeight).
      // But we lost oldScrollHeight.
    }

    previousMessagesLength.current = messages.length;
  }, [messages, page]);


  const { isConnected } = useWebSocket({
    sessionId,
    onAnalysisResponse: () => { },
    onChatAnalysisProgress: (data: ChatAnalysisProgressPayload) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === MessageRole.ASSISTANT && prev.length > 1) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: m.content + data.chunk } : m
          );
        }
        // If the last message is NOT an assistant message (e.g. user just sent one), start a new one.
        return [...prev, { role: MessageRole.ASSISTANT, content: data.chunk }];
      });
      setIsLoading(false);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!input.trim() && files.length === 0) || isLoading) return;

    let mediaUrls: string[] = [];
    setIsLoading(true);

    try {
      // 1. Upload files first if any
      if (files.length > 0) {
        mediaUrls = await uploadMultipleToCloudinary(files);
      }

      const userMessage: Message = {
        role: MessageRole.USER,
        content: input.trim(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setFiles([]);

      await sendChatMessage(
        {
          sessionId,
          role: "user",
          content: userMessage.content,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
          analysisContext,
        },
      );

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter(msg => msg !== messages[messages.length]));
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  React.useEffect(() => {
    const viewport = viewportRef.current;
    const handleScroll = (e: Event) => {
      // Cast to unknown then to UIEvent or just call onScroll with mocked event if needed, 
      // OR just adapt onScroll to accept Event or utilize the event.
      // onScroll expects React.UIEvent.
      // We can just call onScroll(e as unknown as React.UIEvent<HTMLDivElement>);
      if (onScroll) onScroll(e as unknown as React.UIEvent<HTMLDivElement>);
    };

    if (viewport) {
      viewport.addEventListener("scroll", handleScroll);
      return () => viewport.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, isFetchingHistory, page, onScroll]);

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <ScrollArea
        ref={scrollRef}
        className="flex-1 p-4"
        viewportRef={viewportRef}
      >
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-light">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}



                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.mediaUrls && message.mediaUrls.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {message.mediaUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="cursor-zoom-in transition-transform hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => {
                            setLightboxUrl(url);
                            setIsLightboxOpen(true);
                          }}
                        >
                          <MediaThumbnail
                            url={url}
                            className="max-h-32 rounded-lg border border-border/50"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {message.role === MessageRole.ASSISTANT ? (
                    <MarkdownRenderer content={message.content.replace(/```json\n?|```/g, '').trim()} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content.trim()}
                    </p>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lavender-light">
                    <User className="h-4 w-4 text-lavender" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-light">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>

      <div className="border-t border-border bg-card/50 p-4">
        {files.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative h-16 w-16 shrink-0">
                <MediaThumbnail
                  file={file}
                  className="h-full w-full rounded-md"
                />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -right-1 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your conversation..."
            className="min-h-[44px] max-h-32 resize-none rounded-xl border-border bg-background"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={(!input.trim() && files.length === 0) || isLoading}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      <MediaLightbox
        url={lightboxUrl}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div >
  );
}
