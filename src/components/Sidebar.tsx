"use client";

import { useState } from "react";
import { deleteTokenServer, logout } from "@/service/auth";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Album, CircleUserRound, House, Menu, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const router = useRouter();
  const { clearProfile, profile } = useAppStore();
  const [isSidebarOpen, toggleSidebar] = useState(true);

  return (
    <aside
      className={`h-full shrink-0 bg-gray-100 shadow-lg ${
        isSidebarOpen ? "w-64" : "w-20"
      } overflow-hidden transition-width duration-300`}
    >
      <div className="p-4">
        <Button
          variant={"outline"}
          onClick={() => toggleSidebar(!isSidebarOpen)}
        >
          <Menu />
        </Button>
        <p>Today is {new Date().toLocaleDateString()}</p>
        <p>{profile?.email}</p>
      </div>
      <nav className="flex flex-col mt-4">
        <Link
          href="/"
          className="p-4 gap-2 flex items-center hover:bg-gray-200"
        >
          <House /> Home
        </Link>
        <Link
          href="/lexeme-list"
          className="p-4 gap-2 flex items-center hover:bg-gray-200"
        >
          <Store /> Lexeme list
        </Link>
        <Link
          href="/account-list"
          className="p-4 gap-2 flex items-center hover:bg-gray-200"
        >
          <CircleUserRound /> Account list
        </Link>
        <Link
          href="/report-list"
          className="p-4 gap-2 flex items-center hover:bg-gray-200"
        >
          <Album /> Report list
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
        className="absolute bottom-4 left-4 p-2"
      >
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
