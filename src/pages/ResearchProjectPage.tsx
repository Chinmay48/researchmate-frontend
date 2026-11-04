
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Plus,
  Search,
  ArrowUpRight,
  CalendarDays,
  Loader2,
  RefreshCw,
  FlaskConical,
} from "lucide-react";

import { getMyProjects } from "../services/researchService";
import type { ResearchProject } from "../types/research";
import { showError } from "../lib/toast";

export default function ResearchProjectsPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function fetchProjects() {
    try {
      setIsLoading(true);
      setHasError(false);

      const data = await getMyProjects();

      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setHasError(true);
      showError("Unable to load your research projects.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) =>
      [
        project.title,
        project.description,
        project.researchQuestion,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              <FlaskConical size={16} />
              Your research workspace
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              My Research Projects
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Organize your research and continue exploring new ideas.
            </p>
          </div>

          <Link
            to="/research/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <Plus size={18} />
            Create Project
          </Link>

        </section>

        {/* Search and count */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {!isLoading && !hasError && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          )}

        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-cyan-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading your projects...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">

            <p className="font-semibold text-slate-900 dark:text-white">
              Couldn't load your projects
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Please check your connection and try again.
            </p>

            <button
              onClick={fetchProjects}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
              <FolderKanban size={30} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              No research projects yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create your first project to organize your research papers,
              sessions and AI-powered conversations.
            </p>

            <Link
              to="/research/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              <Plus size={17} />
              Create Your First Project
            </Link>

          </div>
        )}

        {/* No Search Results */}
        {!isLoading &&
          !hasError &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
              <Search size={30} className="mx-auto text-slate-400" />

              <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                No matching projects
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Try searching with a different keyword.
              </p>
            </div>
          )}

        {/* Project Cards */}
        {!isLoading && !hasError && filteredProjects.length > 0 && (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800 dark:hover:shadow-none"
              >

                <div className="mb-4 flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                    <FolderKanban size={22} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Research Project
                  </span>

                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {project.title}
                </h2>

                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {project.description || "No description provided."}
                </p>

                {project.researchQuestion && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/70">
                    <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Research Question
                    </p>

                    <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {project.researchQuestion}
                    </p>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={14} />
                    Updated {formatDate(project.updatedAt)}
                  </div>

                  <Link
                    to={`/research/${project.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400"
                  >
                    Open
                    <ArrowUpRight
                      size={16}
                      className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
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
