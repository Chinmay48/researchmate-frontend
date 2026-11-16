import React, { useEffect, useRef } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import type { ChatMessage } from "../../types/chat";
import type { SessionPaper } from "../../types/research";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: ChatMessage[];
  papers: SessionPaper[];
  loading?: boolean;
  generating?: boolean;
  hasActiveChat: boolean;
  selectedPaperCount: number;
  onOpenNewChatDialog: () => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  papers,
  loading = false,
  generating = false,
  hasActiveChat,
  selectedPaperCount,
  onOpenNewChatDialog,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll smoothly to the latest message whenever messages update or generation starts
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, generating]);

  // 1. Loading conversation history & paper selection
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-600 dark:text-cyan-400" />
          <span>Loading conversation...</span>
        </div>
      </div>
    );
  }

  // 2. No chat exists or none is selected
  if (!hasActiveChat) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-800/60 dark:bg-cyan-950/60 dark:text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Create a chat to begin your research
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Your session found <span className="font-semibold text-slate-700 dark:text-slate-200">{papers.length}</span>{" "}
            {papers.length === 1 ? "paper" : "papers"}. Start a new chat first so you can select which papers to include in your conversation.
          </p>
          <button
            type="button"
            onClick={onOpenNewChatDialog}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Create New Chat
          </button>
        </div>
      </div>
    );
  }

  // 3. Empty state for a newly created or empty chat
  if (messages.length === 0 && !generating) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-800/60 dark:bg-cyan-950/60 dark:text-cyan-400">
            <Bot className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Start your research conversation
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Ask questions about the papers selected for this chat. ResearchMate will use your selected papers to generate research-grounded answers.
          </p>
          <p className="mt-3 text-xs font-medium text-cyan-600 dark:text-cyan-400">
            {selectedPaperCount === 0
              ? "Tip: Select and save papers in the left sidebar first."
              : `${selectedPaperCount} ${selectedPaperCount === 1 ? "paper" : "papers"} currently selected for this chat`}
          </p>
        </div>
      </div>
    );
  }

  // 4. Chronological message stream
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            papers={papers}
          />
        ))}

        {/* Live thinking state while awaiting backend generation */}
        {generating && (
          <div className="flex items-center gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800/60 dark:bg-cyan-950/60 dark:text-cyan-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-600 dark:text-cyan-400" />
              <span>Analyzing selected papers and generating answer...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;