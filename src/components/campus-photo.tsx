import { useState } from "react";
import type { CampusPhoto } from "@/lib/campus-photos";
import { cn } from "@/lib/utils";

/** A real campus photograph, with a readable fallback when Wikimedia is unreachable. */
export function CampusImage({
  photo,
  className,
  priority = false,
  decorative = false,
}: {
  photo: CampusPhoto;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div role={decorative ? undefined : "img"} aria-label={decorative ? undefined : photo.alt}
        className={cn("grid min-h-24 place-items-center bg-navy p-4 text-center text-sm font-semibold text-paper", className)}>
        <span aria-hidden="true">{photo.title}</span>
      </div>
    );
  }
  return (
    <img src={photo.src} alt={decorative ? "" : photo.alt}
      width={960} height={640}
      loading={priority ? "eager" : "lazy"} decoding="async"
      onError={() => setFailed(true)}
      className={cn("block h-full w-full object-cover", className)}
    />
  );
}

/** Keep credits visible wherever an open-licensed photo appears. */
export function CampusPhotoCredit({ photo, className }: { photo: CampusPhoto; className?: string }) {
  return (
    <span className={cn("text-xs leading-relaxed", className)}>
      Photo: <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80">{photo.author}</a>
      {" · "}
      <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80">{photo.license}</a>
      {" · responsive crop"}
    </span>
  );
}
