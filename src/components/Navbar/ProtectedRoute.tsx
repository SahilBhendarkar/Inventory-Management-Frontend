import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/token";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
