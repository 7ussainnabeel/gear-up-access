
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssets } from "@/context/AssetContext";
import { ClipboardCheck, FileText } from "lucide-react";

const ManagementDashboard = () => {
  const { assetRequests, consentForms } = useAssets();

  const pendingRequests = assetRequests.filter(req => req.status === 'pending');
  const pendingForms = consentForms.filter(form => !form.managementApproved);

  return (
    <DashboardLayout requiredRole="management">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Management Dashboard</h1>
          <p className="text-muted-foreground">
            Review and approve asset requests and consent forms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Requests</CardTitle>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No pending requests
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {request.assetType.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Pending
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consent Forms</CardTitle>
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              {pendingForms.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No pending forms
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingForms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">Asset #{form.assetId}</p>
                        <p className="text-sm text-muted-foreground">
                          User ID: {form.userId}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Needs Review
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
