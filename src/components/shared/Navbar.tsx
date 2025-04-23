
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";
import { User, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Map roles to their dashboard URLs
const roleDashboardMap: Record<UserRole, string> = {
  admin: "/admin",
  user: "/dashboard",
  management: "/management",
  it: "/it-dashboard",
};

// Sample notifications - in a real app, these would come from your backend
const sampleNotifications = [
  {
    id: 1,
    title: "New Asset Request",
    message: "You have a new asset request awaiting approval",
    time: "10 minutes ago",
    read: false
  },
  {
    id: 2,
    title: "Consent Form",
    message: "New consent form ready for signature",
    time: "2 hours ago",
    read: false
  },
  {
    id: 3,
    title: "System Update",
    message: "System maintenance scheduled for tomorrow",
    time: "1 day ago",
    read: true
  }
];

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const navigate = useNavigate();

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              AssetManager
            </span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-2 font-medium border-b">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} onClick={() => markAsRead(notification.id)}>
                    <DropdownMenuItem className="cursor-pointer p-0">
                      <div 
                        className={`p-3 w-full ${notification.read ? '' : 'bg-blue-50'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))
              )}
              <div className="p-2 border-t text-center">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <a href="/notifications">View all notifications</a>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={roleDashboardMap[currentUser.role]}>Dashboard</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/profile">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
