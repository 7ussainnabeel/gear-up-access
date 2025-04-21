
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Computer, ClipboardCheck, Users, FileText } from "lucide-react";

const Index = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  // Get dashboard route based on user role
  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "management":
        return "/management";
      case "it":
        return "/it-dashboard";
      default:
        return "/dashboard";
    }
  };

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && currentUser) {
    const dashboardRoute = getDashboardRoute(currentUser.role);
    navigate(dashboardRoute);
    return null;
  }

  const features = [
    {
      title: "Asset Management",
      description: "Request, track, and manage company assets throughout their lifecycle",
      icon: Computer,
    },
    {
      title: "Digital Consent Forms",
      description: "Paperless approval process with digital signatures",
      icon: ClipboardCheck,
    },
    {
      title: "User Management",
      description: "Create and manage user accounts with different permission levels",
      icon: Users,
    },
    {
      title: "Approval Workflows",
      description: "Structured approval processes for requests and terminations",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header/Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-semibold">AssetManager</span>
          </div>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Company Asset Management System
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              A complete solution for managing company assets, handling requests,
              and streamlining approval processes
            </p>
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to streamline your asset management?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Sign in to start managing your company assets efficiently
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate("/login")}
            >
              Sign In Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-4">© 2025 AssetManager. All rights reserved.</p>
            <p className="text-sm text-gray-400">
              A comprehensive asset management system for businesses
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
