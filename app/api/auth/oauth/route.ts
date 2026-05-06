import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const provider = searchParams.get("provider");

  if (provider !== "google" && provider !== "discord") {
    return NextResponse.json({ error: "unsupported_provider" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return NextResponse.json({ error: error?.message ?? "oauth_failed" }, { status: 400 });
  }

  return NextResponse.redirect(data.url);
}
