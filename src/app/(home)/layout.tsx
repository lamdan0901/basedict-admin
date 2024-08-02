import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
