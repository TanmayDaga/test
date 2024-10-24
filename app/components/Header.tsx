"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toast } from "@/hooks/use-toast";
import { Logout } from "@/lib/apis/auth/Logout";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import useAuthContext from "@/hooks/custom/useAuthContext";
import Image from "next/image";

// Types

const NAVIGATION_ITEMS = [
  { label: "About Us", href: "/#about-us" },
  { label: "Features", href: "/#features" },
  { label: "Blogs", href: "/blogs" },
] as const;

const MOBILE_BREAKPOINT = 768;

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const axios = useAxiosContext();
  const auth = useAuthContext();

  const handleScroll = useCallback(() => {
    setIsSticky(window.scrollY > 0);
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  const handleLogout = useCallback(() => {
    Logout({
      axios,
      onSuccess: () => {
        auth.setConfig({
          loggedIn: false,
          id: "",
          email: "",
          voice: "",
        });
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        router.push("/");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to logout",
          variant: "destructive",
        });
      },
    });
  }, [axios, auth, router]);

  const DesktopNavigation = () => (
    <NavigationMenu>
      <NavigationMenuList>
        {NAVIGATION_ITEMS.map(({ label, href }) => (
          <NavigationMenuItem key={label}>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={pathname === href}
              >
                {label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4">
          {NAVIGATION_ITEMS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "text-lg font-medium transition-colors hover:text-primary",
                pathname === href && "text-primary"
              )}
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            {auth.config.loggedIn ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-2">
      {auth.config.loggedIn ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <>
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/signup")}>
            Sign up
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        "w-full bg-background/80 backdrop-blur-sm p-4 transition-all duration-300",
        isSticky && "sticky top-0 z-50 border-b"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/icons/logo.png"
            alt="Logo"
            width={32} // Since h-8 is 32px
            height={32} // Maintaining aspect ratio
            priority // Since it's a logo above the fold
            className="w-auto h-8 object-contain"
          />
        </Link>

        {isMobile ? (
          <MobileNavigation />
        ) : (
          <>
            <DesktopNavigation />
            <AuthButtons />
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
