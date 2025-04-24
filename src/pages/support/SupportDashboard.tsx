
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssets } from "@/context/AssetContext";
import { Computer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const SupportDashboard = () => {
  const { assets } = useAssets();
  const { toast } = useToast();
  const [serialNumber, setSerialNumber] = useState("");

  const handleSerialNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.serialNumber === serialNumber);
    if (asset) {
      toast({
        title: "Asset Found",
        description: `Asset ${asset.type} (${asset.model}) found in the system.`
      });
    } else {
      toast({
        title: "Asset Not Found",
        description: "No asset found with this serial number.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout requiredRole="support">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Support Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and track asset information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Computer className="h-5 w-5" />
              Asset Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSerialNumberSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter asset serial number"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>
              <Button type="submit">Look up Asset</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {asset.type.replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Serial: {asset.serialNumber}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {asset.model}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupportDashboard;
