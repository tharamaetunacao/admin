import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "./AdminLayout";
import { FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from Supabase Auth
  const fetchUsers = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data.users);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by name/email
  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.user_metadata?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Users</h2>
        <p className="text-green-100 mt-1 text-sm">
          View all registered users from Supabase Auth.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/2 mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">UID</th>
              <th className="px-6 py-3 text-left font-semibold">Display Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Provider</th>
              <th className="px-6 py-3 text-left font-semibold">Created At</th>
              <th className="px-6 py-3 text-left font-semibold">Last Sign In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-3 text-gray-700">{user.id}</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">
                    {user.user_metadata?.name || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{user.email}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {user.app_metadata?.provider || "Email"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft /> Previous
        </button>

        <span className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <FiChevronRight />
        </button>
      </div>
    </AdminLayout>
  );
}
