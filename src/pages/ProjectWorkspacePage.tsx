
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderOpen,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import {
  createSession,
  getProject,
  getProjectSessions,
} from "../services/researchService";

import type {
  ResearchProject,
  ResearchSession,
  SearchType,
  CreateSessionRequest,
  SessionStatus,
} from "../types/research";

import { showError, showSuccess } from "../lib/toast";

export default function ProjectWorkspacePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ResearchProject | null>(null);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("SEMANTIC");

  const fetchWorkspace = useCallback(async () => {
    if (!projectId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);

      const [projectData, sessionData] = await Promise.all([
        getProject(projectId),
        getProjectSessions(projectId),
      ]);

      setProject(projectData);
      setSessions(sessionData);
    } catch (error) {
      console.error("Failed to load project workspace:", error);
      setHasError(true);
      showError("Unable to load project workspace.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  async function handleCreateSession(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!projectId) return;

    if (!title.trim() || !query.trim()) {
      showError("Session title and research query are required.");
      return;
    }

    if (title.trim().length > 300 || query.trim().length > 5000) {
      showError("Please check the maximum field lengths.");
      return;
    }

    const request: CreateSessionRequest = {
      title: title.trim(),
      query: query.trim(),
      searchType,
    };

    try {
      setIsCreating(true);

      const newSession = await createSession(projectId, request);

      setSessions((previous) => [newSession, ...previous]);

      setTitle("");
      setQuery("");
      setSearchType("SEMANTIC");
      setShowCreateForm(false);

      showSuccess("Research session created successfully!");
    } catch (error) {
      console.error("Failed to create session:", error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to create research session.";

        showError(message);
      } else {
        showError("Something went wrong. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusStyle(status: SessionStatus) {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";

      case "RUNNING":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

      case "FAILED":
        return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";

      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  }

  function getSearchTypeLabel(type: SearchType) {
    switch (type) {
      case "KEYWORD":
        return "Keyword Search";
      case "SEMANTIC":
        return "Semantic Search";
      case "HYBRID":
        return "Hybrid Search";
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-cyan-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading project workspace...
          </p>
        </div>
      </main>
    );
  }

  if (hasError || !project) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Unable to load project
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The project may not exist or you may not have access to it.
        </p>

        <button
          onClick={fetchWorkspace}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>

        <Link
          to="/research"
          className="mt-4 text-sm text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          to="/research"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        {/* Project Header */}
        <section className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400">
                <FolderOpen size={28} />
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  Research Project
                </p>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {project.title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {project.description || "No project description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Research Question */}
          {project.researchQuestion && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                <Sparkles size={17} />
                Main Research Question
              </div>

              <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-200">
                {project.researchQuestion}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Created {formatDate(project.createdAt)}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} />
              Updated {formatDate(project.updatedAt)}
            </span>
          </div>
        </section>

        {/* Sessions Header */}
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Research Sessions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Organize different investigations within this project.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <Plus size={18} />
            New Session
          </button>
        </section>

        {/* Create Session Form */}
        {showCreateForm && (
          <div className="mb-7 rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm dark:border-cyan-900/50 dark:bg-slate-900 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create Research Session
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Define what you want to investigate.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSession}>

              {/* Title */}
              <div className="mb-5">
                <label
                  htmlFor="sessionTitle"
                  className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Session Title *
                </label>

                <input
                  id="sessionTitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Transfer Learning Analysis"
                  maxLength={300}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {title.length}/300
                </p>
              </div>

              {/* Query */}
              <div className="mb-6">
                <label
                  htmlFor="sessionQuery"
                  className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Research Query *
                </label>

                <textarea
                  id="sessionQuery"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Describe the topic or problem you want to investigate..."
                  maxLength={5000}
                  rows={4}
                  required
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {query.length}/5000
                </p>
              </div>

              {/* Search Type */}
              <div className="mb-7">
                <label className="mb-3 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Search Type *
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                  {([
                    {
                      value: "KEYWORD",
                      title: "Keyword Search",
                      description: "Find papers using matching words and phrases.",
                    },
                    {
                      value: "SEMANTIC",
                      title: "Semantic Search",
                      description: "Find papers based on meaning and context.",
                    },
                    {
                      value: "HYBRID",
                      title: "Hybrid Search",
                      description: "Combine keyword and semantic matching.",
                    },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSearchType(option.value)}
                      className={`rounded-xl border p-4 text-left transition ${
                        searchType === option.value
                          ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-500/20 dark:border-cyan-600 dark:bg-cyan-950/30"
                          : "border-slate-200 bg-white hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-950"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {option.title}
                        </span>

                        {searchType === option.value && (
                          <CheckCircle2 size={18} className="text-cyan-600 dark:text-cyan-400" />
                        )}
                      </div>

                      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {option.description}
                      </p>
                    </button>
                  ))}

                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || !title.trim() || !query.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Session
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        )}

        {/* Session List */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
              <Search size={30} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              No research sessions yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Start your first session to discover relevant research papers
              and explore your topic with AI.
            </p>

            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                <Plus size={17} />
                Create First Session
              </button>
            )}

          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {sessions.map((session) => (
              <article
                key={session.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800 dark:hover:shadow-none"
              >

                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                    <Search size={21} />
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(session.status)}`}>
                    {session.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {session.title}
                </h3>

                <p className="mt-2 line-clamp-3 min-h-15 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {session.query}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">
                    {getSearchTypeLabel(session.searchType)}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    Updated {formatDate(session.updatedAt)}
                  </span>

                  <Link
                    to={`/research/${projectId}/sessions/${session.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                  >
                    Open
                    <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

              </article>
            ))}

          </section>
        )}

      </div>
    </main>
  );
}
