import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Asset = {
  id: number;
  type: string;
  model: string;
  serialNumber: string;
  assignedTo: number;
};

type AssetRequest = {
  id: number;
  userId: number;
  assetType: string;
  requestDate: string;
  status: string;
};

type ConsentForm = {
  id: number;
  userId: number;
  sent: boolean;
  signed: boolean;
};

type AssetContextType = {
  assets: Asset[];
  assetRequests: AssetRequest[];
  consentForms: ConsentForm[];
  loading: boolean;
  refreshAssets: () => void;
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetRequests, setAssetRequests] = useState<AssetRequest[]>([]);
  const [consentForms, setConsentForms] = useState<ConsentForm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const [assetsRes, requestsRes, formsRes] = await Promise.all([
        fetch("/assets"),
        fetch("/asset-requests"),
        fetch("/consent-forms"),
      ]);
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        setAssets(assetsData);
      }
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setAssetRequests(requestsData);
      }
      if (formsRes.ok) {
        const formsData = await formsRes.json();
        setConsentForms(formsData);
      }
    } catch (error) {
      setAssets([]);
      setAssetRequests([]);
      setConsentForms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <AssetContext.Provider
      value={{ assets, assetRequests, consentForms, loading, refreshAssets: fetchAssets }}
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
