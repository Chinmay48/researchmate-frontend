import React from "react";
import { Send, Loader2, Sparkles, BookCheck, AlertCircle } from "lucide-react";
import type { AnswerMode } from "../../types/chat";

interface ChatInputProps {
  question: string;
  answerMode: AnswerMode;
  generating: boolean;
  disabled?: boolean;
  selectedPaperCount: number;
  hasUnsavedSelection?: boolean;
  onQuestionChange: (value: string) => void;
  onAnswerModeChange: (mode: AnswerMode) => void;
  onSubmit: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  question,
  answerMode,
  generating,
  disabled = false,
  selectedPaperCount,
  hasUnsavedSelection = false,
  onQuestionChange,
  onAnswerModeChange,
  onSubmit,
}) => {
  const canSubmit =
    question.trim().length > 0 && !generating && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter; allow Shift+Enter for multi-line research prompts
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        onSubmit();
      }
    }
  };

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6 sm:py-4">
      <div className="mx-auto max-w-3xl">
        {/* Contextual Status Banner */}
        {(selectedPaperCount === 0 || hasUnsavedSelection) && !disabled && (
          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs">
            {selectedPaperCount === 0 && (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                No papers selected for this chat — select and save papers in the sidebar for grounded answers.
              </span>
            )}
            {hasUnsavedSelection && (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Unsaved paper selection changes — click Save Selection in the sidebar to apply them.
              </span>
            )}
          </div>
        )}

        {/* Rounded Composer Box */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2.5 shadow-xs transition-colors focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus-within:border-cyan-500 dark:focus-within:bg-slate-900 dark:focus-within:ring-cyan-500/20">
          <textarea
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your research..."
            rows={2}
            disabled={generating || disabled}
            className="max-h-44 min-h-[56px] w-full resize-y border-0 bg-transparent px-2 py-1 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder-slate-500"
          />

          {/* Bottom Toolbar: Answer Mode Selector + Send Button */}
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-2 dark:border-slate-800">
            {/* Answer Mode Selector */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={generating || disabled}
                onClick={() => onAnswerModeChange("RESEARCH_GROUNDED")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  answerMode === "RESEARCH_GROUNDED"
                    ? "bg-cyan-600 text-white dark:bg-cyan-600"
                    : "text-slate-600 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <BookCheck className="h-3.5 w-3.5" />
                <span>Research Grounded</span>
              </button>

              <button
                type="button"
                disabled={generating || disabled}
                onClick={() => onAnswerModeChange("AI_ENHANCED")}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  answerMode === "AI_ENHANCED"
                    ? "bg-cyan-600 text-white dark:bg-cyan-600"
                    : "text-slate-600 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Enhanced</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-2">
              <span className="hidden text-[11px] text-slate-400 dark:text-slate-500 sm:inline">
                Enter to send · Shift+Enter for new line
              </span>

              <button
                type="button"
                onClick={onSubmit}
                disabled={!canSubmit}
                aria-label="Send question"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;