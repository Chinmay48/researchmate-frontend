
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { SessionWorkspace } from "../../types/research";

interface SessionHeaderProps {
  workspace: SessionWorkspace;
}

export default function SessionHeader({
  workspace,
}: SessionHeaderProps) {
  return (
    <section className="mb-8">
      {/* Navigation */}
      <Link
        to={`/research/${workspace.projectId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
      >
        <ArrowLeft size={16} />
        Back to Project
      </Link>

      {/* Session information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Research Session
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {workspace.title}
            </h1>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {workspace.query}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">
              {workspace.searchType}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {workspace.status}
            </span>
          </div>
        </div>

        {/* Session metadata */}
        <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText
              size={17}
              className="text-slate-400"
            />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Papers
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {workspace.totalPapers}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays
              size={17}
              className="text-slate-400"
            />

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created On
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {new Date(workspace.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
