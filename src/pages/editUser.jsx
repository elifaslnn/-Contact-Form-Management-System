import React, { useState, useEffect } from "react";
import { CssBaseline, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../services/api";
import "./messages.css";
import CheckIcon from "@mui/icons-material/Check";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import "./EditUser.css";

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

function EditUser() {
  const [userDetail, setUserDetail] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [newPass, setNewPass] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5165/api/user/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserDetail(data.data.user);
        } else if (response.status == 401) {
          console.log("401");
          navigate("/signIn");
        } else if (response.status == 403) {
          navigate("/unauthorized");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetails();
  }, []);

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
  const editBtn = async () => {
    try {
      console.log(userDetail.username);
      const bodyJson = {
        username: userDetail.username,
        password: newPass,
        base64Photo: base64Image,
      };
      const response = await fetch(
        `http://localhost:5165/api/user/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify(bodyJson),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserDetail(data.data.user);
        setAlert(true);
        setTimeout(() => setAlert(false), 3000);
      } else {
        console.log(response.status.send);
        console.log(newPass);
        //console.log(base64Image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      <CssBaseline />
      <div className="container" align="center">
        {" "}
        <Typography gutterBottom variant="h8" component="div">
          Kullanıcı Adı: {userDetail.username} <br />
          Kullanıcı Rolü: {userDetail.role}
          <br />
          <br />
        </Typography>
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h8" component="div">
              <br />
              Şifreyi Güncelleyin:
              <br />
              <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="standard"
                onChange={(e) => {
                  setNewPass(e.target.value);
                }}
              />
            </Typography>
            <Typography gutterBottom variant="body1" component="div">
              <br />
              Fotoğrafı Güncelleyin
              <br />
              <br />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Dosya Yükle
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
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
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={editBtn}>
              Kaydet
            </Button>
          </CardActions>
        </Card>
        {alert && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            sx={{ marginTop: 2 }}
          >
            Bilgiler başarıyla kaydedildi!
          </Alert>
        )}
      </div>
    </>
  );
}

export default EditUser;
