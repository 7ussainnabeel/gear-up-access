
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";

// Sample notifications - in a real app, these would come from your backend
const initialNotifications = [
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
  },
  {
    id: 4,
    title: "Password Expiry",
    message: "Your password will expire in 7 days. Please update it.",
    time: "3 days ago",
    read: true
  },
  {
    id: 5,
    title: "New Policy",
    message: "New BYOD policy has been published. Please review and sign.",
    time: "5 days ago",
    read: true
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              Manage your notifications and alerts
            </p>
          </div>
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="flex space-x-2 pb-4">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button 
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
          >
            Read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              You have {notifications.filter(n => !n.read).length} unread notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-10 w-10 text-muted-foreground opacity-20" />
                <p className="mt-2 text-muted-foreground">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border rounded-md ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{notification.message}</p>
                    {!notification.read && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
