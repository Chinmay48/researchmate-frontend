
import { useState } from "react";
import {
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react";
import type { SessionPaper } from "../../types/research";
import PaperScoreDisplay from "./PaperScoreDisplay";
import type { SearchType } from "../../types/research";
interface PaperCardProps {
  paper: SessionPaper;
  searchType: SearchType;
}

function formatScore(score: number | null | undefined) {
  return score == null ? "N/A" : score.toFixed(4);
}

export default function PaperCard({
  paper,
  searchType,
}: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);



  const abstract = paper.abstractText || "No abstract available.";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-800">

      {/* Title and rank */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold leading-6 text-slate-900 dark:text-white">
              {paper.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {paper.authors || "Authors not available"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Rank #{paper.rank}
        </span>
      </div>

      {/* Publication metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {paper.publishedAt && (
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {new Date(paper.publishedAt).getFullYear()}
          </span>
        )}

        {paper.categories && (
          <span className="rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
            {paper.categories}
          </span>
        )}
      </div>

      {/* Abstract */}
      <div className="mt-4">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {expanded || abstract.length <= 350
            ? abstract
            : `${abstract.substring(0, 350)}...`}
        </p>

        {abstract.length > 350 && (
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
          >
            {expanded ? "Show less" : "Read more"}
            {expanded ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        )}
      </div>

      {/* Relevance scores */}
    <PaperScoreDisplay
  paper={paper}
  searchType={searchType}
/>

      {/* Paper links */}
      <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        {paper.paperUrl && (
          <a
            href={paper.paperUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
          >
            View Paper
            <ExternalLink size={14} />
          </a>
        )}

        {paper.pdfUrl && (
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-400"
          >
            View PDF
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
