"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  urls: string[];
  title: string;
};

export default function PhotoGallery({ urls, title }: Props) {
  const [active, setActive] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
        No photos available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <Image
          src={urls[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority={active === 0}
        />
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                i === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
