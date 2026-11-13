
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({
  content,
}: MarkdownMessageProps) {
  return (
    <div className="max-w-none text-sm leading-7 text-slate-800 dark:text-slate-200
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
      [&_a]:text-cyan-600 [&_a]:underline dark:[&_a]:text-cyan-400
      [&_hr]:my-6 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-700
      [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse
      [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100
      [&_th]:p-2 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2
      dark:[&_th]:border-slate-700 dark:[&_td]:border-slate-700
      dark:[&_th]:bg-slate-800"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
