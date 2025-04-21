import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AssetProvider } from "./context/AssetContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AssetRequests from "./pages/admin/AssetRequests";
import AdminManagementHub from "./pages/AdminManagementHub";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import RequestAsset from "./pages/user/RequestAsset";
import ConsentForms from "./pages/user/ConsentForms";

// IT Team Page
import ItDashboard from "./pages/it/ItDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AssetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/requests" element={<AssetRequests />} />
              {/* Shared Admin/Management Page */}
              <Route path="/admin-management" element={<AdminManagementHub />} />
              
              {/* User Routes */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/dashboard/request" element={<RequestAsset />} />
              <Route path="/dashboard/consent-forms" element={<ConsentForms />} />

              {/* IT Team Route */}
              <Route path="/it-dashboard" element={<ItDashboard />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AssetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
