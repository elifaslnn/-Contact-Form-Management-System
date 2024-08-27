import React from "react";
import { CssBaseline, Grid, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useChecUserLoginMutation } from "../services/user";

function Admin() {
  const navigate = useNavigate();
  const [checkLogin] = useChecUserLoginMutation();

  const goPages = () => {
    const targetId = event.target.id;
    const token = localStorage.getItem("token");

    checkLogin(token)
      .unwrap()
      .then((response) => {
        if (targetId == "messageLink") {
          navigate("/messages");
        } else if (targetId == "userLink") {
          navigate("/users");
        } else if (targetId == "reportLink") {
          navigate("/reports");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <CssBaseline />
      <div className="container" align="center">
        <Grid item className="signInContainer" container align="center" xs={6}>
          <Grid item xs={12}>
            <Typography>
              <Link
                id="messageLink"
                component="button"
                variant="h4"
                onClick={goPages}
              >
                Go Messages
              </Link>
            </Typography>
            <Typography>
              <Link
                id="userLink"
                component="button"
                variant="h4"
                onClick={goPages}
              >
                Go Users
              </Link>
            </Typography>
            <Typography>
              {" "}
              <Link
                id="reportLink"
                component="button"
                variant="h4"
                onClick={goPages}
              >
                Go Reports
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Admin;
