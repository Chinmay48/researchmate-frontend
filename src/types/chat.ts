
export type AnswerMode = "RESEARCH_GROUNDED" | "AI_ENHANCED";

// Create Chat
export interface CreateChatRequest {
  title: string | null;
}

// Chat details
export interface Chat {
  id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Chat-specific paper selection
export interface SelectedPaper {
  paperId: string;
  title: string;
  externalId: string;
}

export interface ChatPaperSelectionResponse {
  chatId: string;
  papers: SelectedPaper[];
}

export interface UpdateChatPaperSelectionRequest {
  paperIds: string[];
}
export type MessageRole = "USER" | "ASSISTANT";
// Message history
export interface MessageSource {
  paperId: string;
  chunkId: string;
  pageNumber: number | null;
  sectionTitle: string | null;
  retrievalDistance: number | null;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  answerMode: AnswerMode | null;
  createdAt: string;
  sources: MessageSource[];
}

// Generate AI answer
export interface GenerateAnswerRequest {
  chatId: string;
  question: string;
  answerMode: AnswerMode;
  topK?: number | null;
}

export interface AnswerSource {
  paperId: string;
  chunkId: string;
  pageNumber: number | null;
  sectionTitle: string | null;
  distance: number | null;
}

export interface GenerateAnswerResponse {
  answer: string;
  answerMode: AnswerMode;
  sources: AnswerSource[];
}
