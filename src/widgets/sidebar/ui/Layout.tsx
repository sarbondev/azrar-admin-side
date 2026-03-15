import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "@/widgets/header/ui/Header";

export const Layout = () => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);
