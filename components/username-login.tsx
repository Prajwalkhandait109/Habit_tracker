"use client";

import { FormEvent, useState } from "react";
import { Snowflake, UserRound } from "lucide-react";
import { useLogin } from "@/lib/hooks/useSession";
import { Button } from "@/components/ui/button";

export function UsernameLogin() {
  const [username, setUsername] = useState("");
  const login = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login.mutate(username);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(34,211,238,0.12),transparent_55%)]" />
      <section className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Snowflake className="mx-auto mb-4 h-10 w-10 text-cyan-300" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gradient">Winter Arc</h1>
          <p className="mt-2 text-sm text-white/55">Enter your username to open your tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-xl p-6">
          <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/75">
            Username
          </label>
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
            <input
              id="username"
              autoComplete="username"
              autoFocus
              maxLength={32}
              pattern="[A-Za-z0-9_\-]{1,32}"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g. prajwal"
              required
            />
          </div>
          {login.isError && (
            <p className="mt-3 text-sm text-rose-300" role="alert">{login.error.message}</p>
          )}
          <Button type="submit" variant="winter" className="mt-5 w-full" disabled={login.isPending}>
            {login.isPending ? "Opening tracker..." : "Continue"}
          </Button>
        </form>
      </section>
    </main>
  );
}