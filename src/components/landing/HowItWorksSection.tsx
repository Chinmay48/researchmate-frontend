import { ArrowRight, Search, Sparkles, FolderPlus } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FolderPlus,
    title: "Create a research topic",
    description:
      "Start a dedicated research session around the topic you want to investigate.",
  },
  {
    number: "02",
    icon: Search,
    title: "Discover literature",
    description:
      "Search academic papers using keyword, semantic, or hybrid retrieval.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Understand the research",
    description:
      "Explore papers and use AI-powered tools to extract useful insights.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
            How ResearchMate works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            From research question to useful insight
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950">
                    <Icon size={21} />
                  </div>

                  <span className="text-sm font-semibold text-slate-400">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <ArrowRight
                    size={18}
                    className="absolute right-0 top-6 hidden text-slate-300 md:block dark:text-slate-700"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}