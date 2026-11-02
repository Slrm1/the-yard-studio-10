import { Link } from "@tanstack/react-router";
import type { Project } from "@/lib/model";
import { DemoBadge } from "./brand";
import { cn } from "@/lib/utils";

const VARIANTS = [
  "bg-navy text-paper",
  "bg-cardinal text-paper",
  "bg-cream text-navy",
  "bg-ink text-gold",
];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function ProjectTile({ project, className }: { project: Project; className?: string }) {
  const v = VARIANTS[hash(project.id) % VARIANTS.length];
  const words = project.name.split(" ");
  return (
    <Link
      to="/editor"
      search={{ id: project.id }}
      className={cn("group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-md border-2 border-ink p-5 shadow-block transition-transform hover:-translate-y-1 focus-visible:-translate-y-1", v, className)}
      aria-label={`Open ${project.name} in the editor`}
    >
      <span aria-hidden className="font-display pointer-events-none absolute -right-4 -top-6 text-[9rem] opacity-15">
        {project.name[0]}
      </span>
      <div className="relative flex items-center justify-between">
        <DemoBadge />
        <span className="eyebrow opacity-80">{project.tags[0]}</span>
      </div>
      <h3 className="font-display relative text-4xl leading-[0.85]">
        {words.slice(0, 2).join(" ")}
        {words.length > 2 && <span className="block opacity-70">{words.slice(2).join(" ")}</span>}
      </h3>
      <p className="relative text-xs opacity-80">{project.seekingCollaborators ?? "Open in editor →"}</p>
    </Link>
  );
}
