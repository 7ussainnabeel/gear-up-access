
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Asset, AssetRequest, ConsentForm, AssetType, TerminationRequest, MOCK_ASSETS, MOCK_ASSET_REQUESTS, MOCK_CONSENT_FORMS } from "@/types";

type AssetContextType = {
  assets: Asset[];
  assetRequests: AssetRequest[];
  consentForms: ConsentForm[];
  terminationRequests: TerminationRequest[];
  loading: boolean;
  refreshAssets: () => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  updateAsset: (asset: Asset) => void;
  approveAssetRequest: (requestId: string, notes?: string) => void;
  rejectAssetRequest: (requestId: string, notes: string) => void;
  signConsentForm: (formId: string, signature: string) => void;
  createAssetRequest: (request: Omit<AssetRequest, "id" | "status" | "requestDate">) => void;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>(MOCK_ASSET_REQUESTS);
  const [consentForms, setConsentForms] = useState<ConsentForm[]>(MOCK_CONSENT_FORMS);
  const [terminationRequests, setTerminationRequests] = useState<TerminationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // In a real app, these would be API calls
      // For now, we'll use the mock data
      console.log("Fetching assets data...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Data is already loaded from mock data
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Add a new asset
  const addAsset = (assetData: Omit<Asset, "id">) => {
    const newAsset: Asset = {
      ...assetData,
      id: `asset-${Date.now()}`
    };
    setAssets(prev => [...prev, newAsset]);
  };

  // Update an existing asset
  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ));
  };

  // Approve an asset request
  const approveAssetRequest = (requestId: string, notes?: string) => {
    setAssetRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'approved', notes: notes || request.notes } 
        : request
    ));
  };

  // Reject an asset request
  const rejectAssetRequest = (requestId: string, notes: string) => {
    setAssetRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: 'rejected', notes } 
        : request
    ));
  };

  // Sign a consent form
  const signConsentForm = (formId: string, signature: string) => {
    setConsentForms(prev => prev.map(form => 
      form.id === formId 
        ? { 
            ...form, 
            signed: true, 
            signature, 
            dateSigned: new Date().toISOString() 
          } 
        : form
    ));
  };

  // Create a new asset request
  const createAssetRequest = (requestData: Omit<AssetRequest, "id" | "status" | "requestDate">) => {
    const newRequest: AssetRequest = {
      ...requestData,
      id: `request-${Date.now()}`,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    setAssetRequests(prev => [...prev, newRequest]);
  };

  return (
    <AssetContext.Provider
      value={{ 
        assets, 
        assetRequests, 
        consentForms,
        terminationRequests,
        loading, 
        refreshAssets: fetchAssets,
        addAsset,
        updateAsset,
        approveAssetRequest,
        rejectAssetRequest,
        signConsentForm,
        createAssetRequest
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetProvider");
  }
  return context;
};
