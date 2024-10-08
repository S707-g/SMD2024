import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import useUser from "../../../hooks/useUser";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { addUser } = useUser();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Add sign-in logic here
    console.log("Signing In with:", username, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const newUser = { username, password };
      addUser(newUser)
        .then(() => console.log("User signed up:", newUser))
        .catch((error) => console.error("Error signing up:", error));
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />
        {isSignUp && (
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          style={{ marginTop: "10px" }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
      <Button
        color="secondary"
        onClick={() => setIsSignUp(!isSignUp)}
        fullWidth
        style={{ color: "white", marginTop: "10px" }}
      >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </Button>
    </div>
  );
};

export default Login;
