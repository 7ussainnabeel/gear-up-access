
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useAssets } from "@/context/AssetContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Computer, Car, Smartphone, Phone, Mail, FileText } from "lucide-react";

const UserDashboard = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { assets, assetRequests, consentForms, loading: assetsLoading } = useAssets();

  if (authLoading || assetsLoading) {
    return <div>Loading...</div>;
  }

  // Get user's assets
  const userAssets = assets.filter(asset => asset.assignedTo === currentUser?.id);
  
  // Get user's requests
  const userRequests = assetRequests.filter(
    request => request.userId === currentUser?.id
  );
  
  // Get pending consent forms
  const pendingForms = consentForms.filter(
    form => form.userId === currentUser?.id && form.sent && !form.signed
  );

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>

        {pendingForms.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-yellow-700" />
                  <p className="font-medium text-yellow-800">
                    You have {pendingForms.length} consent form{pendingForms.length > 1 ? 's' : ''} pending your signature
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href="/dashboard/consent-forms">View Forms</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Asset Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Assets</CardTitle>
                <Computer className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Assets currently assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              {userAssets.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No assets assigned
                </p>
              ) : (
                <div className="space-y-4">
                  {userAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        {asset.type === "company_car" ? (
                          <Car className="h-5 w-5 text-blue-500" />
                        ) : asset.type === "mobile" ? (
                          <Smartphone className="h-5 w-5 text-green-500" />
                        ) : asset.type === "ip_phone" ? (
                          <Phone className="h-5 w-5 text-purple-500" />
                        ) : asset.type === "email" ? (
                          <Mail className="h-5 w-5 text-red-500" />
                        ) : (
                          <Computer className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium capitalize">
                            {asset.type.replace("_", " ")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {asset.model}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        #{asset.serialNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="/dashboard/my-assets">View All Assets</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requests Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Status of your asset requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No requests found
                </p>
              ) : (
                <div className="space-y-4">
                  {userRequests.slice(0, 5).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium capitalize">
                          {request.assetType.replace("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
              <div className="mt-4 flex gap-2">
                <Button variant="default" size="sm" className="w-full" asChild>
                  <a href="/dashboard/request">New Request</a>
                </Button>
                {userRequests.length > 0 && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/dashboard/requests">View All</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quick Actions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild variant="outline" className="justify-start">
                <a href="/dashboard/request">
                  <Computer className="mr-2 h-4 w-4" />
                  Request New Asset
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <a href="/dashboard/request?type=replacement">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Replacement
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <a href="/dashboard/termination">
                  <FileText className="mr-2 h-4 w-4" />
                  Request Termination
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <a href="/dashboard/consent-forms">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  View Consent Forms
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const ClipboardCheck = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

export default UserDashboard;
