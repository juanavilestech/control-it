import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
// import Register from "./components/Register"; // Removed
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./components/JobBoard";
import JobForm from "./components/JobForm";
import InventoryTable from "./components/InventoryTable";
import InventoryForm from "./components/InventoryForm";
import StockRequestList from "./components/StockRequestList";
import StockRequestForm from "./components/StockRequestForm";
import UserManagement from "./components/UserManagement";
import UserForm from "./components/UserForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Public Register Removed - Moved to Internal User Management */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jobs" element={<JobBoard />} />
                    <Route path="/jobs/new" element={<JobForm />} />
                    <Route path="/jobs/:id/edit" element={<JobForm />} />
                    <Route path="/inventory" element={<InventoryTable />} />
                    <Route path="/inventory/new" element={<InventoryForm />} />
                    <Route
                      path="/stock-requests"
                      element={<StockRequestList />}
                    />
                    <Route
                      path="/stock-requests/new"
                      element={<StockRequestForm />}
                    />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/users/new" element={<UserForm />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
