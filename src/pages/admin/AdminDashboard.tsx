
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssets } from "@/context/AssetContext";
import { Users, Computer, ClipboardCheck, FileText, FileX } from "lucide-react";

const AdminDashboard = () => {
  const { assets, assetRequests, consentForms, terminationRequests } = useAssets();

  // Calculate stats
  const pendingRequests = assetRequests.filter(req => req.status === 'pending').length;
  const pendingConsentForms = consentForms.filter(form => form.sent && !form.signed).length;
  const pendingTerminations = terminationRequests ? terminationRequests.filter(term => term.status === 'pending').length : 0;

  const statCards = [
    {
      title: "Total Assets",
      value: assets.length,
      description: "Managed assets in system",
      icon: Computer,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      description: "Asset requests awaiting approval",
      icon: FileText,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      title: "Pending Forms",
      value: pendingConsentForms,
      description: "Consent forms awaiting signatures",
      icon: ClipboardCheck,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Pending Terminations",
      value: pendingTerminations,
      description: "Termination requests to process",
      icon: FileX,
      color: "bg-red-50 text-red-700",
    },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage assets, users, and requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Asset Requests</CardTitle>
              <CardDescription>
                Latest requests submitted by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assetRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No requests found
                </p>
              ) : (
                <div className="space-y-4">
                  {assetRequests
                    .slice(0, 5)
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {request.assetType.replace("_", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consent Forms Status</CardTitle>
              <CardDescription>
                Forms pending signatures and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {consentForms.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No consent forms found
                </p>
              ) : (
                <div className="space-y-4">
                  {consentForms
                    .slice(0, 5)
                    .map((form) => (
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
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${
                            !form.sent
                              ? "bg-gray-100 text-gray-800"
                              : !form.signed
                              ? "bg-yellow-100 text-yellow-800"
                              : form.adminApproved && form.managementApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {!form.sent
                            ? "Not Sent"
                            : !form.signed
                            ? "Awaiting Signature"
                            : form.adminApproved && form.managementApproved
                            ? "Fully Approved"
                            : "Partially Approved"}
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

export default AdminDashboard;
