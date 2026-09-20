import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <h1 className="text-4xl font-bold">
            Research<span className="text-cyan-500">Mate</span>
          </h1>
        </div>
      </main>
    </div>
  );
}

export default App;