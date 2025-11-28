// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";
// import { supabase } from "../supabaseClient";

// export default function AdminPanel() {
//   const { user } = useAuth();

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/login";
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//       <p className="mb-4">Logged in as: {user?.email}</p>
//       <ul className="space-y-2">
//         <li>
//           <Link
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//             to="/admin/dishes"
//           >
//             Manage Dishes
//           </Link>
//         </li>
//         <li>
//           <Link
//             className="bg-green-500 text-white px-4 py-2 rounded"
//             to="/admin/meal-logs"
//           >
//             Manage Meal Logs
//           </Link>
//         </li>
//         <li>
//           <Link
//             className="bg-purple-500 text-white px-4 py-2 rounded"
//             to="/admin/users"
//           >
//             Manage Users
//           </Link>
//         </li>
//       </ul>
//       <button
//         onClick={handleLogout}
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }


// =============================================================================================================================================
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import AdminLayout from "./AdminLayout";
import { FiUsers, FiPieChart, FiMessageSquare } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminPanel() {
  const { user } = useAuth();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [totalDishes, setTotalDishes] = useState(0);
  const [dietTotals, setDietTotals] = useState([]);
  const [uniqueDishNames, setUniqueDishNames] = useState([]);
  const [showDishList, setShowDishList] = useState(false);

  const COLORS = ["#8B5CF6", "#EF4444", "#3B82F6", "#F59E0B"];
  const dietCategories = ["Balanced", "High Protein", "Keto", "Low Carb"];

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: "exact" });

        const { count: feedbackCount } = await supabase
          .from("feedback_submissions")
          .select("*", { count: "exact" });

        const { data: dishes } = await supabase
          .from("dishinfo")
          .select("name, dietary");

        // ✅ Unique dish names
        const uniqueNames = [
          ...new Set(dishes.map((d) => d.name?.trim()).filter(Boolean)),
        ];

        const totalDishes = uniqueNames.length;

        const dietTotals = dietCategories.map((cat) => {
          const uniqueDishNamesByCategory = new Set(
            dishes
              .filter((d) => d.dietary?.includes(cat))
              .map((d) => d.name?.trim())
          );
          return { name: cat, value: uniqueDishNamesByCategory.size };
        });

        setTotalUsers(userCount || 0);
        setTotalFeedbacks(feedbackCount || 0);
        setTotalDishes(totalDishes || 0);
        setDietTotals(dietTotals);
        setUniqueDishNames(uniqueNames);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchCounts();
  }, []);

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={20}
        fontWeight="600"
        style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
      >
        {value > 0 ? value : ""}
      </text>
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-600">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back,{" "}
          <span className="font-semibold text-green-700">{user?.email}</span>
        </p>
      </div>

      {/* Dashboard Overview */}
      <div className="bg-white border border-green-100 rounded-2xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-3 bg-green-100 rounded-full shadow-sm">
              <FiUsers className="text-green-600" size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-green-700">
                {totalUsers}
              </h3>
            </div>
          </div>

          {/* Total Dishes + Pie Chart + Hover List */}
          <div
            className="p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center relative"
            onMouseEnter={() => setShowDishList(true)}
            onMouseLeave={() => setShowDishList(false)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full shadow-sm">
                <FiPieChart className="text-green-600" size={26} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Dishes
                </p>
                <h3 className="text-2xl font-bold text-green-700">
                  {totalDishes}
                </h3>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="w-full h-72 flex justify-center items-center bg-white rounded-xl p-3 shadow-inner">
              {dietTotals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dietTotals}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={40}
                      dataKey="value"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {dietTotals.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} dishes`]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        fontSize: "20px",
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        fontSize: "15px",
                        lineHeight: "20px",
                        paddingTop: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center text-sm">
                  No diet data available
                </p>
              )}
            </div>

            {/* Hover list */}
            {showDishList && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 max-h-60 overflow-y-auto bg-white border border-green-200 rounded-lg shadow-lg z-50 p-3 text-sm">
                <p className="font-semibold mb-2 text-green-700">
                  Dishes List
                </p>
                <ul className="space-y-1">
                  {uniqueDishNames.map((dish, index) => (
                    <li key={index} className="truncate">
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Total Feedbacks */}
          <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-3 bg-green-100 rounded-full shadow-sm">
              <FiMessageSquare className="text-green-600" size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Feedbacks
              </p>
              <h3 className="text-2xl font-bold text-green-700">
                {totalFeedbacks}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
