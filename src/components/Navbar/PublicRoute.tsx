import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/token";

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }: { children: JSX.Element }) => {
    const token = getToken();

    return token ? <Navigate to="/dashboard" replace /> : children;

};

export default PublicRoute;
