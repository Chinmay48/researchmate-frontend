
import type { SearchType, SessionPaper } from "../../types/research";

interface PaperScoreDisplayProps {
  searchType: SearchType;
  paper: SessionPaper;
}

function formatScore(score: number | null | undefined): string {
  return score == null ? "N/A" : score.toFixed(4);
}

export default function PaperScoreDisplay({
  searchType,
  paper,
}: PaperScoreDisplayProps) {
  if (searchType === "KEYWORD") {
    return (
      <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Keyword Relevance
        </p>

        <p className="mt-2 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
          {formatScore(paper.keywordScore)}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Based on PostgreSQL full-text search relevance.
        </p>
      </div>
    );
  }

  if (searchType === "SEMANTIC") {
    return (
      <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Semantic Similarity
        </p>

        <p className="mt-2 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
          {formatScore(paper.semanticScore)}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Based on query and paper embedding similarity.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Hybrid Relevance
      </p>

      <p className="mt-2 text-xl font-bold tabular-nums text-cyan-700 dark:text-cyan-400">
        {formatScore(paper.hybridScore)}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-3 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Keyword Score
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatScore(paper.keywordScore)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Semantic Score
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatScore(paper.semanticScore)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Hybrid score combines keyword and semantic rankings using Reciprocal Rank Fusion.
      </p>
    </div>
  );
}
