import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

import { register } from "../services/authService";
import { showError, showSuccess } from "../lib/toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      showError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      showSuccess(response.message);

      navigate("/login");
    } catch (error: any) {
        console.log(error)
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">

        {/* Left Side */}
        <div className="hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <img
              src="/researchmate-logo.png"
              alt="ResearchMate"
              className="h-12 w-auto"
            />

            <div className="mt-16 max-w-md">
              <h1 className="text-4xl font-bold leading-tight text-white">
                Start building better research.
              </h1>

              <p className="mt-5 leading-7 text-slate-400">
                Discover academic literature, organize your research, and
                use AI-powered tools to turn papers into meaningful insights.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Search • Analyze • Synthesize
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div>
              <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                Create your account
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Join ResearchMate
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create an account to start your research journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}

                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}