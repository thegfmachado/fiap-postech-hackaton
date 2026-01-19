"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@mindease/design-system/components";

export function Header() {
  return (
    <header className="p-4 shadow-lg bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center text-2xl font-bold text-primary">
            🧠 MindEase
          </a>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Sobre
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Serviços
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Valores
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:underline cursor-pointer">
                  Contato
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
}
