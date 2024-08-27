import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const userRole = localStorage.getItem("role");

  console.log(userRole);
  if (allowedRole !== userRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
