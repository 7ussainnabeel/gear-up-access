import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Car,
  Smartphone,
  Computer,
  FileText,
  ClipboardCheck,
  FileX,
  Settings,
  Columns2,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!currentUser) return null;

  const adminLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Asset Management",
      href: "/admin/assets",
      icon: Computer,
    },
    {
      name: "Consent Forms",
      href: "/admin/consent-forms",
      icon: ClipboardCheck,
    },
    {
      name: "Asset Requests",
      href: "/admin/requests",
      icon: FileText,
    },
    {
      name: "Terminations",
      href: "/admin/terminations",
      icon: FileX,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: "Admin/Management Hub",
      href: "/admin-management",
      icon: Columns2,
    },
  ];

  const userLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Assets",
      href: "/dashboard/my-assets",
      icon: Computer,
    },
    {
      name: "Request Asset",
      href: "/dashboard/request",
      icon: FileText,
    },
    {
      name: "Consent Forms",
      href: "/dashboard/consent-forms",
      icon: ClipboardCheck,
    },
    {
      name: "Termination",
      href: "/dashboard/termination",
      icon: FileX,
    },
  ];

  const managementLinks = [
    {
      name: "Dashboard",
      href: "/management",
      icon: LayoutDashboard,
    },
    {
      name: "Approval Requests",
      href: "/management/approvals",
      icon: ClipboardCheck,
    },
    {
      name: "User Assets",
      href: "/management/assets",
      icon: Computer,
    },
    {
      name: "Terminations",
      href: "/management/terminations",
      icon: FileX,
    },
    {
      name: "Admin/Management Hub",
      href: "/admin-management",
      icon: Columns2,
    },
  ];

  const itLinks = [
    {
      name: "Dashboard",
      href: "/it-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Email Requests",
      href: "/it-dashboard#email-requests",
      icon: Mail,
    },
    {
      name: "Device Requests",
      href: "/it-dashboard#device-requests",
      icon: Computer,
    },
    {
      name: "Asset Management",
      href: "/it-dashboard#asset-management",
      icon: Smartphone,
    },
  ];

  const supportLinks = [
    {
      name: "Dashboard",
      href: "/support-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Asset Lookup",
      href: "/support-dashboard#asset-lookup",
      icon: Computer,
    },
  ];

  const links = {
    admin: adminLinks,
    user: userLinks,
    management: managementLinks,
    it: itLinks,
    support: supportLinks,
  };

  return (
    <aside
      className={cn(
        "bg-gray-50 overflow-y-auto border-r border-gray-200 h-screen pt-16",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="px-3 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 w-full flex justify-center"
        >
          {collapsed ? ">" : "<"}
        </Button>

        <ul className="space-y-2">
          {links[currentUser.role].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <link.icon className={`w-6 h-6 text-gray-500 transition duration-75 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>{link.name}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
