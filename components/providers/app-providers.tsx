"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
}>({ user: null, setUser: () => undefined });

export function AppProviders({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const loadSessionUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          if (isMounted) setUser(null);
          return;
        }
        const data = (await res.json()) as AuthUser | { user: AuthUser | null };
        const nextUser = "user" in data ? data.user : data;
        if (isMounted) setUser(nextUser ?? null);
      } catch {
        if (isMounted) setUser(null);
      }
    };

    loadSessionUser();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <AuthContext.Provider value={{ user, setUser }}>
      <UiContext.Provider value={uiValue}>
        <SiteLayout>{children}</SiteLayout>
      </UiContext.Provider>
    </AuthContext.Provider>
  );
}

export const useUi = () => useContext(UiContext);
export const useAuth = () => useContext(AuthContext);
