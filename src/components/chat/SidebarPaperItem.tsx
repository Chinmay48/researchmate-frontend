import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Check,
} from "lucide-react";
import type { SessionPaper } from "../../types/research";

interface SidebarPaperItemProps {
  paper: SessionPaper;
  selected: boolean;
  onToggleSelection: (paperId: string) => void;
  disabled?: boolean;
}

export const SidebarPaperItem: React.FC<SidebarPaperItemProps> = ({
  paper,
  selected,
  onToggleSelection,
  disabled = false,
}) => {
  // Local UI state: only this item needs to know if its details are open
  const [isExpanded, setIsExpanded] = useState(false);

  const publicationYear = paper.publishedAt
    ? new Date(paper.publishedAt).getFullYear()
    : null;

  const formatScore = (score: number | null) =>
    score !== null && score !== undefined ? score.toFixed(4) : null;

  const keywordScore = formatScore(paper.keywordScore);
  const semanticScore = formatScore(paper.semanticScore);
  const hybridScore = formatScore(paper.hybridScore);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up and toggling the expand/collapse row
    e.stopPropagation();
  };

  return (
    <div
      className={`rounded-xl border transition-colors ${
        selected
          ? "border-cyan-500/40 bg-cyan-50/60 dark:border-cyan-500/30 dark:bg-cyan-950/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
      }`}
    >
      {/* Compact Header Row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }
        }}
        className="flex cursor-pointer items-start gap-2.5 p-2.5 text-left"
      >
        {/* Selection Checkbox */}
        <div onClick={handleCheckboxClick} className="pt-0.5">
          <button
            type="button"
            role="checkbox"
            aria-checked={selected}
            aria-label={`Select ${paper.title}`}
            disabled={disabled}
            onClick={() => onToggleSelection(paper.id)}
            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
              selected
                ? "border-cyan-600 bg-cyan-600 text-white dark:border-cyan-500 dark:bg-cyan-500"
                : "border-slate-300 bg-white hover:border-cyan-500 dark:border-slate-600 dark:bg-slate-800"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {selected && <Check className="h-3 w-3 stroke-[3]" />}
          </button>
        </div>

        {/* Compact Title & Metadata */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-medium leading-snug text-slate-900 dark:text-slate-100 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {paper.title}
          </p>

          {!isExpanded && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate">{paper.authors || "Unknown authors"}</span>
              {publicationYear && !Number.isNaN(publicationYear) && (
                <>
                  <span>•</span>
                  <span className="shrink-0">{publicationYear}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Expand / Collapse Indicator */}
        <span className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="space-y-2.5 border-t border-slate-200/80 px-3 pb-3 pt-2.5 text-xs dark:border-slate-800">
          {/* Authors */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Authors
            </span>
            <p className="mt-0.5 text-slate-700 dark:text-slate-300">
              {paper.authors || "Not listed"}
            </p>
          </div>

          {/* Publication & Categories */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Publication
              </span>
              <p className="mt-0.5 text-slate-700 dark:text-slate-300">
                {publicationYear && !Number.isNaN(publicationYear)
                  ? publicationYear
                  : "N/A"}
              </p>
            </div>

            {paper.categories && (
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Categories
                </span>
                <p className="mt-0.5 truncate text-slate-700 dark:text-slate-300" title={paper.categories}>
                  {paper.categories}
                </p>
              </div>
            )}
          </div>

          {/* Abstract */}
          {paper.abstractText && (
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Abstract
              </span>
              <p className="mt-0.5 max-h-36 overflow-y-auto leading-relaxed text-slate-600 dark:text-slate-300">
                {paper.abstractText}
              </p>
            </div>
          )}

          {/* Relevance Scores */}
          {(keywordScore || semanticScore || hybridScore) && (
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Relevance Scores
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {keywordScore && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Keyword: {keywordScore}
                  </span>
                )}
                {semanticScore && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Semantic: {semanticScore}
                  </span>
                )}
                {hybridScore && (
                  <span className="rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    Hybrid: {hybridScore}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* External Links */}
          {(paper.paperUrl || paper.pdfUrl) && (
            <div className="flex items-center gap-2 pt-1">
              {paper.paperUrl && (
                <a
                  href={paper.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Paper
                </a>
              )}
              {paper.pdfUrl && (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-400"
                >
                  <FileText className="h-3 w-3" />
                  View PDF
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};