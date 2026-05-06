import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapPlayerRow } from "@/lib/data/players";

const tierValues = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"] as const;

const schema = z.object({
  username: z.string().min(2),
  region: z.string().optional(),
  description: z.string().min(3),
  tier: z.enum(tierValues),
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, username, tier, region, description")
    .order("username", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(mapPlayerRow));
}

export async function POST(req: Request) {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("players")
    .insert({
      username: parsed.data.username,
      region: parsed.data.region || null,
      description: parsed.data.description,
      tier: parsed.data.tier,
    })
    .select("id, username, tier, region, description")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapPlayerRow(data));
}
