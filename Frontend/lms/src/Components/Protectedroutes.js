// src/components/Protectedroutes.js
// This file ONLY handles checking authentication and redirecting.
// It DOES NOT import or render individual page components like Loginpage, Userp, etc.

import React from 'react'; // React is always good to import for JSX files
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user"); // Check for user data as well for robustness

  // If token OR user data is missing, redirect to login
  if (!token || !user) {
    // 'replace' ensures the user can't use the back button to get back to the protected page after logout
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the content that is wrapped by this ProtectedRoutes component.
  // 'Outlet' is used when ProtectedRoutes is acting as a parent for nested <Route> components in App.js.
  // 'children' is used if you pass components directly, e.g., <ProtectedRoutes><MyComponent /></ProtectedRoutes>.
  // Using both ensures flexibility.
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;