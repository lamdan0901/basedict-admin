import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="grid grid-rows-[56px_1fr] flex-1">
        <Header />
        <main className="p-4 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
