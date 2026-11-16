import React from "react";
import { Bot, BookCheck, Sparkles } from "lucide-react";
import type { ChatMessage } from "../../types/chat";
import type { SessionPaper } from "../../types/research";
import MarkdownMessage from "./MarkdownMessage";
import ChatSources from "./ChatSources";

interface ChatMessageItemProps {
  message: ChatMessage;
  papers: SessionPaper[];
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  papers,
}) => {
  const isUser = message.role === "USER";

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Right-aligned user bubble
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-cyan-200/80 bg-cyan-50/90 px-4 py-3 text-sm leading-relaxed text-slate-900 shadow-2xs dark:border-cyan-800/50 dark:bg-cyan-950/45 dark:text-slate-100 sm:max-w-2xl">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {formattedTime && (
            <span className="mt-1.5 block text-right text-[11px] text-cyan-700/70 dark:text-cyan-300/60">
              {formattedTime}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Left-aligned full-width assistant response
  return (
    <div className="flex items-start gap-3.5">
      {/* Assistant Avatar Badge */}
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800/60 dark:bg-cyan-950/60 dark:text-cyan-400">
        <Bot className="h-4 w-4" />
      </div>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        {/* Metadata Header */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">
            ResearchMate
          </span>

          {message.answerMode === "RESEARCH_GROUNDED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              <BookCheck className="h-3 w-3" />
              Research Grounded
            </span>
          )}

          {message.answerMode === "AI_ENHANCED" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              AI Enhanced
            </span>
          )}

          {formattedTime && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {formattedTime}
            </span>
          )}
        </div>

        {/* Rendered Markdown Answer */}
      {/* Rendered Markdown Answer */}
        <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <MarkdownMessage content={message.content} papers={papers} />
        </div>

        {/* Resolved Paper Sources */}
        <ChatSources sources={message.sources} papers={papers} />
      </div>
    </div>
  );
};

export default ChatMessageItem;