import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getSessionWorkspace } from "../services/researchService";
import {
  createChat,
  getSessionChats,
  getChatPaperSelection,
  getChatMessages,
  updateChatPaperSelection,
  generateAnswer,
} from "../services/chatService";
import type { SessionWorkspace } from "../types/research";
import type {
  Chat,
  ChatMessage,
  CreateChatRequest,
  AnswerMode,
} from "../types/chat";

import { showError } from "../lib/toast";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

const SessionWorkspacePage = () => {
  const { projectId, sessionId } = useParams<{
    projectId: string;
    sessionId: string;
  }>();

  // Session workspace state
  const [workspace, setWorkspace] = useState<SessionWorkspace | null>(null);
  const [loading, setLoading] = useState(true);

  // Chat management state
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [creatingChat, setCreatingChat] = useState(false);

  // Chat-specific data
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [savedSelectedPaperIds, setSavedSelectedPaperIds] = useState<string[]>(
    [],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatDetailsLoading, setChatDetailsLoading] = useState(false);

  // Paper selection & answer generation state
  const [savingSelection, setSavingSelection] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("RESEARCH_GROUNDED");
  const [generating, setGenerating] = useState(false);

  // Dialog & mobile sidebar drawer state
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch session workspace
  useEffect(() => {
    let cancelled = false;

    const fetchWorkspace = async () => {
      if (!projectId || !sessionId) {
        setLoading(false);
        showError("Invalid session URL.");
        return;
      }

      try {
        const data = await getSessionWorkspace(projectId, sessionId);

        if (!cancelled) {
          setWorkspace(data);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load workspace:", error);
        showError("Failed to load session workspace.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [projectId, sessionId]);

  // Fetch chats belonging to this session
  useEffect(() => {
    let cancelled = false;

    const fetchChats = async () => {
      if (!sessionId) {
        setChatsLoading(false);
        return;
      }

      setChatsLoading(true);

      try {
        const data = await getSessionChats(sessionId);

        if (cancelled) return;

        setChats(data);

        // Automatically activate the first existing chat
        setActiveChatId(data.length > 0 ? data[0].id : null);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load chats:", error);
        showError("Failed to load conversations.");
      } finally {
        if (!cancelled) {
          setChatsLoading(false);
        }
      }
    };

    fetchChats();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Fetch selection and messages for the active chat
  useEffect(() => {
    let cancelled = false;

    const fetchChatDetails = async () => {
      if (!activeChatId) {
        setSelectedPaperIds([]);
        setSavedSelectedPaperIds([]);
        setMessages([]);
        setChatDetailsLoading(false);
        return;
      }

      setChatDetailsLoading(true);

      // Clear previous chat's data while switching
      setSelectedPaperIds([]);
      setSavedSelectedPaperIds([]);
      setMessages([]);
      setQuestion("");

      try {
        const [selectionData, messageData] = await Promise.all([
          getChatPaperSelection(activeChatId),
          getChatMessages(activeChatId),
        ]);

        if (cancelled) return;

        const paperIds = selectionData.papers.map((paper) => paper.paperId);

        setSelectedPaperIds(paperIds);
        setSavedSelectedPaperIds(paperIds);
        setMessages(messageData);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load chat details:", error);
        showError("Failed to load conversation details.");
      } finally {
        if (!cancelled) {
          setChatDetailsLoading(false);
        }
      }
    };

    fetchChatDetails();

    return () => {
      cancelled = true;
    };
  }, [activeChatId]);

  // Create a new chat
  const handleCreateChat = async (title: string) => {
    if (!sessionId || creatingChat) return;

    setCreatingChat(true);

    try {
      const request: CreateChatRequest = {
        title: title || null,
      };

      const newChat = await createChat(sessionId, request);

      setChats((previous) => [...previous, newChat]);
      setActiveChatId(newChat.id);
      setIsNewChatDialogOpen(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
      showError("Failed to create a new conversation.");
    } finally {
      setCreatingChat(false);
    }
  };

  // Generate an AI answer for the active chat
  const handleGenerateAnswer = async () => {
    const trimmedQuestion = question.trim();

    if (!sessionId || !activeChatId || !trimmedQuestion || generating) {
      return;
    }

    const chatId = activeChatId;

    setGenerating(true);

    try {
      await generateAnswer(sessionId, {
        chatId,
        question: trimmedQuestion,
        answerMode,
      });

      // Fetch persisted messages from the backend
      const updatedMessages = await getChatMessages(chatId);

      // Don't overwrite another chat if the user switched meanwhile
      if (activeChatId === chatId) {
        setMessages(updatedMessages);
        setQuestion("");
      }
    } catch (error) {
      console.error("Failed to generate answer:", error);
      showError("Failed to generate an answer. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Derive the active chat from the chat list
  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;

  // Toggle paper selection for the active chat
  const handleTogglePaper = (paperId: string) => {
    setSelectedPaperIds((previous) =>
      previous.includes(paperId)
        ? previous.filter((id) => id !== paperId)
        : [...previous, paperId],
    );
  };

  // Save selected papers for the active chat
  const handleSaveSelection = async () => {
    if (!activeChatId || savingSelection) return;

    setSavingSelection(true);

    try {
      await updateChatPaperSelection(activeChatId, {
        paperIds: selectedPaperIds,
      });

      setSavedSelectedPaperIds([...selectedPaperIds]);
    } catch (error) {
      console.error("Failed to save paper selection:", error);
      showError("Failed to save paper selection.");
    } finally {
      setSavingSelection(false);
    }
  };

  // Check whether the current selection differs from the saved selection
  const hasUnsavedSelection =
    selectedPaperIds.length !== savedSelectedPaperIds.length ||
    selectedPaperIds.some((id) => !savedSelectedPaperIds.includes(id));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Unable to load this session.
        </p>

        <Link
          to={projectId ? `/research/${projectId}` : "/research"}
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Left Sidebar (~25% on desktop, slide-over drawer on mobile) */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        chatsLoading={chatsLoading}
        onSelectChat={setActiveChatId}
        isNewChatDialogOpen={isNewChatDialogOpen}
        creatingChat={creatingChat}
        onOpenNewChatDialog={() => setIsNewChatDialogOpen(true)}
        onCloseNewChatDialog={() => setIsNewChatDialogOpen(false)}
        onCreateChat={handleCreateChat}
        papers={workspace.papers}
        selectedPaperIds={selectedPaperIds}
        hasUnsavedSelection={hasUnsavedSelection}
        savingSelection={savingSelection}
        selectionDisabled={chatDetailsLoading}
        onTogglePaper={handleTogglePaper}
        onSaveSelection={handleSaveSelection}
      />

      {/* Main Chat Workspace (~75% on desktop) */}
      <ChatWindow
        projectId={projectId}
        sessionTitle={workspace.title}
        activeChat={activeChat}
        papers={workspace.papers}
        selectedPaperCount={selectedPaperIds.length}
        hasUnsavedSelection={hasUnsavedSelection}
        messages={messages}
        chatDetailsLoading={chatDetailsLoading}
        question={question}
        answerMode={answerMode}
        generating={generating}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onQuestionChange={setQuestion}
        onAnswerModeChange={setAnswerMode}
        onOpenNewChatDialog={() => setIsNewChatDialogOpen(true)}
        onSubmitQuestion={handleGenerateAnswer}
      />
    </div>
  );
};

export default SessionWorkspacePage;