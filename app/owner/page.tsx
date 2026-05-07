import Link from "next/link";

const OWNERS = ["Krep1y", "Orxanje"] as const;

export default function OwnerPage() {
  return (
    <main className="px-4 py-8">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-[#20294b] bg-[#0b122a] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Georgian Tier List</p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-zinc-100">Owners</h1>
        <p className="mt-2 text-sm text-zinc-400">Project owners listed below.</p>

        <div className="mt-6 grid gap-3">
          {OWNERS.map((owner) => (
            <div
              key={owner}
              className="rounded-xl border border-[#2a3155] bg-[#111935] px-4 py-3 text-lg font-semibold text-zinc-100"
            >
              {owner}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/" className="rounded-md border border-[#2a3155] bg-[#101938] px-3 py-1.5 text-sm text-zinc-200 hover:bg-[#162349]">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
