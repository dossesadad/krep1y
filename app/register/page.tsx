"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUi } from "@/components/providers/app-providers";

export default function RegisterPage() {
  const { t } = useUi();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        username: form.get("username"),
      }),
    });
    if (!res.ok) {
      setError("Registration failed");
      return;
    }
    router.push("/login");
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h1 className="font-heading text-2xl">{t("auth.signUp")}</h1>
        <input name="username" placeholder={t("auth.username")} className="w-full rounded border border-border bg-muted p-2" />
        <input name="email" placeholder={t("auth.email")} className="w-full rounded border border-border bg-muted p-2" />
        <input name="password" type="password" placeholder={t("auth.password")} className="w-full rounded border border-border bg-muted p-2" />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button className="w-full rounded bg-blue-600 p-2 font-semibold text-white">{t("auth.signUp")}</button>
      </form>
    </main>
  );
}
