"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadWithSignature } from "@/lib/cloudinary";
import { useUpdateMeMutation } from "@/store/api";
import { Camera } from "lucide-react";
import AvatarUploader from "./AvatarUploader";

type Props = {
  currentUrl?: string;
  user?: {
    fullName?: string;
    name?: string;
    address?: {
      city?: string;
      country?: string;
    };
    isVerified?: boolean;
    timezone?: string;
  };
};

export default function ProfileSummary({ currentUrl, user }: Props) {
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

  return (
    <div className="relative">
      {/* <div className="h-16 w-16 overflow-hidden rounded-full border">
        {preview ? (
          <Image src={preview} alt="avatar" width={64} height={64} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center bg-slate-100 text-slate-400">?</div>
        )}
      </div> */}
       <section className="rounded-xl border bg-white p-4 md:p-6">
      <div className="flex items-center justify-between">
        <AvatarUploader
          currentUrl={currentUrl}
          displayName={user?.fullName || user?.name}
          location={{ city: user?.address?.city, country: user?.address?.country }}
          isVerified={Boolean(user?.isVerified)}
          timezone={user?.timezone} // e.g., "Africa/Addis_Ababa"
          verifyHref="/settings/verify"
        />
      </div>
    </section>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
    </div>
  );
}