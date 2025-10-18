import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "./AdminLayout";
import {
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function MealLogsAdmin() {
  const [mealLogs, setMealLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Meal Logs from Supabase
  const fetchMealLogs = async () => {
    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching meal logs:", error);
    } else {
      setMealLogs(data || []);
    }
  };

  useEffect(() => {
    fetchMealLogs();
  }, []);

  // Delete meal log
  const handleDelete = async (id) => {
    const { error } = await supabase.from("meal_logs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting meal log:", error);
    } else {
      setMealLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  // Filter logs by any field (e.g., dish name or meal type)
  const filteredLogs = mealLogs.filter((log) =>
    JSON.stringify(log).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Meal Logs</h2>
        <p className="text-green-100 mt-1 text-sm">
          View and manage all recorded meal logs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-1/2 mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by dish, meal type, or date..."
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
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Meal Date</th>
              <th className="px-6 py-3 text-left font-semibold">Meal Type</th>
              <th className="px-6 py-3 text-left font-semibold">Dish Name</th>
              <th className="px-6 py-3 text-left font-semibold">Serving</th>
              <th className="px-6 py-3 text-left font-semibold">Calories</th>
              <th className="px-6 py-3 text-left font-semibold">Protein</th>
              <th className="px-6 py-3 text-left font-semibold">Fat</th>
              <th className="px-6 py-3 text-left font-semibold">Carbs</th>
              <th className="px-6 py-3 text-left font-semibold">Created At</th>
              <th className="px-6 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No meal logs found.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-green-50`}
                >
                  <td className="px-6 py-3 text-gray-700">{log.id}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {log.meal_date
                      ? new Date(log.meal_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {log.meal_type || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-900 font-medium">
                    {log.dish_name || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{log.serving || "—"}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {log.calories || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {log.protein || "—"}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{log.fat || "—"}</td>
                  <td className="px-6 py-3 text-gray-700">{log.carbs || "—"}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 transition px-3 py-2 rounded-full shadow-sm"
                    >
                      <FiTrash2 size={18} />
                    </button>
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
          Page {currentPage} of {totalPages || 0}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <FiChevronRight />
        </button>
      </div>
    </AdminLayout>
  );
}
