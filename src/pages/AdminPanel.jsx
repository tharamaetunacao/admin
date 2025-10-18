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
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import AdminLayout from "./AdminLayout";

export default function AdminPanel() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-extrabold text-green-600">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back,{" "}
          <span className="font-semibold text-green-700">{user?.email}</span>
        </p>
      </div>
    </AdminLayout>
  );
}
