import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home, Building2, PenTool, Library, MessagesSquare, CalendarDays, ClipboardCheck,
  IdCard, ListChecks, ShieldAlert, Map, Bot, Menu, Settings,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { YMark } from "./brand";
import { useAppState, actions } from "@/lib/store";
import { ROLES, type Role } from "@/lib/model";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/announce";

const NAV = [
  { to: "/", label: "The Yard", icon: Home },
  { to: "/studios", label: "Org Studios", icon: Building2 },
  { to: "/editor", label: "Design Editor", icon: PenTool },
  { to: "/library", label: "Founders Library", icon: Library },
  { to: "/lounge", label: "Blackburn Lounge", icon: MessagesSquare },
  { to: "/seasonal", label: "Seasonal Spaces", icon: CalendarDays },
  { to: "/reviews", label: "Review Queue", icon: ClipboardCheck },
  { to: "/profile", label: "My Bison Card", icon: IdCard },
  { to: "/usability", label: "Usability Test", icon: ListChecks },
  { to: "/settings", label: "Accessibility Settings", icon: Settings },
] as const;

const SAFETY = [
  { to: "/emergency", label: "Emergency Mode", icon: ShieldAlert },
  { to: "/map", label: "Area Map", icon: Map },
  { to: "/robots", label: "Robot Simulator", icon: Bot },
] as const;

function RoleSwitch() {
  const { role } = useAppState();
  return (
    <div>
      <label htmlFor="role-switch" className="eyebrow text-paper/60">Demo role</label>
      <Select value={role} onValueChange={(v) => { actions.setRole(v as Role); notify.success(`Role switched to ${ROLES.find((r) => r.id === v)?.label ?? v}`); }}>
        <SelectTrigger id="role-switch" className="mt-1 h-9 border-paper/25 bg-paper/5 text-paper">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <nav aria-label="Studio" className="flex flex-1 flex-col gap-6 overflow-y-auto">
      <ul className="space-y-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={onNavigate}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-paper/75 hover:bg-paper/10 hover:text-paper",
                isActive(to) && "bg-paper/10 text-paper shadow-[inset_3px_0_0_var(--cardinal)]",
              )}
              aria-current={isActive(to) ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <p className="eyebrow mb-2 px-3 text-alert">Preparedness demo</p>
        <ul className="space-y-1 rounded-md border-2 border-alert p-1">
          {SAFETY.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-10 items-center gap-3 rounded px-3 text-sm font-bold text-alert hover:bg-alert hover:text-alert-ink",
                  isActive(to) && "bg-alert text-alert-ink",
                )}
                aria-current={isActive(to) ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-navy-deep p-4 text-paper">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <YMark />
        <span className="leading-none">
          <span className="font-display block text-xl">The Yard Studio</span>
          <span className="eyebrow text-paper/60">Bison Built. Yard Born.</span>
        </span>
      </Link>
      <NavList onNavigate={onNavigate} />
      <RoleSwitch />
      <p className="text-[11px] leading-snug text-paper/50">
        Independent student HCI project. Not affiliated with or endorsed by Howard University. All data stays in this browser.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-paper focus:p-2">Skip to content</a>
      <aside className="sticky top-0 hidden h-dvh lg:block">
        <SidebarBody />
      </aside>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 bg-navy-deep px-3 py-2 text-paper lg:hidden">
        <button type="button" onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-paper/10" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex min-w-0 items-center gap-2"><YMark className="h-8 w-8 shrink-0" /><span className="font-display truncate text-lg">The Yard Studio</span></Link>
        <div className="flex shrink-0 items-center gap-1">
        <Link to="/settings" className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-paper/10" aria-label="Accessibility settings"><Settings className="h-5 w-5" aria-hidden /></Link>
        <Link to="/emergency" className="flex min-h-11 items-center gap-1 rounded-md border-2 border-alert px-2 text-xs font-bold uppercase text-alert" aria-label="Emergency Mode (preparedness demo)">
          <ShieldAlert className="h-4 w-4" aria-hidden /> Prep
        </Link>
        </div>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-none p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Studio sections and preparedness demo</SheetDescription>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <main id="main" className="min-w-0 px-4 py-6 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
