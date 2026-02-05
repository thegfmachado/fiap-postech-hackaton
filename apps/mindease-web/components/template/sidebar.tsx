"use client"

import { Kanban, Timer, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";

import { Button } from "@mindease/design-system/components";

const sidebarItems = [
  {
    href: "/home",
    label: "Quadro",
    icon: Kanban
  },
  {
    href: "/pomodoro",
    label: "Pomodoro",
    icon: Timer
  },
  {
    href: "/settings",
    label: "Configurações",
    icon: Settings
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex grow max-w-[228px] shadow-lg flex-col bg-white z-10 h-full md:row-start-2 md:col-start-1">
      <nav className="flex-1 p-4">
        {sidebarItems.map(({ href, label, icon: Icon }) => (
          <Link href={href} key={href}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${pathname === href ? "text-primary" : "text-foreground"}`}
            >
              <span className="pl-5 flex items-center">
                <Icon className="mr-2 h-5 w-5" />
                {label}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
