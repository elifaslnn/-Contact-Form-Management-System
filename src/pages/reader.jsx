// Reader.jsx
import React, { useEffect, useState } from "react";
import { isTokenExpired } from "../services/api";
import { useNavigate } from "react-router-dom";
import { CssBaseline, Breadcrumbs, Link, Grid, Button } from "@mui/material";
import { useChecUserLoginMutation } from "../services/user";

function Reader() {
  const [messages, setMessages] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [checkLogin] = useChecUserLoginMutation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signIn");
    }
  }, [navigate]);

  const goMessagesPage = () => {
    console.log(token);

    checkLogin(token)
      .unwrap()
      .then((response) => {
        navigate("/messages");
        console.log(response.meta.response.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {" "}
      <CssBaseline />
      <div className="container" align="center">
        <Grid
          item
          className="signInContainer"
          container
          align="center"
          xs={6}
          // sx={{ marginTop: "50px" }}
        >
          <Grid item xs={12}>
            <Button onClick={goMessagesPage}>Go Messages</Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Reader;
