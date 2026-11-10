
import api from "../lib/api";

import type {
  Chat,
  ChatMessage,
  ChatPaperSelectionResponse,
  CreateChatRequest,
  UpdateChatPaperSelectionRequest,
  GenerateAnswerRequest,
  GenerateAnswerResponse,
} from "../types/chat";

// Create a new chat
export const createChat = async (
  sessionId: string,
  request: CreateChatRequest
): Promise<Chat> => {
  const response = await api.post<Chat>(
    `/sessions/${sessionId}/chats`,
    request
  );

  return response.data;
};

// Get all chats belonging to a session
export const getSessionChats = async (
  sessionId: string
): Promise<Chat[]> => {
  const response = await api.get<Chat[]>(
    `/sessions/${sessionId}/chats`
  );

  return response.data;
};

// Get previous messages of a chat
export const getChatMessages = async (
  chatId: string
): Promise<ChatMessage[]> => {
  const response = await api.get<ChatMessage[]>(
    `/chats/${chatId}/messages`
  );

  return response.data;
};

// Get papers selected for a particular chat
export const getChatPaperSelection = async (
  chatId: string
): Promise<ChatPaperSelectionResponse> => {
  const response = await api.get<ChatPaperSelectionResponse>(
    `/chats/${chatId}/papers/selection`
  );

  return response.data;
};

// Update paper selection for a particular chat
export const updateChatPaperSelection = async (
  chatId: string,
  request: UpdateChatPaperSelectionRequest
): Promise<void> => {
  await api.put(
    `/chats/${chatId}/papers/selection`,
    request
  );
};

// Generate an AI answer
export const generateAnswer = async (
  sessionId: string,
  request: GenerateAnswerRequest
): Promise<GenerateAnswerResponse> => {
  const response = await api.post<GenerateAnswerResponse>(
    `/sessions/${sessionId}/rag/answer`,
    request
  );

  return response.data;
};
