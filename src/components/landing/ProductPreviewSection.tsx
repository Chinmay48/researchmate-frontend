import { motion } from "framer-motion";

export default function ProductPreviewSection() {
  return (
    <section className="overflow-hidden border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              Your research workspace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Keep your research focused in one place.
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              ResearchMate brings paper discovery, research sessions, AI
              assistance, and literature analysis together into a single
              workspace.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          >
            <img
              src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80"
              alt="Research workspace"
              className="h-[360px] w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}