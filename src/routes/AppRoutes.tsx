import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductManagement from "../pages/ProductManagement";
import UserManagement from "../pages/UserManagement";
import Auth from "@/pages/Auth/Auth";
import Dashboard from "@/pages/Dashboard";
import Sidebar from '@/components/Navbar/Sidebar'
import Transactions from "@/pages/Transactions";
import { useAuthStore } from "@/store/authstore";
import PublicRoute from "@/components/Navbar/PublicRoute";
import ProtectedRoute from "@/components/Navbar/ProtectedRoute";



const AppRoutes: React.FC = () => {
  const { token } = useAuthStore();

  return (
    <>
      <div className={`min-h-screen ${token ? "pl-64" : ""}`}>
        {
          token &&
          <Sidebar />
        }
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;