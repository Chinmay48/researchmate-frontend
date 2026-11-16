import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SessionPaper } from "../../types/research";

interface MarkdownMessageProps {
  content: string;
  papers?: SessionPaper[];
}

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// Matches bracketed or parenthesized blocks containing UUIDs, e.g.:
// [c7902e52-a6e8-4acf-9464-1b3eff5c8f47, p. 10]
// (f47e981c-90e4-4cd7-a29a-1d929e94e3cf, c7902e52-a6e8-4acf-9464-1b3eff5c8f47)
const CITATION_GROUP_REGEX =
  /[\[(]((?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\s*,\s*p\.?\s*\d+)?\s*,?\s*)+)[\])]/gi;

function formatInlineCitations(
  rawContent: string,
  papers: SessionPaper[]
): string {
  if (!UUID_REGEX.test(rawContent)) {
    return rawContent;
  }

  const paperTitleMap = new Map<string, string>();
  for (const paper of papers) {
    paperTitleMap.set(paper.id.toLowerCase(), paper.title);
  }

  return rawContent.replace(CITATION_GROUP_REGEX, (_match, inner: string) => {
    const itemRegex =
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\s*,\s*(p\.?\s*\d+))?/gi;

    const badges: string[] = [];
    let itemMatch: RegExpExecArray | null;

    while ((itemMatch = itemRegex.exec(inner)) !== null) {
      const uuid = itemMatch[1].toLowerCase();
      const pagePart = itemMatch[2]?.trim();
      const title = paperTitleMap.get(uuid) ?? "Referenced Paper";

      // Escape square brackets inside paper titles so Markdown link syntax stays valid
      const safeTitle = title.replace(/[\[\]]/g, "");
      const label = pagePart ? `${safeTitle}, ${pagePart}` : safeTitle;

      badges.push(`[${label}](#citation)`);
    }

    return badges.length > 0 ? badges.join(" ") : _match;
  });
}

export default function MarkdownMessage({
  content,
  papers = [],
}: MarkdownMessageProps) {
  const formattedContent = useMemo(
    () => formatInlineCitations(content, papers),
    [content, papers]
  );

  return (
    <div
      className="max-w-none text-sm leading-7 text-slate-800 dark:text-slate-200
      [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold
      [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold
      [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold
      [&_p]:mb-4
      [&_strong]:font-semibold [&_strong]:text-slate-950 dark:[&_strong]:text-white
      [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
      [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6
      [&_li]:pl-1
      [&_blockquote]:my-4 [&_blockquote]:border-l-4
      [&_blockquote]:border-cyan-500 [&_blockquote]:pl-4
      [&_blockquote]:text-slate-600 dark:[&_blockquote]:text-slate-400
      [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1
      [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-cyan-700
      dark:[&_code]:bg-slate-800 dark:[&_code]:text-cyan-300
      [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl
      [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-slate-100
      [&_pre_code]:bg-transparent [&_pre_code]:p-0
      [&_hr]:my-6 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-700
      [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse
      [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100
      [&_th]:p-2 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2
      dark:[&_th]:border-slate-700 dark:[&_td]:border-slate-700
      dark:[&_th]:bg-slate-800"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href === "#citation") {
              return (
                <span className="mx-0.5 inline-flex items-baseline rounded-md border border-cyan-300/80 bg-cyan-50 px-1.5 py-0.5 text-xs font-medium leading-snug text-cyan-800 dark:border-cyan-700/70 dark:bg-cyan-950/60 dark:text-cyan-300">
                  [{children}]
                </span>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 underline hover:text-cyan-700 dark:text-cyan-400"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
}