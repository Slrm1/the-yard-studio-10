import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/brand";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "emergency — The Yard Studio" }, { name: "description", content: "The Yard Studio emergency screen (demo)." }, { property: "og:title", content: "emergency" }, { property: "og:description", content: "The Yard Studio demo screen." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="In progress" title="emergency">This screen is still being built. <Link to="/" className="text-cardinal underline">Back to The Yard</Link></PageHeader>
    </div>
  );
}
