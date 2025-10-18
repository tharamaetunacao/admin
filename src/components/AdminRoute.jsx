import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role_name")
        .eq("user_id", user.id)
        .maybeSingle(); // <-- allows 0 or 1 row

      if (!error && data?.role_name === "admin") {
        setIsAdmin(true);
      }
      setChecking(false);
    };

    fetchRole();
  }, [user]);

  if (loading || checking) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}
