
import { BookOpen } from "lucide-react";
import type { SearchType, SessionPaper } from "../../types/research";
import PaperCard from "./PaperCard";
interface PaperExplorerProps {
  papers: SessionPaper[];
  searchType: SearchType;
}

export default function PaperExplorer({
  papers,
  searchType,
}: PaperExplorerProps) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Research Papers
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Papers discovered for this research session
          </p>
        </div>

        <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400">
          {papers.length} papers
        </span>
      </div>

      {papers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <BookOpen
            size={36}
            className="mx-auto mb-4 text-slate-400"
          />

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            No papers found
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            There are currently no papers associated with this session.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
  <PaperCard
    key={paper.id}
    paper={paper}
    searchType={searchType}
  />
))}
        </div>
      )}
    </section>
  );
}
