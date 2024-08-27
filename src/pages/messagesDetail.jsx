import React, { useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
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

function MessagesDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [alert, setAlert] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/signIn");
    }
  }, [navigate]);

  useEffect(() => {
    const getDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5165/api/message/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setDetails(data.data.message);
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

  const readMessage = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(id);
    try {
      const response = await fetch(
        `http://localhost:5165/api/message/read/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        console.log("mesaj okundu");
        setAlert(true);
      } else if (response.status == 401) {
        console.log("401");
        navigate("/signIn");
      } else if (response.status == 403) {
        navigate("/unauthorized");
      } else {
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
        <Card sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography gutterBottom variant="h8" component="div">
              Gönderen: {details.name}
            </Typography>
            <Typography gutterBottom variant="h8" component="div">
              Mesaj Id: {details.id}
            </Typography>
            <Typography gutterBottom variant="h8" component="div">
              Ülke: {details.country}
            </Typography>
            <Typography gutterBottom variant="h8" component="div">
              Cinsiyet: {details.gender}
            </Typography>
            <Typography gutterBottom variant="h8" component="div">
              Message:
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {details.message}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={readMessage}>
              Okundu Olarak İşaretle
            </Button>
            {alert && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Mesaj okundu olarak işaretlendi{" "}
              </Alert>
            )}
          </CardActions>
        </Card>
      </div>
    </>
  );
}

export default MessagesDetail;
