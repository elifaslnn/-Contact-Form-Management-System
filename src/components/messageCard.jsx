import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function MessageCard({ name, message, id, read }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [alert, setAlert] = useState(false);

  const goMessageDetail = () => {
    navigate(`/message/${id}`);
  };

  const deleteMessage = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    console.log(token);
    console.log(id);

    try {
      const response = await fetch(
        `http://localhost:5165/api/message/delete/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        console.log("Deletion successful");
        setAlert(true);
        setTimeout(() => setAlert(false), 3000);
      } else if (response.status === 401) {
        console.log("401 Unauthorized");
        navigate("/signIn");
      } else if (response.status === 403) {
        navigate("/unauthorized");
      } else {
        console.log("An unexpected error occurred");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          backgroundColor: read === "true" ? "lightGray" : "white",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={goMessageDetail}>
            Detail
          </Button>
          {userRole === "admin" && (
            <Button size="small" onClick={deleteMessage} color="error">
              Delete
            </Button>
          )}
        </CardActions>
      </Card>
      {alert && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          Message deleted successfully!
        </Alert>
      )}
    </>
  );
}

export default MessageCard;
