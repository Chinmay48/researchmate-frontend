
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink, FileText } from "lucide-react";
import { getSessionWorkspace } from "../services/researchService";
import type { SessionWorkspace } from "../types/research";
import { showError } from "../lib/toast";
import SessionHeader from "../components/session/SessionHeader";
import PaperExplorer from "../components/session/PaperExplorer";
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

        <SessionHeader workspace={workspace} />

        <PaperExplorer
  papers={workspace.papers}
  searchType={workspace.searchType}
/>
      </div>
    </div>
  );
};

export default SessionWorkspacePage;
