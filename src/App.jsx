import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./pages/form";
import SignIn from "./pages/signIn";
import Navbar from "./components/navbar";
import Reader from "./pages/reader";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Messages from "./pages/messages";
import MessagesDetail from "./pages/messagesDetail";
import Admin from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/users";
import EditUser from "./pages/editUser";
import AddUser from "./pages/addUser";
import Reports from "./pages/reports";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route
            path="/reader"
            element={
              <ProtectedRoute allowedRole={"reader"}>
                <Reader />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole={"admin"}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/message/:id" element={<MessagesDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
