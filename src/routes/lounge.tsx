import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/brand";

export const Route = createFileRoute("/lounge")({
  head: () => ({ meta: [{ title: "lounge — The Yard Studio" }, { name: "description", content: "The Yard Studio lounge screen (demo)." }, { property: "og:title", content: "lounge" }, { property: "og:description", content: "The Yard Studio demo screen." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="In progress" title="lounge">This screen is still being built. <Link to="/" className="text-cardinal underline">Back to The Yard</Link></PageHeader>
    </div>
  );
}
