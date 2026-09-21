import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";

import { login as loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../lib/toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      showError("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      login({
        userId: response.userId,
        name: response.name,
        email: response.email,
        token: response.token,
      });

      showSuccess(`Welcome back, ${response.name}!`);

      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Invalid email or password.";

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
                Continue your research.
              </h1>

              <p className="mt-5 leading-7 text-slate-400">
                Pick up where you left off, explore literature, and continue
                building your research projects with ResearchMate.
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
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign in to ResearchMate
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Enter your credentials to continue your research.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                {isSubmitting ? "Signing in..." : "Sign In"}

                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}