import * as React from "react";
import {
  CssBaseline,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../services/user";
import "./signIn.css";

function SignIn() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [photo, setPhoto] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginUserMutation();

  const [errors, setErrors] = useState({}); // State for handling validation errors

  React.useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("photo", photo);
      navigate(`/${userRole}`);
    }
  }, [token, userRole]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "Username is required.";
    tempErrors.password = password ? "" : "Password is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((error) => error === "");
  };

  const handleLogin = () => {
    if (validate()) {
      const loginData = {
        username,
        password,
      };
      login(loginData)
        .unwrap()
        .then((response) => {
          console.log("Login successful");
          console.log(response);
          const { token } = response.data;
          const { role } = response.data.user;
          const { base64Photo } = response.data.user;

          setToken(token);
          setUserRole(role);
          setPhoto(base64Photo);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <CssBaseline />
      <div className="container" align="center">
        <Grid item className="signInContainer" container align="center" xs={6}>
          <Grid item xs={11}>
            <Typography
              variant="h3"
              align="center"
              sx={{ color: "rgb(138, 47, 27)" }}
            >
              Login
            </Typography>
            <Typography variant="h6" align="center" sx={{ marginTop: "30px" }}>
              Welcome back! Login to access messages :)
            </Typography>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-basic"
                label="Username"
                variant="standard"
                fullWidth
                sx={{ marginTop: "40px" }}
                onChange={(e) => setUsername(e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="standard"
                fullWidth
                sx={{ marginTop: "30px" }}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Button
              variant="contained"
              sx={{ marginTop: "30px" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default SignIn;
