
import React, { createContext, useContext, useState } from "react";
import { 
  Asset, 
  AssetRequest, 
  ConsentForm, 
  TerminationRequest,
  MOCK_ASSETS,
  MOCK_ASSET_REQUESTS,
  MOCK_CONSENT_FORMS
} from "@/types";

type AssetContextType = {
  assets: Asset[];
  assetRequests: AssetRequest[];
  consentForms: ConsentForm[];
  terminationRequests: TerminationRequest[];
  
  // Asset operations
  addAsset: (asset: Omit<Asset, "id">) => void;
  updateAsset: (asset: Asset) => void;
  
  // Asset request operations
  createAssetRequest: (request: Omit<AssetRequest, "id" | "requestDate" | "status">) => void;
  approveAssetRequest: (id: string, notes?: string) => void;
  rejectAssetRequest: (id: string, notes: string) => void;
  
  // Consent form operations
  createConsentForm: (form: Omit<ConsentForm, "id" | "dateCreated" | "sent" | "signed" | "adminApproved" | "managementApproved">) => void;
  sendConsentForm: (id: string) => void;
  signConsentForm: (id: string, signature: string) => void;
  approveConsentForm: (id: string, role: 'admin' | 'management') => void;
  
  // Termination operations
  createTerminationRequest: (request: Omit<TerminationRequest, "id" | "requestDate" | "status" | "managementApproval">) => void;
  approveTermination: (id: string) => void;
  markAssetCollected: (terminationId: string, assetId: string, signature: string) => void;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>(MOCK_ASSET_REQUESTS);
  const [consentForms, setConsentForms] = useState<ConsentForm[]>(MOCK_CONSENT_FORMS);
  const [terminationRequests, setTerminationRequests] = useState<TerminationRequest[]>([]);

  // Asset operations
  const addAsset = (assetData: Omit<Asset, "id">) => {
    const newAsset = {
      ...assetData,
      id: `asset-${Date.now()}`
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (updatedAsset: Asset) => {
    setAssets(assets.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ));
  };

  // Asset request operations
  const createAssetRequest = (requestData: Omit<AssetRequest, "id" | "requestDate" | "status">) => {
    const newRequest: AssetRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    setAssetRequests([...assetRequests, newRequest]);
  };

  const approveAssetRequest = (id: string, notes?: string) => {
    setAssetRequests(assetRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'approved', notes: notes || request.notes } 
        : request
    ));
  };

  const rejectAssetRequest = (id: string, notes: string) => {
    setAssetRequests(assetRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'rejected', notes } 
        : request
    ));
  };

  // Consent form operations
  const createConsentForm = (formData: Omit<ConsentForm, "id" | "dateCreated" | "sent" | "signed" | "adminApproved" | "managementApproved">) => {
    const newForm: ConsentForm = {
      ...formData,
      id: `form-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      sent: false,
      signed: false,
      adminApproved: false,
      managementApproved: false
    };
    setConsentForms([...consentForms, newForm]);
  };

  const sendConsentForm = (id: string) => {
    setConsentForms(consentForms.map(form => 
      form.id === id ? { ...form, sent: true } : form
    ));
  };

  const signConsentForm = (id: string, signature: string) => {
    setConsentForms(consentForms.map(form => 
      form.id === id 
        ? { 
            ...form, 
            signed: true, 
            signature, 
            dateSigned: new Date().toISOString() 
          } 
        : form
    ));
  };

  const approveConsentForm = (id: string, role: 'admin' | 'management') => {
    setConsentForms(consentForms.map(form => 
      form.id === id 
        ? { 
            ...form, 
            adminApproved: role === 'admin' ? true : form.adminApproved,
            managementApproved: role === 'management' ? true : form.managementApproved
          } 
        : form
    ));
  };

  // Termination operations
  const createTerminationRequest = (requestData: Omit<TerminationRequest, "id" | "requestDate" | "status" | "managementApproval">) => {
    const newRequest: TerminationRequest = {
      ...requestData,
      id: `term-${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: 'pending',
      managementApproval: false
    };
    setTerminationRequests([...terminationRequests, newRequest]);
  };

  const approveTermination = (id: string) => {
    setTerminationRequests(terminationRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'approved', managementApproval: true } 
        : request
    ));
  };

  const markAssetCollected = (terminationId: string, assetId: string, collectorSignature: string) => {
    setTerminationRequests(terminationRequests.map(request => 
      request.id === terminationId 
        ? { 
            ...request, 
            collectedAssets: request.collectedAssets.map(asset => 
              asset.assetId === assetId 
                ? { ...asset, collected: true, collectorSignature } 
                : asset
            ) 
          } 
        : request
    ));
  };

  return (
    <AssetContext.Provider value={{
      assets,
      assetRequests,
      consentForms,
      terminationRequests,
      addAsset,
      updateAsset,
      createAssetRequest,
      approveAssetRequest,
      rejectAssetRequest,
      createConsentForm,
      sendConsentForm,
      signConsentForm,
      approveConsentForm,
      createTerminationRequest,
      approveTermination,
      markAssetCollected
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};
