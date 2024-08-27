import * as React from "react";
import { Container, CssBaseline, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TextField, Button } from "@mui/material";
import "./signIn.css";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddUser() {
  const [base64Image, setBase64Image] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({
    username: "",
    pass: "",
    base64Image: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateFields = () => {
    let isValid = true;
    let errors = { username: "", pass: "", base64Image: "" };

    if (!username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!pass.trim()) {
      errors.pass = "Password is required";
      isValid = false;
    }
    if (!base64Image) {
      errors.base64Image = "Profile photo is required";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const addUserBtn = async () => {
    if (!validateFields()) return;

    const bodyJson = {
      username: username,
      password: pass,
      base64Photo: base64Image,
    };
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5165/api/user/add-reader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(bodyJson),
    });

    if (response.ok) {
      setAlert(true);
      setTimeout(() => setAlert(false), 3000);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className="container" align="center">
        <Grid
          item
          className="addUserContainer"
          container
          align="center"
          xs={6}
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Grid item xs={11}>
            <Typography
              variant="h3"
              align="center"
              sx={{ color: "rgb(138, 47, 27)" }}
            >
              Add New User
            </Typography>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-basic"
                label="Username"
                variant="standard"
                fullWidth
                sx={{ marginTop: "40px" }}
                onChange={(e) => setUsername(e.target.value)}
                error={!!error.username}
                helperText={error.username}
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
                onChange={(e) => setPass(e.target.value)}
                error={!!error.pass}
                helperText={error.pass}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom variant="body1" component="div">
                <br />
                Select Photo
                <br />
                <br />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload File
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {error.base64Image && (
                  <Typography variant="body2" color="error">
                    {error.base64Image}
                  </Typography>
                )}
                {base64Image && (
                  <img
                    src={base64Image}
                    alt="Selected"
                    style={{
                      marginTop: "10px",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Typography>
            </Grid>
            <Button
              variant="contained"
              sx={{ marginTop: "30px" }}
              onClick={addUserBtn}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
        {alert && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{ marginTop: 2 }}
          >
            User added successfully!
          </Alert>
        )}
      </div>
    </>
  );
}

export default AddUser;
