import * as React from "react";
import { CssBaseline, Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WidthFull } from "@mui/icons-material";
import "./users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5165/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      } else if (response.status == 401) {
        console.log("401");
        navigate("/signIn");
      } else if (response.status == 403) {
        navigate("/unauthorized");
      }
    };
    getUsers();
  }, [users]);

  const editUser = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5165/api/user/check-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    console.log(response);

    if (response.ok) {
      navigate(`/edit/${id}`);
    } else {
      console.log("error");
    }
  };

  const addUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5165/api/user/check-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    console.log(response);

    if (response.ok) {
      navigate(`/addUser`);
    } else {
      console.log("error");
    }
  };

  //   console.log(users);
  return (
    <>
      {" "}
      <CssBaseline />
      <div className="container" align="center">
        {" "}
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>UserName</TableCell>
                <TableCell align="left">password</TableCell>
                <TableCell align="left">role</TableCell>
                <TableCell align="left">Photo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.username}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell align="left">{user.password}</TableCell>
                  <TableCell align="left">{user.role}</TableCell>
                  <TableCell align="left">
                    <img
                      src={user.base64Photo}
                      alt=""
                      className="img-contain"
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      className="editB"
                      variant="contained"
                      onClick={() => editUser(user.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          sx={{ marginTop: "20px" }}
          onClick={addUser}
        >
          Add User
        </Button>
      </div>
    </>
  );
}

export default Users;
