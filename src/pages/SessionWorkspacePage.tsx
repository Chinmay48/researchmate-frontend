
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, MessageSquare } from "lucide-react";

import { getSessionWorkspace } from "../services/researchService";
import {
  createChat,
  getSessionChats,
} from "../services/chatService";

import type { SessionWorkspace } from "../types/research";
import type { Chat, CreateChatRequest } from "../types/chat";

import { showError } from "../lib/toast";
import SessionHeader from "../components/session/SessionHeader";
import PaperExplorer from "../components/session/PaperExplorer";

const SessionWorkspacePage = () => {
  const { projectId, sessionId } = useParams<{
    projectId: string;
    sessionId: string;
  }>();

  const [workspace, setWorkspace] = useState<SessionWorkspace | null>(null);
  const [loading, setLoading] = useState(true);

  // Chat states
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [creatingChat, setCreatingChat] = useState(false);

  // Fetch session workspace
  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!projectId || !sessionId) {
        setLoading(false);
        showError("Invalid session URL.");
        return;
      }

      try {
        const data = await getSessionWorkspace(projectId, sessionId);
        setWorkspace(data);
      } catch (error) {
        console.error("Failed to load workspace:", error);
        showError("Failed to load session workspace.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
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

  // Derive the active chat from the chat list
  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  ) ?? null;

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
              <h2 className="text-xl font-bold">
                AI Conversations
              </h2>

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
              <p className="text-sm text-slate-500">
                Loading conversations...
              </p>
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
        </section>

        <div className="mt-8">
          <PaperExplorer
            papers={workspace.papers}
            searchType={workspace.searchType}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionWorkspacePage;
