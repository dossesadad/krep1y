"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Moon, Search, Sun, Trophy } from "lucide-react";
import { useAuth, useUi } from "@/components/providers/app-providers";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang, theme, toggleTheme } = useUi();
  const { user } = useAuth();

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
            <Link className="rounded-md px-2 py-1 hover:bg-[#1a2347]" href="/admin">
              {t("nav.admin")}
            </Link>
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

