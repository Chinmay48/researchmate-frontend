export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <img
            src="/researchmate-logo.png"
            alt="ResearchMate"
            className="h-7 w-auto"
          />
        </div>

        <p>© {new Date().getFullYear()} ResearchMate. All rights reserved.</p>
      </div>
    </footer>
  );
}