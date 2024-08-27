import React from "react";
import MessageCardList from "../components/messageCardList";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../services/api";
import "./messages.css";

function Messages() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signIn");
    }
  }, [navigate]);

  return (
    <>
      <CssBaseline />
      <div className="container" align="center">
        <MessageCardList />
      </div>
    </>
  );
}

export default Messages;
