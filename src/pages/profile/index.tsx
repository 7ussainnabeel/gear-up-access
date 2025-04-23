
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { currentUser, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast({
        title: "Password Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // This would connect to your backend API
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: password.current,
          newPassword: password.new,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        });
        setPassword({ current: "", new: "", confirm: "" });
        setIsEditing(false);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={currentUser.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={currentUser.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={currentUser.role} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={password.current}
                      onChange={(e) =>
                        setPassword({ ...password, current: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={password.new}
                      onChange={(e) =>
                        setPassword({ ...password, new: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={password.confirm}
                      onChange={(e) =>
                        setPassword({ ...password, confirm: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Update Password</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setPassword({ current: "", new: "", confirm: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Change Password</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
