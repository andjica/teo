// src/pages/login.jsx
import React, { useEffect, useState } from "react";
import { Page, Button, f7, Link } from "framework7-react";
import logo from "@/assets/images/logo.png";
import { post /*, get */ } from "@/js/helper/api";
import { isTokenExpired } from "@/js/helper/tokenExpired";

const Login = ({ f7router }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Ako već postoji VALIDAN token i verified, pusti korisnika dalje
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isVerified = localStorage.getItem("is_verified") === "1";
    const userRaw = localStorage.getItem("user");
    let user = null;
    try { user = userRaw ? JSON.parse(userRaw) : null; } catch {}

    const computedVerified = isVerified || !!user?.email_verified_at;

    if (token && !isTokenExpired() && computedVerified) {
      const t = setTimeout(() => f7router.navigate("/home/"), 300);
      return () => clearTimeout(t);
    }

    // ❗ Ne briši ceo localStorage (sačuvaj device_type i sve ostalo)
    ["token", "user", "is_verified"].forEach(k => localStorage.removeItem(k));
  }, [f7router]);

  const validate = () => {
    let ok = true;
    const e = { email: "", password: "" };
    if (!email) { e.email = "Email is required."; ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.email = "Invalid email format."; ok = false; }
    if (!password) { e.password = "Password is required."; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      f7.dialog.preloader("Logging in...");

      // 1) Login
      const data = await post("login", { email, password });
      f7.dialog.close();

      const token = data.token;
      const user  = data.user; // { id, device_type, is_verified, email_verified_at, ... }
      const hash  = data.verification_hash;

      // 2) Sačuvaj osnovno u LS
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 3) Normalizuj flag verifikacije (1/0, true/false, ili email_verified_at timestamp)
      const verified =
        user.is_verified === 1 ||
        user.is_verified === true ||
        !!user.email_verified_at;

      localStorage.setItem("is_verified", verified ? "1" : "0");
      localStorage.setItem("device_type", user.device_type || "web");

      // 4) Grana na osnovu verifikacije i device tipa
      if (!verified) {
        if ((user.device_type || "web") === "mobile") {
          // MOBILE → pošalji 4-cifreni kod pa vodi na verify-code
          await fetch("http://164.92.209.125:8000/api/send-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          f7router.navigate("/verify-code/");
        } else {
          // WEB → pošalji verifikacioni link pa vodi na verify-email/:id/:hash
          await post("email/verification-notification", { user_id: user.id });
          // (opciono) sačuvaj hash ako koristiš u guard-u
          if (hash) localStorage.setItem("verification_hash", hash);
          f7router.navigate(`/verify-email/${user.id}/${hash || "0"}`);
        }
        return;
      }

      // 5) Već verifikovan → vodi na home
      f7router.navigate("/home/");
    } catch (err) {
      f7.dialog.close();
      console.error("Login error:", err);
      f7.dialog.alert(err?.message || "Server error. Please try again later.");
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
            {errors.email && <div className="error-message">{errors.email}</div>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              name="password"
              autoComplete="current-password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}

            <Button fill large className="login-button" type="submit">
              Login
            </Button>
          </form>

          <div className="login-footer">
            <span>Create an account?</span>
            <Link href="/register/" className="signup-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Login;
