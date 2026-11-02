import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/brand";

export const Route = createFileRoute("/robots")({
  head: () => ({ meta: [{ title: "robots — The Yard Studio" }, { name: "description", content: "The Yard Studio robots screen (demo)." }, { property: "og:title", content: "robots" }, { property: "og:description", content: "The Yard Studio demo screen." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="In progress" title="robots">This screen is still being built. <Link to="/" className="text-cardinal underline">Back to The Yard</Link></PageHeader>
    </div>
  );
}
