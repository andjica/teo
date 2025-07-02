import React, { useEffect, useState } from "react";
import { Page, Button, f7 } from "framework7-react";
import logo from "@/assets/images/logo.png";
import { get, post } from "@/js/helper/api";
import { isTokenExpired } from "@/js/helper/tokenExpired";

const Login = ({ f7router }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

useEffect(() => {
  if (!isTokenExpired()) {
    // Token važi — preusmeri posle 3 sekunde
    const timer = setTimeout(() => {
      f7router.navigate('/home/');
    }, 3000);
    return () => clearTimeout(timer);
  } else {
    // Token je istekao ili ga nema — briši localStorage
    localStorage.clear();
  }
}, [f7router]);


  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
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

    // Login request
    const data = await post("login", {
      email,
      password,
    });

    f7.dialog.close();

    // Store token and user
    const token = data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Check if email is verified
    if (data.user?.email_verified_at) {
      // Fetch is_finished_profile from backend
      const isFinished = await get("user-info")
        .then((res) => res.data?.is_finished_profile ?? 0)
        .catch(() => 0);

      localStorage.setItem("is_finished_profile", isFinished.toString());

      if (isFinished.toString() === "1") {
        f7router.navigate("/home/");
      } else {
        f7router.navigate("/settings/");
      }
    } else {
      const { id } = data.user;
      const hash = data.verification_hash;
      f7router.navigate(`/verify-email/${id}/${hash}`);

      // Send verification email
      await post("email/verification-notification", { user_id: id });
    }
  } catch (error) {
    f7.dialog.close();
    console.error("Login error:", error);
    f7.dialog.alert(error.message || "Server error. Please try again later.");
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
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
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Login;
