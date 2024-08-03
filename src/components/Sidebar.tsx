"use client";

import { useState } from "react";
import { deleteTokenServer, logout } from "@/service/auth";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Album,
  CircleUserRound,
  House,
  LogOut,
  Menu,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const router = useRouter();
  const { clearProfile, profile } = useAppStore();
  const [isSidebarOpen, toggleSidebar] = useState(true);

  return (
    <aside
      className={`h-full shrink-0 bg-gray-100 relative shadow-lg ${
        isSidebarOpen ? "w-64" : "w-16"
      } overflow-hidden transition-width duration-300`}
    >
      <div className="flex justify-end">
        <Button
          className="mt-2 w-16 mb-4"
          variant={"ghost"}
          onClick={() => toggleSidebar(!isSidebarOpen)}
        >
          <Menu className="h-7 w-7" />
        </Button>
      </div>

      <div className={cn("px-4", isSidebarOpen ? "block" : "hidden")}>
        <p>Today is {new Date().toLocaleDateString()}</p>
        <p>{profile?.email}</p>
      </div>

      <nav className="flex flex-col mt-4">
        <Link
          href="/"
          className={cn(
            "p-4 gap-2 flex items-center hover:bg-gray-200",
            !isSidebarOpen ? "justify-center" : ""
          )}
        >
          <House />
          <span className={cn(isSidebarOpen ? "inline" : "hidden")}>Home</span>
        </Link>
        <Link
          href="/lexeme-list"
          className={cn(
            "p-4 gap-2 flex items-center hover:bg-gray-200",
            !isSidebarOpen ? "justify-center" : ""
          )}
        >
          <Store />
          <span className={cn(isSidebarOpen ? "inline" : "hidden")}>
            Lexeme list
          </span>
        </Link>
        <Link
          href="/account-list"
          className={cn(
            "p-4 gap-2 flex items-center hover:bg-gray-200",
            !isSidebarOpen ? "justify-center" : ""
          )}
        >
          <CircleUserRound />
          <span className={cn(isSidebarOpen ? "inline" : "hidden")}>
            Account list
          </span>
        </Link>
        <Link
          href="/report-list"
          className={cn(
            "p-4 gap-2 flex items-center hover:bg-gray-200",
            !isSidebarOpen ? "justify-center" : ""
          )}
        >
          <Album />
          <span className={cn(isSidebarOpen ? "inline" : "hidden")}>
            Report list
          </span>
        </Link>
      </nav>
      <Button
        variant={"destructive"}
        onClick={async () => {
          await logout();
          await deleteTokenServer();
          clearProfile();
          router.push("/login");
        }}
        className={cn(
          "absolute bottom-4 duration-300 py-2 transition-all rounded-full -translate-x-1/2 left-1/2 p-2",
          isSidebarOpen ? "!px-8" : ""
        )}
      >
        {isSidebarOpen ? <span>Logout</span> : <LogOut />}
      </Button>
    </aside>
  );
};

export default Sidebar;
