import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
          Authentication successful
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {user?.name}
        </h1>

        <p className="mt-3 text-slate-500 dark:text-slate-400">
          {user?.email}
        </p>
      </div>
    </main>
  );
}