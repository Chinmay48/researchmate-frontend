import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, FileText } from "lucide-react";
import type { MessageSource } from "../../types/chat";
import type { SessionPaper } from "../../types/research";

interface ChatSourcesProps {
  sources: MessageSource[];
  papers: SessionPaper[];
}

const ChatSources: React.FC<ChatSourcesProps> = ({ sources, papers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-slate-200/80 pt-3 dark:border-slate-800">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-cyan-400"
      >
        <BookOpen className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
        <span>
          Sources ({sources.length})
        </span>
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Expandable Source Cards */}
      {isExpanded && (
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {sources.map((source, index) => {
            const matchedPaper = papers.find(
              (paper) => paper.id === source.paperId,
            );
            const paperTitle =
              matchedPaper?.title ?? "Referenced Research Paper";

            return (
              <div
                key={`${source.chunkId}-${index}`}
                className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/70"
              >
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                  <div className="min-w-0 flex-1">
                    <p
                      className="line-clamp-2 font-medium leading-snug text-slate-800 dark:text-slate-200"
                      title={paperTitle}
                    >
                      {paperTitle}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>
                        {source.pageNumber !== null
                          ? `Page ${source.pageNumber}`
                          : "Page N/A"}
                      </span>

                      {source.sectionTitle && (
                        <>
                          <span>•</span>
                          <span className="truncate" title={source.sectionTitle}>
                            {source.sectionTitle}
                          </span>
                        </>
                      )}

                      {source.retrievalDistance !== null && (
                        <>
                          <span>•</span>
                          <span>
                            Distance: {source.retrievalDistance.toFixed(3)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatSources;