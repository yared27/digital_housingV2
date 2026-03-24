"use client";
import React from "react";

export default function PropertyGallery({ images }: { images?: string[] }) {
  if (!images || images.length === 0) return <div className="text-sm text-muted-foreground">No images</div>;
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt={`img-${idx}`} className="w-full h-40 object-cover rounded" />
      ))}
    </div>
  );
}
