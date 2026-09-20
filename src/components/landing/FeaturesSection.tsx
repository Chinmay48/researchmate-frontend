import { motion } from "framer-motion";
import {
  Brain,
  FileSearch,
  Library,
  MessageSquareText,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Hybrid Paper Search",
    description:
      "Combine keyword matching with semantic retrieval to discover papers using both exact terms and meaning.",
  },
  {
    icon: Brain,
    title: "AI-Powered Research",
    description:
      "Use AI to understand research material and extract useful insights from the literature you explore.",
  },
  {
    icon: Library,
    title: "Research Sessions",
    description:
      "Keep each research topic organized with its own papers, discoveries, and research context.",
  },
  {
    icon: MessageSquareText,
    title: "Grounded Answers",
    description:
      "Build research conversations around retrieved academic sources rather than relying only on generic AI responses.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-y border-slate-200/70 bg-white/60 dark:border-slate-800/70 dark:bg-slate-900/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
            Everything in one workspace
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Research without the chaos
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Move from discovering papers to understanding them without losing
            track of your research.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}