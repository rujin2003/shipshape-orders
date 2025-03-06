
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (!isLoggedIn()) {
    // Redirect to the login page, but save the current location they were
    // trying to go to when they were redirected
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
