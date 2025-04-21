
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ItDashboard = () => (
  <DashboardLayout requiredRole="it">
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>IT Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome to the IT dashboard. Here, IT team members will see email and device requests, and share credentials as needed.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default ItDashboard;
