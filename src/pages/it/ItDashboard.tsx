import React, { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAssets } from "@/context/AssetContext";
import { Computer, Trash2, Car, Laptop, Smartphone, Keyboard, Mouse, Monitor, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AssetType, UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const assetTypes: { value: AssetType; label: string; icon: React.ComponentType<{className?: string}> }[] = [
  { value: "company_car", label: "Company Car", icon: Car },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "computer", label: "PC", icon: Computer },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "accessories", label: "Keyboard", icon: Keyboard },
  { value: "accessories", label: "Mouse", icon: Mouse },
  { value: "accessories", label: "Monitor", icon: Monitor },
];

const ItDashboard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { assetRequests, assets, addAsset, updateAsset } = useAssets();
  const [serialNumber, setSerialNumber] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("computer");
  const [assetModel, setAssetModel] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  const canManageAssets = currentUser?.role === 'it' || currentUser?.role === 'support';

  const itRelatedRequests = assetRequests.filter(
    request => ["email", "computer", "laptop", "mobile", "ip_phone"].includes(request.assetType)
  );

  const emailRequests = itRelatedRequests.filter(
    request => request.assetType === "email"
  );

  const deviceRequests = itRelatedRequests.filter(
    request => ["computer", "laptop", "mobile", "ip_phone"].includes(request.assetType)
  );

  const handleAddSerialNumber = () => {
    if (!canManageAssets) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to add asset information.",
        variant: "destructive",
      });
      return;
    }

    const assetToUpdate = assets.find(asset => asset.id === selectedAssetId);
    
    if (assetToUpdate) {
      updateAsset({
        ...assetToUpdate,
        serialNumber,
        model: assetModel
      });
      
      toast({
        title: "Asset Updated",
        description: `Serial number and model added to ${assetToUpdate.type.replace('_', ' ')}`,
      });
    } else {
      addAsset({
        type: assetType,
        serialNumber,
        model: assetModel,
        details: `Model: ${assetModel}`,
        status: 'approved'
      });
      
      toast({
        title: "Asset Added",
        description: "New asset has been added to the inventory",
      });
    }

    setSerialNumber("");
    setAssetModel("");
    setSelectedAssetId(null);
  };

  const pendingAssets = assets.filter(
    asset => !asset.serialNumber && 
    ["computer", "laptop", "mobile", "ip_phone"].includes(asset.type)
  );

  const getAssetIcon = (type: AssetType | string) => {
    switch (type) {
      case "computer":
        return <Computer className="h-5 w-5" />;
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "ip_phone":
        return <Phone className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      default:
        return <Computer className="h-5 w-5" />;
    }
  };

  const handleRemoveAsset = (assetId: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== assetId);
    toast({
      title: "Asset Removed",
      description: "The asset has been removed from inventory",
    });
  };

  return (
    <DashboardLayout requiredRole={['it', 'support'] as UserRole[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">IT Dashboard</h1>
          <p className="text-muted-foreground">
            Manage email requests, device requests, and asset information
          </p>
        </div>

        <Tabs defaultValue="email-requests" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="email-requests">Email Requests</TabsTrigger>
            <TabsTrigger value="device-requests">Device Requests</TabsTrigger>
            <TabsTrigger value="asset-management">Asset Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email-requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Account Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {emailRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6">
                    <Mail className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-muted-foreground">No pending email requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emailRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Mail className="h-5 w-5 text-blue-500" />
                              <CardTitle className="text-base">Email Request</CardTitle>
                            </div>
                            <Badge variant={request.status === 'pending' ? "outline" : 
                              request.status === 'approved' ? "default" : "destructive"}>
                              {request.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid gap-3">
                            <div>
                              <Label className="text-xs">Request Details</Label>
                              <p className="text-sm">{request.requestDetails}</p>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <Label className="text-xs">Date Requested</Label>
                                <p className="text-sm">{new Date(request.requestDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label className="text-xs">IT Approval</Label>
                                <p className="text-sm">{request.approvedByIT ? "Approved" : "Pending"}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4 flex justify-end gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => {
                                toast({
                                  title: "Request Rejected",
                                  description: "Email request has been rejected",
                                })
                              }}>
                                Reject
                              </Button>
                              <Button size="sm" onClick={() => {
                                toast({
                                  title: "Request Approved",
                                  description: "Email request has been approved",
                                })
                              }}>
                                Approve
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && request.approvedByIT === false && (
                            <Button size="sm" onClick={() => {
                              toast({
                                title: "Credentials Shared",
                                description: "Email credentials have been shared with the user",
                              })
                            }}>
                              Share Credentials
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="device-requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {deviceRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6">
                    <Computer className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-muted-foreground">No pending device requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deviceRequests.map((request) => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getAssetIcon(request.assetType)}
                              <CardTitle className="text-base">
                                {request.assetType.replace('_', ' ')} Request
                              </CardTitle>
                            </div>
                            <Badge variant={request.status === 'pending' ? "outline" : 
                              request.status === 'approved' ? "default" : "destructive"}>
                              {request.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid gap-3">
                            <div>
                              <Label className="text-xs">Request Details</Label>
                              <p className="text-sm">{request.requestDetails}</p>
                            </div>
                            <div className="flex justify-between">
                              <div>
                                <Label className="text-xs">Date Requested</Label>
                                <p className="text-sm">{new Date(request.requestDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label className="text-xs">Replacement</Label>
                                <p className="text-sm">{request.isReplacement ? "Yes" : "No"}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 p-4 flex justify-end gap-2">
                          {request.status === 'pending' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => {
                                toast({
                                  title: "Request Rejected",
                                  description: "Device request has been rejected",
                                })
                              }}>
                                Reject
                              </Button>
                              <Button size="sm" onClick={() => {
                                toast({
                                  title: "Request Approved",
                                  description: "Device request has been approved",
                                })
                              }}>
                                Approve
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button size="sm" onClick={() => {
                              toast({
                                title: "Device Assigned",
                                description: "Device has been assigned to the user",
                              })
                            }}>
                              Assign Device
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="asset-management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Asset Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assetSelect">Asset Type</Label>
                    <Select 
                      value={assetType} 
                      onValueChange={(value: AssetType) => setAssetType(value)}
                    >
                      <SelectTrigger id="assetSelect">
                        <SelectValue placeholder="Select an asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((type) => (
                          <SelectItem key={`${type.value}-${type.label}`} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      placeholder="Enter device serial number"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model/Details</Label>
                    <Input
                      id="model"
                      placeholder="Enter device model or details"
                      value={assetModel}
                      onChange={(e) => setAssetModel(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddSerialNumber}
                    disabled={!assetType || !serialNumber || !assetModel}
                  >
                    Add Asset Information
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Asset Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                {assets.filter(asset => asset.serialNumber).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No assets with serial numbers in inventory
                  </p>
                ) : (
                  <div className="space-y-4">
                    {assets
                      .filter(asset => asset.serialNumber)
                      .map(asset => (
                        <div key={asset.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Computer className="h-5 w-5" />
                            <div>
                              <p className="font-medium capitalize">{asset.type.replace('_', ' ')}</p>
                              <p className="text-xs text-muted-foreground">{asset.model}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground mr-2">S/N:</span>
                              {asset.serialNumber}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveAsset(asset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {!canManageAssets && (
        <div className="text-center text-red-500 mt-4">
          You do not have permission to manage assets.
        </div>
      )}
    </DashboardLayout>
  );
};

export default ItDashboard;
