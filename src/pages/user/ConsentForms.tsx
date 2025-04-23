import { useState } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useAssets } from "@/context/AssetContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, File, FileCheck, FileText } from "lucide-react";

const ConsentForms = () => {
  const { currentUser } = useAuth();
  const { consentForms, signConsentForm } = useAssets();
  const { toast } = useToast();
  
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  
  // Get forms relevant to the current user
  const userForms = consentForms.filter(form => form.userId === currentUser?.id);
  
  // Separate forms by status
  const pendingForms = userForms.filter(form => form.sent && !form.signed);
  const signedForms = userForms.filter(form => form.signed);
  
  const handleShowForm = (formId: string) => {
    setSelectedForm(formId);
    setShowDialog(true);
  };
  
  const handleSign = () => {
    if (!signature.trim()) {
      toast({
        title: "Signature Required",
        description: "Please type your name to sign the form",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedForm) {
      signConsentForm(selectedForm, signature);
      setShowDialog(false);
      setSignature("");
      
      toast({
        title: "Form Signed",
        description: "Your consent form has been signed successfully",
      });
    }
  };
  
  const selectedFormData = selectedForm 
    ? consentForms.find(form => form.id === selectedForm) 
    : null;

  return (
    <DashboardLayout requiredRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Consent Forms</h1>
          <p className="text-muted-foreground">
            View and sign consent forms for your assigned assets
          </p>
        </div>
        
        {pendingForms.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-yellow-600" />
              Pending Signatures
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingForms.map(form => (
                <Card key={form.id} className="border-yellow-200">
                  <CardHeader className="bg-yellow-50 rounded-t-lg">
                    <CardTitle className="text-lg">Asset Consent Form</CardTitle>
                    <CardDescription>
                      Asset ID: {form.assetId} • Created on {new Date(form.dateCreated).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {form.content}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleShowForm(form.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Form
                    </Button>
                    <Button size="sm" onClick={() => handleShowForm(form.id)}>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Sign Form
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {signedForms.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-600" />
              Signed Forms
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {signedForms.map(form => (
                <Card key={form.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset Consent Form</CardTitle>
                    <CardDescription>
                      Asset ID: {form.assetId} • Signed on {form.dateSigned ? new Date(form.dateSigned).toLocaleDateString() : 'Unknown'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="rounded bg-gray-50 p-3 mb-3">
                      <p className="text-sm font-medium">Status:</p>
                      <div className="flex items-center gap-2 mt-1">
                        {form.adminApproved && form.managementApproved ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Fully Approved
                          </span>
                        ) : form.adminApproved || form.managementApproved ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Partially Approved
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Pending Approval
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {form.content}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => handleShowForm(form.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Form
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {userForms.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-1">No Consent Forms</h3>
                <p className="text-muted-foreground">
                  You don't have any consent forms to sign at the moment
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Consent Form</DialogTitle>
            <DialogDescription>
              {selectedFormData?.signed 
                ? "This form has been signed" 
                : "Please read carefully and sign the form"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="whitespace-pre-line">{selectedFormData?.content}</p>
            </div>
            
            {selectedFormData?.signed ? (
              <div className="border-t pt-4">
                <p className="text-sm font-medium">Signed by:</p>
                <p className="text-lg font-semibold mt-1">{selectedFormData.signature}</p>
                <p className="text-xs text-muted-foreground">
                  Date: {selectedFormData.dateSigned ? new Date(selectedFormData.dateSigned).toLocaleString() : 'Unknown'}
                </p>
              </div>
            ) : (
              <div>
                <label htmlFor="signature" className="block text-sm font-medium mb-1">
                  Your Signature (Type your full name)
                </label>
                <Textarea
                  id="signature"
                  placeholder="Type your full name as your signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {selectedFormData?.signed ? "Close" : "Cancel"}
            </Button>
            {!selectedFormData?.signed && (
              <Button onClick={handleSign}>
                Sign Form
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ConsentForms;
