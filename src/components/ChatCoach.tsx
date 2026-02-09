import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { sendChatMessage } from "@/api/chat-message/chat-message.api";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatAnalysisProgressPayload } from "@/types/websocket.types";
import { MessageRole } from "@/common/enums";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Message {
  role: MessageRole;
  content: string;
  mediaUrls?: string[];
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
  const [selectedImages, setSelectedImages] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
      setSelectedImages([]);

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

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
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
                        <img
                          key={idx}
                          src={url}
                          alt="Attached media"
                          className="max-h-48 rounded-lg object-cover"
                        />
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
        {selectedImages.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
            {selectedImages.map((src, idx) => (
              <div key={idx} className="relative h-16 w-16 shrink-0">
                <img src={src} alt="Preview" className="h-full w-full rounded-md object-cover" />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground hover:bg-destructive/90"
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
    </div >
  );
}
