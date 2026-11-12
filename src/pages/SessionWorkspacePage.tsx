import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, MessageSquare } from "lucide-react";

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
import SessionHeader from "../components/session/SessionHeader";
import PaperExplorer from "../components/session/PaperExplorer";

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

  // Paper selection saving state
  const [savingSelection, setSavingSelection] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("RESEARCH_GROUNDED");
  const [generating, setGenerating] = useState(false);
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
  const handleCreateChat = async () => {
    if (!sessionId || creatingChat) return;

    setCreatingChat(true);

    try {
      const request: CreateChatRequest = {
        title: "New Chat",
      };

      const newChat = await createChat(sessionId, request);

      setChats((previous) => [...previous, newChat]);
      setActiveChatId(newChat.id);
    } catch (error) {
      console.error("Failed to create chat:", error);
      showError("Failed to create a new conversation.");
    } finally {
      setCreatingChat(false);
    }
  };
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

      // Fetch persisted messages from the backend.
      const updatedMessages = await getChatMessages(chatId);

      // Don't overwrite another chat if the user switched meanwhile.
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

  // Toggle paper selection
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-600 dark:text-gray-300">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-300">
          Unable to load this session.
        </p>

        <Link
          to={projectId ? `/research/${projectId}` : "/research"}
          className="text-blue-600 hover:underline"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SessionHeader workspace={workspace} />

        {/* Chat management */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">AI Conversations</h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create and manage conversations for this research session.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateChat}
              disabled={creatingChat || chatsLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              {creatingChat ? "Creating..." : "New Chat"}
            </button>
          </div>

          {/* Chat list */}
          <div className="mt-5 flex flex-wrap gap-3">
            {chatsLoading ? (
              <p className="text-sm text-slate-500">Loading conversations...</p>
            ) : chats.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No conversations yet. Create your first chat.
              </p>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    activeChatId === chat.id
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <MessageSquare size={16} />
                  {chat.title || "Untitled Chat"}
                </button>
              ))
            )}
          </div>

          {/* Active chat information */}
          {activeChat && (
            <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active conversation
              </p>

              <h3 className="mt-1 font-semibold">
                {activeChat.title || "Untitled Chat"}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Chat ID: {activeChat.id}
              </p>
            </div>
          )}

          {/* Chat-specific details */}
          {chatDetailsLoading ? (
            <p className="mt-4 text-sm text-slate-500">
              Loading conversation details...
            </p>
          ) : activeChat ? (
            <div className="mt-5 space-y-5">
              {/* Selected papers */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">
                    Selected Papers ({selectedPaperIds.length})
                  </h4>

                  <button
                    type="button"
                    onClick={handleSaveSelection}
                    disabled={
                      !hasUnsavedSelection ||
                      savingSelection ||
                      chatDetailsLoading ||
                      !activeChatId
                    }
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingSelection ? "Saving..." : "Save Selection"}
                  </button>
                </div>

                {selectedPaperIds.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No papers selected for this chat.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {selectedPaperIds.map((paperId) => {
                      const paper = workspace.papers.find(
                        (p) => p.id === paperId,
                      );

                      return (
                        <li
                          key={paperId}
                          className="text-sm text-slate-600 dark:text-slate-300"
                        >
                          {paper?.title ?? paperId}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {hasUnsavedSelection && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    You have unsaved paper selection changes.
                  </p>
                )}
              </div>

              {/* Conversation history */}
              <div>
                <h4 className="font-semibold">
                  Conversation History ({messages.length})
                </h4>

                {/* Question composer */}
                <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                  <h4 className="font-semibold">Ask ResearchMate</h4>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Ask questions about the papers selected for this
                    conversation.
                  </p>

                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about your selected research papers..."
                    rows={4}
                    disabled={generating || chatDetailsLoading}
                    className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-cyan-950"
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <select
                      value={answerMode}
                      onChange={(e) =>
                        setAnswerMode(e.target.value as AnswerMode)
                      }
                      disabled={generating}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="RESEARCH_GROUNDED">
                        Research Grounded
                      </option>

                      <option value="AI_ENHANCED">AI Enhanced</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleGenerateAnswer}
                      disabled={
                        !question.trim() ||
                        generating ||
                        chatDetailsLoading ||
                        !activeChatId
                      }
                      className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {generating ? "Generating..." : "Generate Answer"}
                    </button>
                  </div>

                  {selectedPaperIds.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      No papers are selected for this chat. Select and save
                      papers if you want answers grounded in your research
                      documents.
                    </p>
                  )}
                </div>

                {messages.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No messages yet. Start a conversation.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                      >
                        <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                          {message.role}
                          {message.answerMode && ` • ${message.answerMode}`}
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                          {message.content}
                        </p>

                        {message.sources.length > 0 && (
                          <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                            <p className="text-xs font-semibold">Sources</p>

                            {message.sources.map((source, index) => (
                              <p
                                key={index}
                                className="mt-1 text-xs text-slate-500"
                              >
                                Paper: {source.paperId}
                                {" • "}
                                Page: {source.pageNumber ?? "N/A"}
                                {" • "}
                                {source.sectionTitle ?? "Unknown section"}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {/* Paper explorer */}
        <div className="mt-8">
          <PaperExplorer
            papers={workspace.papers}
            searchType={workspace.searchType}
            selectedPaperIds={selectedPaperIds}
            onTogglePaper={handleTogglePaper}
            selectionDisabled={
              chatDetailsLoading || savingSelection || !activeChatId
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SessionWorkspacePage;
