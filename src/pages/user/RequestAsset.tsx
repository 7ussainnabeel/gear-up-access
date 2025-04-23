
import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useAssets } from "@/context/AssetContext";
import { AssetType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Smartphone, Computer, Laptop, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const assetOptions: { value: AssetType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { value: "company_car", label: "Company Car", icon: Car },
  { value: "mobile", label: "Mobile Phone", icon: Smartphone },
  { value: "computer", label: "Desktop Computer", icon: Computer },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "ip_phone", label: "IP Phone", icon: Phone },
  { value: "email", label: "Email Account", icon: Mail },
  { value: "accessories", label: "Accessories", icon: Computer },
];

const RequestAsset = () => {
  const { currentUser } = useAuth();
  const { createAssetRequest } = useAssets();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isReplacement = searchParams.get("type") === "replacement";

  const [assetType, setAssetType] = useState<AssetType | "">("");
  const [details, setDetails] = useState("");
  const [replacement, setReplacement] = useState(isReplacement);
  const [replacementReason, setReplacementReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!assetType || !details) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (replacement && !replacementReason) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for replacement",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to request an asset",
        variant: "destructive",
      });
      return;
    }

    createAssetRequest({
      userId: currentUser.id,
      assetType: assetType as AssetType,
      requestDetails: replacement 
        ? `${details}\n\nReplacement Reason: ${replacementReason}` 
        : details,
      isReplacement: replacement
    });

    toast({
      title: "Request Submitted",
      description: "Your asset request has been submitted for approval",
    });
    
    navigate("/dashboard");
  };

  // Find the selected asset icon
  const SelectedIcon = assetOptions.find((option) => option.value === assetType)?.icon;

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Request an Asset</h1>
          <p className="text-muted-foreground">
            Submit a request for a new company asset
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="assetType">Asset Type</Label>
                <Select 
                  value={assetType} 
                  onValueChange={(value) => setAssetType(value as AssetType)}
                >
                  <SelectTrigger id="assetType">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <option.icon className="mr-2 h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="details">Request Details</Label>
                <Textarea
                  id="details"
                  placeholder="Describe the asset you are requesting and why you need it"
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="replacement" 
                  checked={replacement}
                  onCheckedChange={(checked) => setReplacement(checked as boolean)}
                />
                <Label htmlFor="replacement" className="cursor-pointer">
                  This is a replacement request
                </Label>
              </div>

              {replacement && (
                <div>
                  <Label htmlFor="replacementReason">Replacement Reason</Label>
                  <Textarea
                    id="replacementReason"
                    placeholder="Why do you need a replacement? (e.g., damage, loss, upgrade)"
                    rows={3}
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    className="resize-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg">Request Summary</h3>
              
              {assetType ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {SelectedIcon && <SelectedIcon className="h-8 w-8 text-blue-500" />}
                    <div>
                      <p className="font-medium capitalize">
                        {assetType.replace("_", " ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {replacement ? "Replacement Request" : "New Request"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Request Details:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {details || "No details provided"}
                    </p>
                  </div>
                  
                  {replacement && (
                    <div>
                      <p className="text-sm font-medium">Replacement Reason:</p>
                      <p className="text-sm text-gray-600">
                        {replacementReason || "No reason provided"}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                    Your request will be reviewed by the admin team. 
                    {assetType === "email" || assetType === "computer" || 
                     assetType === "laptop" || assetType === "mobile" || 
                     assetType === "ip_phone" ? 
                      " The IT team will also be notified." : ""}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Computer className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>Select an asset type to see summary</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RequestAsset;
