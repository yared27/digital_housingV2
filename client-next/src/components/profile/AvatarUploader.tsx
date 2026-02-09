"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, BadgeCheck, MapPin } from "lucide-react";
import { uploadWithSignature } from "@/lib/cloudinary";
import { useUpdateMeMutation } from "@/store/api";

type Location = { city?: string; country?: string };
type Props = {
  currentUrl?: string;
  displayName?: string;
  location?: Location | null;
  isVerified?: boolean;
  timezone?: string | null; // e.g., "Africa/Addis_Ababa"
  verifyHref?: string; // e.g., "/settings/verify"
};

export default function AvatarUploader({
  currentUrl,
  displayName,
  location,
  isVerified,
  timezone,
  verifyHref = "/settings/verify",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [updateMe] = useUpdateMeMutation();

  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const onPick = () => inputRef.current?.click();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadWithSignature(file);
      setPreview(url);
      await updateMe({ avatar: url } as any).unwrap();
    } finally {
      setUploading(false);
    }
  };

  const timeStr = formatLocalTime(timezone || undefined);
  const city = location?.city;
  const country = location?.country;

  return (
    <div className="flex items-center gap-4">
      {/* Avatar + overlays */}
      <div className="relative">
        <div className="h-16 w-16 overflow-hidden rounded-full border">
          {preview ? (
            <Image src={preview} alt="avatar" width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center bg-slate-100 text-slate-400">?</div>
          )}
        </div>

        {/* Online/status dot */}
        <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />

        {/* Edit (camera) button */}
        <button
          onClick={onPick}
          className="absolute -bottom-1 -left-1 rounded-full bg-emerald-600 p-1 text-white shadow hover:bg-emerald-700"
          title="Change avatar"
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
        </button>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      </div>

      {/* Name, verification, location + local time */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-black">{displayName ?? "—"}</h2>
          {isVerified ? (
            <span title="Verified">
              <BadgeCheck className="h-4 w-4 font-bold text-blue-500" />
            </span>
          ) : (
            <a
              href={verifyHref}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              title="Verify identity"
            >
              Verify identity
            </a>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm text-black">
          <MapPin className="h-4 w-4" />
          <span className="truncate">
            {city && country ? `${city}, ${country}` : country || city || ""}
            {timeStr ? ` — ${timeStr} local time` : ""}
          </span>
        </div>

        {uploading && <p className="mt-1 text-xs text-slate-400">Uploading…</p>}
      </div>
    </div>
  );
}

function formatLocalTime(tz?: string): string | null {
  try {
    const opts: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    const now = new Date();
    return new Intl.DateTimeFormat(undefined, opts).format(now);
  } catch {
    return null;
  }
}