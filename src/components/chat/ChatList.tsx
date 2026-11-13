import React from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import type { Chat } from "../../types/chat";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  loading?: boolean;
  disabled?: boolean;
  onSelectChat: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  loading = false,
  disabled = false,
  onSelectChat,
}) => {
  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recent Chats
        </h3>
        {chats.length > 0 && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {chats.length}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center gap-2 px-2 py-3 text-xs text-slate-500 dark:text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-600 dark:text-cyan-400" />
          <span>Loading chats...</span>
        </div>
      ) : chats.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No chats yet. Start a new conversation above.
        </p>
      ) : (
        <nav aria-label="Recent chats" className="space-y-1">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const displayTitle = chat.title?.trim() || "Untitled Chat";

            return (
              <button
                key={chat.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectChat(chat.id)}
                title={displayTitle}
                className={`group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? "bg-cyan-50 font-medium text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-100"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70"
                } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              >
                <MessageSquare
                  className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                    isActive
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate">{displayTitle}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};