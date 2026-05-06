"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Moon, Search, Sun, Trophy } from "lucide-react";
import { useAuth, useUi } from "@/components/providers/app-providers";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang, theme, toggleTheme } = useUi();
  const { user } = useAuth();
  const router = useRouter();
  const canSeeAdmin = user?.role === "admin" || user?.role === "owner";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-[#1b2140] bg-[#0a1024]/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-wide">
            <Trophy size={16} className="text-yellow-300" />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">GEORGIAN TIER LIST</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-zinc-300 md:flex">
            <Link className="rounded-md px-2 py-1 hover:bg-[#1a2347]" href="/">
              {t("nav.home")}
            </Link>
            {canSeeAdmin ? (
              <Link className="rounded-md px-2 py-1 hover:bg-[#1a2347]" href="/admin">
                {t("nav.admin")}
              </Link>
            ) : null}
            {!user && (
              <>
                <Link className="rounded-md px-2 py-1 hover:bg-[#1a2347]" href="/login">
                  {t("nav.login")}
                </Link>
                <Link className="rounded-md px-2 py-1 hover:bg-[#1a2347]" href="/register">
                  {t("nav.register")}
                </Link>
              </>
            )}
            {user ? (
              <div className="ml-2 inline-flex items-center gap-2 rounded-md border border-[#2a335b] bg-[#101938] px-2 py-1 text-xs">
                <span className="text-zinc-200">
                  Signed in as <span className="font-semibold">{user.username}</span>
                </span>
                <span className="rounded bg-[#1f2b56] px-1.5 py-0.5 uppercase text-[10px] text-zinc-200">{user.role}</span>
                <button className="rounded bg-[#1a2347] px-2 py-0.5 text-zinc-200 hover:bg-[#24305f]" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-md border border-[#222b4d] bg-[#0f1732] px-2 py-1 text-xs text-zinc-400 lg:flex">
              <Search size={12} />
              Search players...
            </div>
            <button
              className="rounded-md border border-[#2a335b] bg-[#101938] px-2 py-1 text-xs"
              onClick={() => setLang(lang === "en" ? "ka" : "en")}
            >
              {lang.toUpperCase()}
            </button>
            <button className="rounded-md border border-[#2a335b] bg-[#101938] p-1.5" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

