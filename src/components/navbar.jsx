import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { Avatar, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledToolBar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const navItems = ["Home", "About", "Contact"];
const loginItems = ["login", "logout"];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedPhoto = localStorage.getItem("photo");
    setToken(storedToken);
    setUserPhoto(storedPhoto);
  }, []);

  const handleNavMenuClick = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleAccountMenuClick = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElNav(null);
    setAnchorElAccount(null);
  };

  const signIn = () => {
    window.location.href = "/signIn";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("photo");
    setToken(null);
    setUserPhoto(null);
    window.location.href = "/signIn";
  };

  const handleNavItemClick = (item) => {
    if (item === "Home") {
      navigate("/");
    }
    handleMenuClose();
  };

  return (
    <>
      <AppBar
        position="relative"
        sx={{
          backgroundColor: "rgb(248, 237, 227)",
          color: "rgb(138, 47, 27)",
        }}
      >
        <StyledToolBar>
          <Typography variant="h6">Navbar</Typography>
          <List sx={{ display: { sm: "flex", xs: "none" } }}>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding sx={{ width: "auto" }}>
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  onClick={() => handleNavItemClick(item)}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ width: "auto" }}>
              <ListItemButton sx={{ textAlign: "center" }}>
                <AccountCircleIcon onClick={handleAccountMenuClick} />
              </ListItemButton>
            </ListItem>
          </List>
          <Box
            sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center" }}
          >
            <IconButton
              onClick={handleAccountMenuClick}
              sx={{ color: "inherit" }}
            >
              <AccountCircleIcon />
            </IconButton>
            <MenuIcon onClick={handleNavMenuClick} />
          </Box>
        </StyledToolBar>
      </AppBar>
      <Menu
        anchorEl={anchorElNav}
        open={Boolean(anchorElNav)}
        onClose={handleMenuClose}
        sx={{ textAlign: "center" }}
      >
        {navItems.map((item) => (
          <MenuItem key={item} onClick={() => handleNavItemClick(item)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={anchorElAccount}
        open={Boolean(anchorElAccount)}
        onClose={handleMenuClose}
        sx={{ textAlign: "center" }}
      >
        {!token ? (
          <MenuItem key={loginItems[0]} onClick={signIn}>
            {loginItems[0]}
          </MenuItem>
        ) : (
          [
            userPhoto && (
              <MenuItem key="userPhoto">
                <Avatar alt="User Photo" src={userPhoto} />
              </MenuItem>
            ),
            <MenuItem key={loginItems[1]} onClick={logout}>
              {loginItems[1]}
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  );
};

export default Navbar;
