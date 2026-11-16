import React from "react";
import { Plus, X } from "lucide-react";
import type { Chat } from "../../types/chat";
import type { SessionPaper } from "../../types/research";
import { ChatList } from "./ChatList";
import { SidebarPaperList } from "./SidebarPaperList";
import NewChatDialog from "./NewChatDialog";


interface ChatSidebarProps {
  // Responsive mobile drawer control
  isOpen: boolean;
  onClose: () => void;

  // Chat list & active chat
  chats: Chat[];
  activeChatId: string | null;
  chatsLoading: boolean;
  onSelectChat: (chatId: string) => void;

  // New chat dialog (reuses existing NewChatDialog)
  isNewChatDialogOpen: boolean;
  creatingChat: boolean;
  onOpenNewChatDialog: () => void;
  onCloseNewChatDialog: () => void;
  onCreateChat: (title: string) => void;

  // Chat-specific research papers
  papers: SessionPaper[];
  selectedPaperIds: string[];
  hasUnsavedSelection: boolean;
  savingSelection: boolean;
  selectionDisabled?: boolean;
  onTogglePaper: (paperId: string) => void;
  onSaveSelection: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChatId,
  chatsLoading,
  onSelectChat,
  isNewChatDialogOpen,
  creatingChat,
  onOpenNewChatDialog,
  onCloseNewChatDialog,
  onCreateChat,
  papers,
  selectedPaperIds,
  hasUnsavedSelection,
  savingSelection,
  selectionDisabled = false,
  onTogglePaper,
  onSaveSelection,
}) => {
  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    // Automatically close the drawer on smaller viewports after picking a chat
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container (~25% on desktop, slide-over drawer on mobile) */}
      <aside
        aria-label="Session sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-auto lg:w-1/4 lg:min-w-[280px] lg:max-w-[360px] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Action Header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenNewChatDialog}
            disabled={creatingChat}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>

          {/* Close button visible only on mobile/tablet drawer */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content: Recent Chats + Research Papers */}
        <div className="flex-1 space-y-5 overflow-y-auto p-3">
          {/* Section A: Recent Chats */}
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            loading={chatsLoading}
            disabled={creatingChat}
            onSelectChat={handleSelectChat}
          />

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section B: Chat-Specific Research Papers */}
         {/* Section B: Chat-Specific Research Papers */}
          <SidebarPaperList
            papers={papers}
            selectedPaperIds={selectedPaperIds}
            hasUnsavedChanges={hasUnsavedSelection}
            savingSelection={savingSelection}
            hasActiveChat={Boolean(activeChatId)}
            disabled={selectionDisabled || !activeChatId}
            onTogglePaper={onTogglePaper}
            onSaveSelection={onSaveSelection}
            onOpenNewChatDialog={onOpenNewChatDialog}
          />
        </div>
      </aside>

      {/* Existing Optional-Title New Chat Dialog */}
      <NewChatDialog
        isOpen={isNewChatDialogOpen}
        creating={creatingChat}
        onClose={onCloseNewChatDialog}
        onCreate={onCreateChat}
      />
    </>
  );
};