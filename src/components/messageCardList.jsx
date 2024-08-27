import React from "react";
import MessageCard from "./messageCard";
import { useState } from "react";
import { useEffect } from "react";
import { Grid } from "@mui/material";

function MessageCardList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5165/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages);
      } else if (response.status == 401) {
        console.log("401");
        navigate("/signIn");
      } else if (response.status == 403) {
        navigate("/unauthorized");
      }
    };
    getMessages();
  }, [messages]);

  return (
    <>
      {" "}
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {messages.map((message, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <MessageCard
              name={message.name}
              message={message.message}
              id={message.id}
              read={message.read}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default MessageCardList;
