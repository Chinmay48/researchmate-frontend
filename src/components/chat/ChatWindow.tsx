import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu, BookOpen, BookCheck, Sparkles } from "lucide-react";
import type { AnswerMode, Chat, ChatMessage } from "../../types/chat";
import type { SessionPaper } from "../../types/research";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  projectId?: string;
  sessionTitle: string;
  activeChat: Chat | null;
  papers: SessionPaper[];
  selectedPaperCount: number;
  hasUnsavedSelection: boolean;
  messages: ChatMessage[];
  chatDetailsLoading: boolean;
  question: string;
  answerMode: AnswerMode;
  generating: boolean;
  onOpenSidebar: () => void;
  onOpenNewChatDialog: () => void;
  onQuestionChange: (value: string) => void;
  onAnswerModeChange: (mode: AnswerMode) => void;
  onSubmitQuestion: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  projectId,
  sessionTitle,
  activeChat,
  papers,
  selectedPaperCount,
  hasUnsavedSelection,
  messages,
  chatDetailsLoading,
  question,
  answerMode,
  generating,
  onOpenSidebar,
  onOpenNewChatDialog,
  onQuestionChange,
  onAnswerModeChange,
  onSubmitQuestion,
}) => {
  const activeChatTitle = activeChat
    ? activeChat.title?.trim() || "Untitled Chat"
    : "New Research Chat";

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* Minimal Chat Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Back to Project Link */}
          {projectId && (
            <Link
              to={`/research/${projectId}`}
              title="Back to project"
              className="rounded-xl p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          {/* Active Chat Title & Session Subtitle */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
              {activeChatTitle}
            </h1>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {sessionTitle}
            </p>
          </div>
        </div>

        {/* Right Context Badges */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:inline-flex">
            <BookOpen className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>
              {selectedPaperCount} {selectedPaperCount === 1 ? "paper" : "papers"}
            </span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
            {answerMode === "RESEARCH_GROUNDED" ? (
              <>
                <BookCheck className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Research Grounded</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden md:inline">AI Enhanced</span>
              </>
            )}
          </span>
        </div>
      </header>

      {/* Scrollable Conversation Area */}
      <ChatMessageList
        messages={messages}
        papers={papers}
        loading={chatDetailsLoading}
        generating={generating}
        hasActiveChat={Boolean(activeChat)}
        selectedPaperCount={selectedPaperCount}
        onOpenNewChatDialog={onOpenNewChatDialog}
      />

      {/* Bottom Question Composer */}
      <ChatInput
        question={question}
        answerMode={answerMode}
        generating={generating}
        disabled={chatDetailsLoading || !activeChat}
        selectedPaperCount={selectedPaperCount}
        hasUnsavedSelection={hasUnsavedSelection}
        onQuestionChange={onQuestionChange}
        onAnswerModeChange={onAnswerModeChange}
        onSubmit={onSubmitQuestion}
      />
    </main>
  );
};

export default ChatWindow;