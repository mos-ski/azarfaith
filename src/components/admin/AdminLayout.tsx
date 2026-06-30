import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useApp } from "@/lib/store";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const { authed, adminRole } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authed || adminRole !== "platform_admin") {
      navigate({ to: "/login" });
    }
  }, [authed, adminRole, navigate]);

  if (!authed || adminRole !== "platform_admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="pl-60">
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden">
            <AdminSidebar />
          </div>
        </>
      )}
    </div>
  );
}

export function AdminPageWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminHeader title={title} />
      <div className="p-6">{children}</div>
    </div>
  );
}
