import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../../database/FirebaseConfig";
import useUser from "../../../hooks/useUser";

const Login = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const { addUser, loading, error } = useUser();

  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSignInError("");
    setSignUpError("");
  }, []);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character (e.g., !@#$%^&*).";
    }
    return null;
  };

  const validateSignUp = () => {
    if (!username || !password || !confirmPassword) {
      return "All fields are required.";
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return passwordError;
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError("");

    const q = query(
      collection(db, "users"),
      where("username", "==", username),
      where("password", "==", password)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        onSuccess({ username: userData.username });
      } else {
        setSignInError("Incorrect username or password.");
      }
    } catch (err) {
      console.error("Error signing in:", err);
      setSignInError("An error occurred during sign-in.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError("");

    const validationError = validateSignUp();
    if (validationError) {
      setSignUpError(validationError);
      return;
    }

    const q = query(collection(db, "users"), where("username", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setSignUpError("This username has been used.");
      } else {
        const newUser = { username, password };
        await addUser(newUser);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsSignUp(false);
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      setSignUpError("An error occurred during sign-up.");
    }
  };

  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setSignInError("");
    setSignUpError("");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
          autoComplete="off"
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
          autoComplete="new-password"
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
      {!isSignUp && signInError && (
        <p style={{ color: "red" }}>{signInError}</p>
      )}
      {isSignUp && signUpError && <p style={{ color: "red" }}>{signUpError}</p>}
      <Button
        color="secondary"
        onClick={toggleFormMode}
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
