import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/brand";

export const Route = createFileRoute("/studios")({
  head: () => ({ meta: [{ title: "studios — The Yard Studio" }, { name: "description", content: "The Yard Studio studios screen (demo)." }, { property: "og:title", content: "studios" }, { property: "og:description", content: "The Yard Studio demo screen." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="In progress" title="studios">This screen is still being built. <Link to="/" className="text-cardinal underline">Back to The Yard</Link></PageHeader>
    </div>
  );
}
