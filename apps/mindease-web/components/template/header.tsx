"use client";

import { Kanban, Timer, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@mindease/design-system/components";
import { HTTPService } from "@mindease/services";
import { AuthService } from "@/client/services/auth-service";

const navLinks = [
  { href: "/home", label: "Quadro", Icon: Kanban },
  { href: "/pomodoro", label: "Pomodoro", Icon: Timer },
];

const httpService = new HTTPService();
const authService = new AuthService(httpService);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const onSignOut = async () => {
    setUserMenuOpen(false);
    await authService.signOut();
    router.push("/");
  };

  return (
    <header className="p-4 shadow-lg bg-white z-20 md:fixed w-full md:col-span-2">
      <div className="flex justify-between items-center">
        {/* Logo Desktop */}
        <Link href="/home" className="hidden sm:flex items-center gap-2">
          <Kanban className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">MindEase</span>
        </Link>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Logo Mobile */}
        <Link href="/home" className="flex items-center gap-2 sm:hidden">
          <Kanban className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">MindEase</span>
        </Link>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Menu do usuário</span>
          </Button>

          {userMenuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                <div className="p-2 border-b">
                  <p className="text-sm font-medium">Minha conta</p>
                </div>
                <button
                  onClick={onSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="sm:hidden mt-4 pb-4 border-t pt-4" aria-label="Menu principal">
          <div className="flex flex-col gap-4">
            {navLinks.map(({ href, label, Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 p-2 rounded-md ${isActive
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:bg-muted"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
