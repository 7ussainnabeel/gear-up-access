
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminManagementHub = () => {
  return (
    <DashboardLayout requiredRole={["admin", "management"]}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Admin &amp; Management Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome! This page is accessible to both Admin and Management users. 
              You can use this page as a central place for collaborative actions, shared reports, or special tools.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminManagementHub;
