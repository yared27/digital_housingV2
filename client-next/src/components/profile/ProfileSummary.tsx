"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadWithSignature } from "@/lib/cloudinary";
import { useUpdateMeMutation } from "@/store/api";
import { Camera } from "lucide-react";

export default function AvatarUploader({ currentUrl }: { currentUrl?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [updateMe] = useUpdateMeMutation();

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
      <div className="h-16 w-16 overflow-hidden rounded-full border">
        {preview ? (
          <Image src={preview} alt="avatar" width={64} height={64} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center bg-slate-100 text-slate-400">?</div>
        )}
      </div>
      <button
        onClick={onPick}
        className="absolute -bottom-1 -left-1 rounded-full bg-emerald-600 p-1 text-white shadow hover:bg-emerald-700"
        title="Change avatar"
        disabled={uploading}
      >
        <Camera className="h-4 w-4" /> 
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
      {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
    </div>
  );
}