import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../auth/action";

import logo from "../../assets/eTravelLogo.png";
import ErrorModal from "../common/ErrorModal";

const Login = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });
  const [loading, setLoading] = useState(false);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();

    //ANIMATION_LOADING
    setLoading(!loading);

    if (username.length === 0 || password.length === 0) {
      return;
    }

    try {
      await dispatch(login({ username, password }));
    } catch (e) {
      setLoading(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: e,
        status: "error",
      });
    }

    //Close error message
    setTimeout(
      () => setNotification({ ...notification, errorState: false }),
      3000
    );
  };
  return (
    <Box
      component="main"
      paddingTop={10}
      onKeyPress={(e) => (e.key === "Enter" ? onLogin : {})}
      height="100%"
    >
      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />
      <form onSubmit={onLogin}>
        <Box
          display="flex"
          flexDirection="column"
          maxWidth={400}
          alignItems="center"
          justifyContent="center"
          margin="auto"
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          backgroundColor={theme.palette.background.primary}
        >
          <img src={logo} width="100%" alt="logo" />

          <TextField
            fullWidth
            label="User Name"
            margin="normal"
            variant="outlined"
            name="username"
            type="text"
            disabled={loading}
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g admin123"
            required
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            variant="outlined"
            name="password"
            type="password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
            required
            inputProps={{ maxLength: 50 }}
          />
          <Button
            variant="contained"
            disabled={loading}
            color="error"
            sx={{
              marginTop: "30px",
              borderRadius: "5px",
              width: "150px",
              height: "40px",
            }}
            type="submit"
          >
            {loading ? (
              <CircularProgress color="error" size={25} />
            ) : (
              <Typography fontWeight={700} fontSize={20}>
                Log In
              </Typography>
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
