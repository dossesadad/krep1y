"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, MessageCircle, Moon, Search, Sun, Trophy } from "lucide-react";
import { useAuth, useUi } from "@/components/providers/app-providers";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t, lang, setLang, theme, toggleTheme } = useUi();
  const { user, refreshUser, setUser } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const canSeeAdmin = user?.role === "admin" || user?.role === "owner";
  const discordInviteUrl = "https://discord.gg/uSy2vWXg";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    await refreshUser();
    router.refresh();
    router.push("/");
  };

  const copyServerAddress = async () => {
    try {
      await navigator.clipboard.writeText(discordInviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-[#3b1212] bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold tracking-wide">
            <Trophy size={16} className="text-red-700" />
            <span className="bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">GEORGIAN TIER LIST</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-zinc-300 md:flex">
            <Link className="rounded-md px-2 py-1 hover:bg-[#2a1010]" href="/">
              {t("nav.home")}
            </Link>
            {canSeeAdmin ? (
              <Link className="rounded-md px-2 py-1 hover:bg-[#2a1010]" href="/admin">
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
              <div className="ml-2 inline-flex items-center gap-2 rounded-md border border-[#3b1212] bg-[#110707] px-2 py-1 text-xs">
                <span className="text-zinc-200">
                  Signed in as <span className="font-semibold">{user.username}</span>
                </span>
                <span className="rounded bg-[#2a1010] px-1.5 py-0.5 uppercase text-[10px] text-red-300">{user.role}</span>
                <button className="rounded bg-[#2a1010] px-2 py-0.5 text-red-300 hover:bg-[#3a1414]" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
            <div className="ml-2 inline-flex items-center gap-1.5 rounded-md border border-[#3b1212] bg-[#110707] px-2 py-1 text-[10px] uppercase tracking-wide text-zinc-300">
              <Link
                href="/owner"
                className="rounded bg-[#2a1010] px-1.5 py-0.5 text-[9px] font-semibold text-red-300 transition hover:bg-[#3a1414]"
              >
                Owner
              </Link>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-[#3b1212] bg-[#110707] px-2 py-1 lg:flex">
              <div className="rounded bg-gradient-to-b from-red-500 to-red-700 px-1.5 py-1 text-[10px] font-black italic leading-tight text-white">
                GEORGIATIER
              </div>
              <div className="text-[10px] leading-tight">
                <p className="uppercase tracking-wide text-zinc-400">Discord</p>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-zinc-100">discord.gg/uSy2vWXg</span>
                  <button
                    type="button"
                    onClick={copyServerAddress}
                    className="rounded p-0.5 text-zinc-400 transition hover:bg-[#2a1010] hover:text-red-300"
                    aria-label="Copy Discord link"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <a
                href={discordInviteUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#2a1010] p-1.5 text-red-300 transition hover:bg-[#3a1414]"
                aria-label="Open Discord"
              >
                <MessageCircle size={14} />
              </a>
            </div>
            <div className="hidden items-center gap-1 rounded-md border border-[#3b1212] bg-[#110707] px-2 py-1 text-xs text-zinc-400 lg:flex">
              <Search size={12} />
              Search players...
            </div>
            <button
              className="rounded-md border border-[#3b1212] bg-[#110707] px-2 py-1 text-xs"
              onClick={() => setLang(lang === "en" ? "ka" : "en")}
            >
              {lang.toUpperCase()}
            </button>
            <button className="rounded-md border border-[#3b1212] bg-[#110707] p-1.5" onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

