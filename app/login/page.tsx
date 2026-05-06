"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUi } from "@/components/providers/app-providers";

export default function LoginPage() {
  const { t } = useUi();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (!res.ok) {
        setError("Invalid credentials");
        return;
      }

      const me = await fetch("/api/auth/me", { cache: "no-store" });
      if (me.ok) {
        const data = (await me.json()) as { user: { id: string; email: string; username: string; role: "user" | "admin" | "owner" } | null };
        setUser(data.user);
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h1 className="font-heading text-2xl">{t("auth.signIn")}</h1>
        <input name="email" placeholder={t("auth.email")} className="w-full rounded border border-border bg-muted p-2" />
        <input name="password" type="password" placeholder={t("auth.password")} className="w-full rounded border border-border bg-muted p-2" />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-blue-600 p-2 font-semibold text-white disabled:opacity-60">
          {loading ? "Signing in..." : t("auth.signIn")}
        </button>
        <a href="/api/auth/oauth?provider=google" className="block rounded border border-border p-2 text-center">{t("auth.google")}</a>
        <a href="/api/auth/oauth?provider=discord" className="block rounded border border-border p-2 text-center">{t("auth.discord")}</a>
      </form>
    </main>
  );
}
