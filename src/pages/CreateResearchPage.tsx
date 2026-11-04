
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FolderPlus,
  Lightbulb,
  Loader2,
  Sparkles,
} from "lucide-react";
import axios from "axios";

import { createProject } from "../services/researchService";
import { showError, showSuccess } from "../lib/toast";

export default function CreateResearchPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      showError("Project title is required.");
      return;
    }

    if (title.trim().length > 300) {
      showError("Project title cannot exceed 300 characters.");
      return;
    }

    if (description.length > 5000 || researchQuestion.length > 5000) {
      showError("Description and research question cannot exceed 5000 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createProject({
        title: title.trim(),
        description: description.trim(),
        researchQuestion: researchQuestion.trim(),
      });

      showSuccess("Research project created successfully!");

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to create project. Please try again.";

        showError(message);
      } else {
        showError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-3xl">

        {/* Back Navigation */}
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400">
            <FolderPlus size={25} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Create a Research Project
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Give your research a direction. Organize related papers,
            sessions and AI-powered conversations in one place.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >

          {/* Project Title */}
          <div className="mb-6">
            <label
              htmlFor="projectTitle"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Project Title <span className="text-red-500">*</span>
            </label>

            <input
              id="projectTitle"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Brain Injury Research"
              maxLength={300}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <p className="mt-1.5 text-right text-xs text-slate-400">
              {title.length}/300
            </p>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="projectDescription"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Project Description
              <span className="ml-2 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <textarea
              id="projectDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the purpose of this research project..."
              maxLength={5000}
              rows={4}
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <p className="mt-1.5 text-right text-xs text-slate-400">
              {description.length}/5000
            </p>
          </div>

          {/* Research Question */}
          <div className="mb-8">
            <label
              htmlFor="researchQuestion"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              <Lightbulb size={17} className="text-amber-500" />
              Main Research Question

              <span className="text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <textarea
              id="researchQuestion"
              value={researchQuestion}
              onChange={(event) => setResearchQuestion(event.target.value)}
              placeholder="What problem are you trying to investigate or solve?"
              maxLength={5000}
              rows={3}
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <p className="mt-1.5 text-right text-xs text-slate-400">
              {researchQuestion.length}/5000
            </p>

            <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/20">
              <Sparkles
                size={17}
                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
              />

              <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                A clear research question helps you keep your
                investigation focused and organized.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <FolderPlus size={17} />
                  Create Project
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}
