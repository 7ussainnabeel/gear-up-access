
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/types";

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const DashboardLayout = ({ children, requiredRole }: DashboardLayoutProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  if (requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!requiredRoles.includes(currentUser.role)) {
      // Redirect to appropriate dashboard based on role
      switch (currentUser.role) {
        case "admin":
          return <Navigate to="/admin" />;
        case "management":
          return <Navigate to="/management" />;
        case "it":
          return <Navigate to="/it-dashboard" />;
        default:
          return <Navigate to="/dashboard" />;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pt-20 ml-64">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
