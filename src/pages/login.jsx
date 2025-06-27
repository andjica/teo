import React, { useState } from "react";
import { Page, Button, f7 } from "framework7-react";

import logo from "../assets/images/logo.png";

const Login = ({ f7router }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format.";
        valid = false;
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      f7.dialog.preloader("Logging in...");

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("User data: ", data);
      f7.dialog.close();

      if (!response.ok) {
        f7.dialog.alert(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const user = localStorage.getItem("user");
      localStorage.setItem("is_finished_profile", JSON.stringify(user.isVerify ? 1 : 0));

      const token = localStorage.getItem("token");
      if (data.user?.email_verified_at) {
        f7router.navigate("/home/");
      } else {
        const id = data.user.id;
        const hash = data.verification_hash;
        f7router.navigate(`/verify-email/${id}/${hash}`);

        fetch("http://localhost:8000/api/email/verification-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: id }),
        }).catch((error) => {
          console.error("Verification email resend failed:", error.message);
        });
      }
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert("Server error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <Page name="login" className="login-custom-page no-navbar no-toolbar">
      <div className="login-wrapper">
        <div className="login-top">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <div className="login-container">
          <h2>Login</h2>

          {/* Wrap inputs in a form */}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // prevent default form submission
              handleLogin();
            }}
            autoComplete="on" // Enable autocomplete for form
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              name="email"
              autoComplete="email"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              name="password"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}

            <Button fill large className="login-button" type="submit">
              Login
            </Button>
          </form>

          <div className="login-footer">
            <span>Create an account?</span>
            <a href="/register/" className="signup-link">
              SignUp
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Login;
