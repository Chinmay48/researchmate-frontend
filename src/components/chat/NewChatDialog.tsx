
import { useEffect, useState } from "react";
import { X, MessageSquare } from "lucide-react";

interface NewChatDialogProps {
  isOpen: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export default function NewChatDialog({
  isOpen,
  creating,
  onClose,
  onCreate,
}: NewChatDialogProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate(title.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !creating) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200
          bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center
              rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40
              dark:text-cyan-400"
            >
              <MessageSquare size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create a new chat
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Start a new research conversation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            className="rounded-lg p-2 text-slate-400 transition
              hover:bg-slate-100 hover:text-slate-700
              disabled:opacity-50 dark:hover:bg-slate-800
              dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <label
          htmlFor="chat-title"
          className="mb-2 block text-sm font-medium
            text-slate-700 dark:text-slate-300"
        >
          Chat title
          <span className="ml-1 font-normal text-slate-400">
            (Optional)
          </span>
        </label>

        <input
          id="chat-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="e.g. Transformer architecture research"
          disabled={creating}
          autoFocus
          className="w-full rounded-xl border border-slate-200
            bg-white px-4 py-3 text-sm text-slate-900 outline-none
            transition focus:border-cyan-500 focus:ring-2
            focus:ring-cyan-100 disabled:opacity-60
            dark:border-slate-700 dark:bg-slate-800
            dark:text-white dark:focus:ring-cyan-950"
        />

        <p className="mt-2 text-xs text-slate-400">
          You can leave this empty and add a title later.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            className="rounded-xl border border-slate-200 px-4 py-2.5
              text-sm font-medium text-slate-600 transition
              hover:bg-slate-50 disabled:opacity-50
              dark:border-slate-700 dark:text-slate-300
              dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-cyan-600 px-5 py-2.5
              text-sm font-semibold text-white transition
              hover:bg-cyan-700 disabled:cursor-not-allowed
              disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Chat"}
          </button>
        </div>
      </form>
    </div>
  );
}
