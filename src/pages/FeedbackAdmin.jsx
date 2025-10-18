import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "./AdminLayout";
import { FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // default newest
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch feedback from Supabase
  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from("feedback_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching feedback:", error);
    } else {
      setFeedbacks(data);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Delete feedback
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("feedback_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting feedback:", error);
    } else {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Filter + sort feedback
  const filteredFeedbacks = feedbacks
    .filter((f) =>
      f.feedback_text?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Feedback</h2>
        <p className="text-green-100 mt-1 text-sm">
          View and manage all user-submitted feedback here.
        </p>
      </div>

      {/* Search + Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on new search
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full md:w-1/4">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // reset page when sorting changes
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table / Empty State */}
      {paginatedFeedbacks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No feedback found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">ID</th>
                  <th className="px-6 py-3 text-left font-semibold">Feedback</th>
                  <th className="px-6 py-3 text-left font-semibold">Created At</th>
                  <th className="px-6 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedFeedbacks.map((feedback, index) => (
                  <tr
                    key={feedback.id}
                    className={`transition ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-green-50`}
                  >
                    <td className="px-6 py-3 text-gray-700">{feedback.id}</td>
                    <td className="px-6 py-3 text-gray-900 font-medium">
                      {feedback.feedback_text}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(feedback.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(feedback.id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 transition px-3 py-2 rounded-full shadow-sm"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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
        </>
      )}
    </AdminLayout>
  );
}
