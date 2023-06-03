import { Button } from "@/components/ui/button";
import { useAuthenticationStatus, useSignOut, useUserData } from "@nhost/react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, MoreVerticalIcon } from "lucide-react";
import { useUserDisplayName } from "@nhost/react";

export default function Navbar() {
  const router = useRouter();

  const navLinkStyling = (route: string) => {
    return router.pathname === route ? "underline" : "";
  };

  const { isLoading, isAuthenticated } = useAuthenticationStatus();
  const { signOut, isSuccess: signOutSuccess } = useSignOut();

  const userName = useUserDisplayName();
  const user = useUserData();

  if (signOutSuccess) {
    router.route.startsWith("/admin")
      ? router.push("/admin")
      : router.push("/");
  }

  return (
    <header className="px-2 shadow-md lg:px-3 xl:px-0">
      <div className="flex items-center justify-between max-w-6xl py-4 mx-auto ">
        <h1 className="text-lg font-bold">Student Complaint Portal</h1>
        <nav className="flex space-x-6">
          {isAuthenticated && router.route !== "/admin" ? (
            <ul className="hidden sm:flex">
              <li>
                <Button variant="link" asChild className={navLinkStyling("/")}>
                  <Link href="/">All Complaints</Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  asChild
                  className={navLinkStyling("/my-complaints")}
                >
                  <Link href="/my-complaints">My Complaints</Link>
                </Button>
              </li>
            </ul>
          ) : (
            <></>
          )}

          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Hi,&nbsp;{user?.displayName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={signOut}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="p-2 h-fit">
                      <MoreVerticalIcon size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Hi,&nbsp;{userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/">All Complaints</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/my-complaints">My Complaints</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={signOut}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <div>
              <ul className="hidden space-x-3 md:flex">
                <li>
                  <Button variant="outline" className="px-6 py-3 ">
                    <Link href="/sign-in"> Sign In</Link>
                  </Button>
                </li>
                <li>
                  <Button className="px-6 py-3 ">
                    <Link href="/sign-up"> Sign Up</Link>
                  </Button>
                </li>
                <li>
                  <Button className="px-6 py-3 ">
                    <Link href="/admin/sign-in"> Admin Login</Link>
                  </Button>
                </li>
              </ul>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="p-2 h-fit">
                    <MoreVerticalIcon size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/sign-in"> Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/sign-up"> Sign Up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/admin/sign-in"> Admin Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
