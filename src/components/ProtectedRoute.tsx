import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = usePasswordProtection();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the intended destination
      navigate("/", { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
