import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AdminLayout from "./AdminLayout";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiMessageCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function ContactUsAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching messages:", error.message);
    else setMessages(data || []);
    setLoading(false);
  };

  // Search filtering
  const filteredMessages = messages.filter(
    (msg) =>
      msg.name?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <AdminLayout>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-3xl font-bold text-white">Contact Messages</h2>
            <p className="text-green-100 mt-1 text-sm">
                View all messages sent from the Contact Us
            </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center bg-white rounded-lg shadow-md w-full px-4 py-2 border border-gray-200">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Table (Desktop View) */}
        <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold w-1/5">Name</th>
                <th className="py-3 px-4 text-left font-semibold w-1/5">
                  Email
                </th>
                <th className="py-3 px-4 text-left font-semibold w-2/5">
                  Message
                </th>
                <th className="py-3 px-4 text-left font-semibold w-1/5">
                  Date Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    Loading messages...
                  </td>
                </tr>
              ) : currentMessages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                currentMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="border-b hover:bg-gray-50 transition text-gray-800 align-top"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-green-600" />
                        <span>{msg.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 break-words">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-green-600" />
                        <span>{msg.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 break-words">
                      <div className="flex items-start gap-2">
                        <FiMessageCircle className="text-green-600 mt-1" />
                        <span>{msg.message}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiClock className="text-green-600" />
                        <span>{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive View */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading messages...</p>
          ) : currentMessages.length === 0 ? (
            <p className="text-center text-gray-500">No messages found.</p>
          ) : (
            currentMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="text-green-600" />
                  <p className="font-semibold text-gray-800">{msg.name}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FiMail className="text-green-600" />
                  <p className="text-gray-700 break-words">{msg.email}</p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <FiMessageCircle className="text-green-600 mt-1" />
                  <p className="text-gray-700 break-words">{msg.message}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <FiClock className="text-green-600" />
                  <p>{new Date(msg.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredMessages.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200"
                  : "text-green-700 border-green-600 hover:bg-green-50"
              }`}
            >
              <FiChevronLeft /> Prev
            </button>

            <p className="text-gray-600 text-sm">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages || 1}</span>
            </p>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 border-gray-200"
                  : "text-green-700 border-green-600 hover:bg-green-50"
              }`}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
    </AdminLayout>
  );
}
