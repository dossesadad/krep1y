"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

function buildAvatarUrl(username: string) {
  const safe = encodeURIComponent(username.trim() || "MHF_Steve");
  return `https://crafatar.com/avatars/${safe}?size=64&overlay&default=MHF_Steve`;
}

const STEVE_FALLBACK = "https://crafatar.com/avatars/MHF_Steve?size=64&overlay";

export function MinecraftAvatar({ username, size = 32 }: { username: string; size?: number }) {
  const initialUrl = useMemo(() => buildAvatarUrl(username), [username]);
  const [src, setSrc] = useState(initialUrl);

  return (
    <Image
      src={src}
      alt={`${username} minecraft avatar`}
      width={size}
      height={size}
      className="rounded-md border border-[#334067] bg-[#273055] object-cover shadow-sm"
      onError={() => setSrc(STEVE_FALLBACK)}
      unoptimized
    />
  );
}
