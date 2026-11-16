import React from "react";
import { BookOpen, Save, Loader2, MessageSquarePlus } from "lucide-react";
import type { SessionPaper } from "../../types/research";
import { SidebarPaperItem } from "./SidebarPaperItem";

interface SidebarPaperListProps {
  papers: SessionPaper[];
  selectedPaperIds: string[];
  hasUnsavedChanges: boolean;
  savingSelection: boolean;
  hasActiveChat: boolean;
  disabled?: boolean;
  onTogglePaper: (paperId: string) => void;
  onSaveSelection: () => void;
  onOpenNewChatDialog: () => void;
}

export const SidebarPaperList: React.FC<SidebarPaperListProps> = ({
  papers,
  selectedPaperIds,
  hasUnsavedChanges,
  savingSelection,
  hasActiveChat,
  disabled = false,
  onTogglePaper,
  onSaveSelection,
  onOpenNewChatDialog,
}) => {
  return (
    <div className="flex flex-col">
      {/* Section Header & Selection Summary */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Research Papers ({papers.length})
          </h3>
        </div>

        {hasActiveChat && (
          <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
            {selectedPaperIds.length} selected
          </span>
        )}
      </div>

      {/* Guidance Banner when no chat exists yet */}
      {!hasActiveChat ? (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs dark:border-amber-800/60 dark:bg-amber-950/30">
          <p className="font-medium text-amber-900 dark:text-amber-200">
            Create a chat first to select papers
          </p>
          <p className="mt-1 leading-relaxed text-amber-700 dark:text-amber-300/80">
            Paper selections are saved per conversation. Start a chat to choose which papers ResearchMate should analyze.
          </p>
          <button
            type="button"
            onClick={onOpenNewChatDialog}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Create New Chat
          </button>
        </div>
      ) : (
        /* Save Selection Action Bar (shown once a chat is active) */
        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900/80">
          <span className="text-[11px]">
            {hasUnsavedChanges ? (
              <span className="font-medium text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Selection synced
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={onSaveSelection}
            disabled={!hasUnsavedChanges || savingSelection || disabled}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              hasUnsavedChanges && !disabled
                ? "bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
            }`}
          >
            {savingSelection ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                Save Selection
              </>
            )}
          </button>
        </div>
      )}

      {/* Paper Items (still expandable even before creating a chat!) */}
      {papers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No papers discovered in this session yet.
        </p>
      ) : (
        <div className="space-y-2">
          {papers.map((paper) => (
            <SidebarPaperItem
              key={paper.id}
              paper={paper}
              selected={selectedPaperIds.includes(paper.id)}
              onToggleSelection={onTogglePaper}
              disabled={disabled || savingSelection || !hasActiveChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};