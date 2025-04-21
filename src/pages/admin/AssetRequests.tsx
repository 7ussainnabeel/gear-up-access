
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAssets } from "@/context/AssetContext";
import { AssetRequest, MOCK_USERS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Check, X, FileText, Car, Smartphone, Computer, Laptop, Phone, Mail } from "lucide-react";

const AssetRequests = () => {
  const { toast } = useToast();
  const { assetRequests, approveAssetRequest, rejectAssetRequest } = useAssets();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [notes, setNotes] = useState("");

  const handleActionClick = (request: AssetRequest, approving: boolean) => {
    setSelectedRequest(request);
    setIsApproving(approving);
    setNotes("");
    setShowDialog(true);
  };

  const handleSubmit = () => {
    if (!selectedRequest) return;

    if (isApproving) {
      approveAssetRequest(selectedRequest.id, notes);
      toast({
        title: "Request Approved",
        description: "The asset request has been approved successfully",
      });
    } else {
      if (!notes) {
        toast({
          title: "Notes Required",
          description: "Please provide a reason for rejection",
          variant: "destructive",
        });
        return;
      }
      
      rejectAssetRequest(selectedRequest.id, notes);
      toast({
        title: "Request Rejected",
        description: "The asset request has been rejected",
      });
    }

    setShowDialog(false);
  };

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = MOCK_USERS.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Get appropriate icon based on asset type
  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'company_car':
        return <Car className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'computer':
        return <Computer className="h-4 w-4" />;
      case 'laptop':
        return <Laptop className="h-4 w-4" />;
      case 'ip_phone':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const pendingRequests = assetRequests.filter(request => request.status === 'pending');
  const approvedRequests = assetRequests.filter(request => request.status === 'approved');
  const rejectedRequests = assetRequests.filter(request => request.status === 'rejected');

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Asset Requests</h1>
          <p className="text-muted-foreground">
            Manage and review asset requests from users
          </p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending requests found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Asset Type</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {getUserName(request.userId)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getAssetIcon(request.assetType)}
                              <span className="capitalize">
                                {request.assetType.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.requestDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.isReplacement 
                                ? "bg-orange-100 text-orange-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {request.isReplacement ? 'Replacement' : 'New'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {request.requestDetails}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 hover:bg-green-100 text-green-700"
                              onClick={() => handleActionClick(request, true)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-700"
                              onClick={() => handleActionClick(request, false)}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedRequests.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No approved requests found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Asset Type</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {getUserName(request.userId)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getAssetIcon(request.assetType)}
                              <span className="capitalize">
                                {request.assetType.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.requestDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.isReplacement 
                                ? "bg-orange-100 text-orange-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {request.isReplacement ? 'Replacement' : 'New'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {request.notes || "No notes provided"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {rejectedRequests.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No rejected requests found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Requester</TableHead>
                        <TableHead>Asset Type</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rejection Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {getUserName(request.userId)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getAssetIcon(request.assetType)}
                              <span className="capitalize">
                                {request.assetType.replace('_', ' ')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(request.requestDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              request.isReplacement 
                                ? "bg-orange-100 text-orange-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {request.isReplacement ? 'Replacement' : 'New'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            {request.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isApproving ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {isApproving
                ? "Add optional notes for this approval"
                : "Please provide a reason for rejection"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                {selectedRequest && getAssetIcon(selectedRequest.assetType)}
                <p className="font-medium capitalize">
                  {selectedRequest?.assetType.replace('_', ' ')}
                </p>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                  selectedRequest?.isReplacement 
                    ? "bg-orange-100 text-orange-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {selectedRequest?.isReplacement ? 'Replacement' : 'New'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Requester:</strong>{" "}
                {selectedRequest ? getUserName(selectedRequest.userId) : ""}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Details:</strong> {selectedRequest?.requestDetails}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                {isApproving ? "Approval Notes (Optional)" : "Rejection Reason"}
              </label>
              <Textarea
                id="notes"
                placeholder={
                  isApproving
                    ? "Add any additional notes for this approval"
                    : "Provide a reason for rejecting this request"
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant={isApproving ? "default" : "destructive"}
              onClick={handleSubmit}
            >
              {isApproving ? "Approve Request" : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AssetRequests;
