import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { WebSocketEvent } from "@/common/enums";
import {
  AnalysisSessionCompletePayload,
  JoinedConversationPayload,
  ChatAnalysisProgressPayload,
} from "@/types/websocket.types";

interface UseWebSocketOptions {
  sessionId: string | null;
  onAnalysisResponse: (data: any) => void;
  onJoinedConversation?: (data: JoinedConversationPayload) => void;
  onSessionComplete?: (data: AnalysisSessionCompletePayload) => void;
  onChatAnalysisProgress?: (data: ChatAnalysisProgressPayload) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  error: string | null;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function useWebSocket({
  sessionId,
  onAnalysisResponse,
  onJoinedConversation,
  onSessionComplete,
  onChatAnalysisProgress,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasConnectedRef = useRef(false);

  // Store callbacks in refs to avoid triggering reconnections
  const onAnalysisResponseRef = useRef(onAnalysisResponse);
  const onJoinedConversationRef = useRef(onJoinedConversation);
  const onSessionCompleteRef = useRef(onSessionComplete);
  const onChatAnalysisProgressRef = useRef(onChatAnalysisProgress);

  // Update all callback refs in a single effect
  useEffect(() => {
    onAnalysisResponseRef.current = onAnalysisResponse;
    onJoinedConversationRef.current = onJoinedConversation;
    onSessionCompleteRef.current = onSessionComplete;
    onChatAnalysisProgressRef.current = onChatAnalysisProgress;
  });

  // Main WebSocket connection effect
  useEffect(() => {
    if (!sessionId) {
      hasConnectedRef.current = false;
      return;
    }

    // Prevent multiple connections for the same session
    if (hasConnectedRef.current && socketRef.current?.connected) {
      console.log("[WebSocket] Already connected, skipping reconnection");
      return;
    }

    hasConnectedRef.current = true;

    // Create socket connection
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);

      // Join the conversation for this session
      socket.emit(WebSocketEvent.START_CHAT, { sessionId });
    });

    socket.on(WebSocketEvent.JOINED_CONVERSATION, (data) => {
      if (onJoinedConversationRef.current) {
        onJoinedConversationRef.current(data);
      }
    });

    socket.on(WebSocketEvent.CHAT_ANALYSIS_RESPONSE, (data) => {
      onAnalysisResponseRef.current(data);
    });

    socket.on(WebSocketEvent.ANALYSIS_SESSION_COMPLETE, (data) => {
      console.log("Analysis session complete");
      if (onSessionCompleteRef.current) {
        onSessionCompleteRef.current(data);
      }
    });

    socket.on(WebSocketEvent.CHAT_ANALYSIS_PROGRESS, (data) => {
      if (onChatAnalysisProgressRef.current) {
        onChatAnalysisProgressRef.current(data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError(err.message || "Failed to connect to WebSocket server");
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        console.log("[WebSocket] Cleaning up connection");
        socketRef.current.disconnect();
        socketRef.current = null;
        hasConnectedRef.current = false;
      }
    };
  }, [sessionId]);

  return { isConnected, error };
}
