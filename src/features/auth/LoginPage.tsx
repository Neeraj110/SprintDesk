import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api/authService";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../hooks/useToast";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const { addToast } = useToast();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await login({ username, password, rememberMe });
      setTokens(data.accessToken, data.refreshToken);
      setUser(data);

      addToast({
        title: "Authenticated",
        message: `Welcome back, ${data.firstName || data.username}`,
        type: "success",
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid credentials. Try 'emilys' / 'emilyspass'.";
      setError(msg);
      addToast({
        title: "Login Failed",
        message: "Invalid credentials. Try using 'emilys' / 'emilyspass'.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 items-center justify-center text-blue-400 mb-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            SprintDesk Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with your team credentials to access the sprint board.
          </p>
        </div>

        {/* Demo Credentials Quick Selector Banner */}
        <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2 text-xs ">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span>Demo Accounts</span>
            <span className="text-[10px] bg-slate-700/60 px-2 py-0.5 rounded text-slate-300">DummyJSON</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillSampleCredentials("emilys", "emilyspass")}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-center font-mono border border-slate-700 text-[11px] transition-colors"
            >
              emilys / emilyspass
            </button>
            <button
              type="button"
              onClick={() => fillSampleCredentials("michaelw", "michaelwpass")}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-center font-mono border border-slate-700 text-[11px] transition-colors"
            >
              michaelw / michaelwpass
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            className="text-black"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            showPasswordToggle
            showPasswordMeter
            required
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            className="text-black"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember session (30 days)</span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
