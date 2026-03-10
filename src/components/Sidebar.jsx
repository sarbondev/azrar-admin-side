import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, FolderOpen, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t("sidebar.dashboard"),    href: "/dashboard",    icon: LayoutDashboard },
    { name: t("sidebar.products"),     href: "/products",     icon: Package },
    { name: t("sidebar.categories"),   href: "/categories",   icon: Tag },
    { name: t("sidebar.orders"),       href: "/orders",       icon: ShoppingCart },
    { name: t("sidebar.projects"),     href: "/projects",     icon: FolderOpen },
    { name: t("sidebar.testimonials"), href: "/testimonials", icon: MessageSquare },
    { name: t("sidebar.admins"),       href: "/admins",       icon: Users },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow bg-white overflow-y-auto border-r p-2">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-blue-500" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
