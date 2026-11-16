import { useEffect, useState } from "react";
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  Plus,
  ArrowRight,
  Clock3,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyProjects, getProjectSessions } from "../services/researchService";
import type { ResearchProject, ResearchSession } from "../types/research";
import { showError } from "../lib/toast";

export default function DashboardPage() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        const fetchedProjects = await getMyProjects();

        // Fetch sessions for all projects in parallel
        const sessionsByProject = await Promise.all(
          fetchedProjects.map((project) => getProjectSessions(project.id))
        );

        if (!cancelled) {
          setProjects(fetchedProjects);
          setSessions(sessionsByProject.flat());
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load dashboard data:", error);
          showError("Failed to load dashboard overview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedSessionsCount = sessions.filter(
    (session) => session.status === "COMPLETED"
  ).length;

  // Sort projects by most recently updated and take top 3
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  const stats = [
    {
      title: "Total Projects",
      value: loading ? "—" : projects.length.toString(),
      icon: FolderKanban,
    },
    {
      title: "Research Sessions",
      value: loading ? "—" : sessions.length.toString(),
      icon: FileText,
    },
    {
      title: "Completed Sessions",
      value: loading ? "—" : completedSessionsCount.toString(),
      icon: CheckCircle2,
    },
  ];

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <section className="mb-8">
          <p className="flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
            <Sparkles size={16} />
            Your research workspace
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Researcher"}!
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Organize your research, explore papers and discover insights with AI.
          </p>
        </section>

        {/* Create Project Banner */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-6 shadow-lg shadow-cyan-900/10 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
              <Sparkles size={14} />
              Start something new
            </div>

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Turn your research ideas into discoveries.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-cyan-50 sm:text-base">
              Create a research project, organize your papers and use AI to
              explore academic knowledge more effectively.
            </p>

            <Link
              to="/research/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-cyan-700 shadow-sm transition hover:bg-cyan-50"
            >
              <Plus size={18} />
              Create New Project
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Decorative background elements */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 right-40 h-64 w-64 rounded-full border-[35px] border-white/10" />
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Overview
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </p>

                    <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                      <Icon size={20} />
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Projects
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Continue where you left off.
              </p>
            </div>

            {projects.length > 0 && (
              <Link
                to="/research"
                className="inline-flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                <FolderKanban size={30} />
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Your research journey starts here
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                You haven&apos;t created any research projects yet. Create your
                first project to organize papers, research sessions and AI
                conversations.
              </p>

              <Link
                to="/research/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                <Plus size={17} />
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentProjects.map((project) => {
                const projectSessionCount = sessions.filter(
                  (s) => s.projectId === project.id
                ).length;

                return (
                  <Link
                    key={project.id}
                    to={`/research/${project.id}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                          {project.title}
                        </h3>
                        <ArrowRight
                          size={16}
                          className="mt-1 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400"
                        />
                      </div>

                      {project.researchQuestion && (
                        <p className="mt-2 line-clamp-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                          {project.researchQuestion}
                        </p>
                      )}

                      {project.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <span>
                        {projectSessionCount}{" "}
                        {projectSessionCount === 1 ? "session" : "sessions"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Clock3 size={14} />
          Your research workspace, all in one place.
        </div>
      </div>
    </main>
  );
}