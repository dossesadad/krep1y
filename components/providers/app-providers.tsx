"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import en from "@/lib/i18n/en.json";
import ka from "@/lib/i18n/ka.json";
import { AuthUser } from "@/types";
import { SiteLayout } from "@/components/layout/site-layout";

type Lang = "en" | "ka";
type Theme = "dark" | "light";
const dictionary = { en, ka };

const UiContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof en) => string;
  theme: Theme;
  toggleTheme: () => void;
}>({
  lang: "en",
  setLang: () => undefined,
  t: (k) => k,
  theme: "dark",
  toggleTheme: () => undefined,
});

const AuthContext = createContext<{
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
}>({ user: null, setUser: () => undefined, refreshUser: async () => undefined });

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
        headers: { "cache-control": "no-store" },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as AuthUser | { user: AuthUser | null };
      const nextUser = "user" in data ? data.user : data;
      setUser(nextUser ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshUser();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, refreshUser]);

  useEffect(() => {
    const onFocus = () => {
      void refreshUser();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshUser]);

  const t = useCallback((key: keyof typeof en) => dictionary[lang][key] ?? key, [lang]);

  const uiValue = useMemo(
    () => ({
      lang,
      setLang,
      t,
      theme,
      toggleTheme: () => setTheme((v) => (v === "dark" ? "light" : "dark")),
    }),
    [lang, t, theme],
  );

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      <UiContext.Provider value={uiValue}>
        <SiteLayout>{children}</SiteLayout>
      </UiContext.Provider>
    </AuthContext.Provider>
  );
}

export const useUi = () => useContext(UiContext);
export const useAuth = () => useContext(AuthContext);
