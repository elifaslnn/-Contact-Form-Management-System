// Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <Link to="/signIn">Go to Login</Link>
    </div>
  );
}

export default Unauthorized;
