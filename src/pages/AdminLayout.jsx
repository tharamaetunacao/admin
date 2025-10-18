import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";
import { FiBookOpen, FiUsers, FiLogOut, FiList, FiMessageCircle } from "react-icons/fi";
import { LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col justify-between shadow-lg">
        <div>
          <div className="p-6 text-center border-b border-green-600">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-green-100 mt-1">{user?.email}</p>
          </div>
          <nav className="mt-6 space-y-2 px-4">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/dishes"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <FiList className="text-lg" />
              <span>Manage Dishes</span>
            </Link>

            <Link
              to="/admin/meal-logs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <FiBookOpen className="text-lg" />
              <span>Manage Meal Logs</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <FiUsers className="text-lg" />
              <span>Manage Users</span>
            </Link>

            {/* New: Manage Feedback */}
            <Link
              to="/admin/feedback"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-600 transition"
            >
              <FiMessageCircle className="text-lg" />
              <span>Manage Feedback</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-green-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-md transition"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
