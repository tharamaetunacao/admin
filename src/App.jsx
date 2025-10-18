import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import DishesAdmin from "./pages/DishesAdmin";
import MealLogsAdmin from "./pages/MealLogsAdmin";
import UsersAdmin from "./pages/UsersAdmin";
import FeedbackAdmin from "./pages/FeedbackAdmin"; // ✅ Import feedback page

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dishes"
          element={
            <AdminRoute>
              <DishesAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/meal-logs"
          element={
            <AdminRoute>
              <MealLogsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feedback" // ✅ New feedback route
          element={
            <AdminRoute>
              <FeedbackAdmin />
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
