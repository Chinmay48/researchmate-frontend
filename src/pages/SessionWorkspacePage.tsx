
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink, FileText } from "lucide-react";
import { getSessionWorkspace } from "../services/researchService";
import type { SessionWorkspace } from "../types/research";
import { showError } from "../lib/toast";

const SessionWorkspacePage = () => {
  const { projectId, sessionId } = useParams<{
    projectId: string;
    sessionId: string;
  }>();

  const [workspace, setWorkspace] = useState<SessionWorkspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!projectId || !sessionId) {
        setLoading(false);
        showError("Invalid session URL.");
        return;
      }

      try {
        const data = await getSessionWorkspace(projectId, sessionId);
        setWorkspace(data);
      } catch (error) {
        console.error("Failed to load workspace:", error);
        showError("Failed to load session workspace.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [projectId, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-600 dark:text-gray-300">
          Loading workspace...
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-300">
          Unable to load this session.
        </p>
        <Link
          to={projectId ? `/research/${projectId}` : "/research"}
          className="text-blue-600 hover:underline"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Back navigation */}
        <Link
          to={`/research/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>

        {/* Session information */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Research Session
              </p>
              <h1 className="text-2xl font-bold">{workspace.title}</h1>
            </div>

            <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {workspace.status}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {workspace.query}
          </p>

          <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Search Type
              </p>
              <p className="font-medium mt-1">{workspace.searchType}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Papers
              </p>
              <p className="font-medium mt-1">{workspace.totalPapers}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created
              </p>
              <p className="font-medium mt-1">
                {new Date(workspace.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Papers section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">Research Papers</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Papers associated with this research session
              </p>
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {workspace.papers.length} papers
            </span>
          </div>

          {workspace.papers.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
              <BookOpen
                size={36}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="font-semibold text-lg">No papers found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                There are currently no papers associated with this session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workspace.papers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 h-fit">
                        <FileText
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug">
                          {paper.title}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {paper.authors || "Authors not available"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      Rank #{paper.rank}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                    {paper.abstractText
                      ? paper.abstractText.length > 350
                        ? `${paper.abstractText.substring(0, 350)}...`
                        : paper.abstractText
                      : "No abstract available."}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    {paper.publishedAt && (
                      <span className="text-gray-500 dark:text-gray-400">
                        Published:{" "}
                        {new Date(paper.publishedAt).getFullYear()}
                      </span>
                    )}

                    {paper.paperUrl && (
                      <a
                        href={paper.paperUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View Paper <ExternalLink size={14} />
                      </a>
                    )}

                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View PDF <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionWorkspacePage;
