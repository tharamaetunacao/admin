// import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   // Only redirect when user.id exists and auth state is ready
//   useEffect(() => {
//     if (!loading && user?.id) {
//       navigate("/admin", { replace: true });
//     }
//   }, [user?.id, loading, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) setError(error.message);
//     else if (data.user?.id) navigate("/admin", { replace: true });
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-6 rounded shadow-md w-full max-w-sm"
//       >
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         {error && <p className="text-red-500 mb-2">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-2 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-4 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white w-full py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


// ================================================================================================================================================



import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect when logged in
  useEffect(() => {
    if (!loading && user?.id) {
      navigate("/admin", { replace: true });
    }
  }, [user?.id, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError("Invalid email or password");
    else if (data.user?.id) navigate("/admin", { replace: true });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-[400px] max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2 text-center mt-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm sm:text-base px-2 sm:px-0">
          Sign in to continue using{" "}
          <span className="font-semibold text-green-600">Admin Panel</span>
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="w-full space-y-4 sm:space-y-6 px-2 sm:px-0"
        >
          {error && (
            <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-center text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 rounded-xl shadow-lg transition duration-300 text-sm sm:text-base"
          >
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 sm:mt-6 text-center text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2">
          <p>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Create one
            </span>
          </p>
          <p
            onClick={() => navigate("/forgot-password")}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Forgot your password?
          </p>
        </div>
      </div>
    </div>
  );
}
