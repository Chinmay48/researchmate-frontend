import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
export default function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl">
          <Sparkles className="mx-auto text-cyan-400" size={24} />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to start your next research project?
          </h2>

          <p className="mt-4 text-slate-400">
            Create a research session and start discovering literature with
            ResearchMate.
          </p>

          <Link
  to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Get Started
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}