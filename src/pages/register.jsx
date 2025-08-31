// src/pages/register.jsx
import React, { useState } from "react";
import { Page, Button, f7, Link } from "framework7-react";
import logo from "@/assets/images/logo.png";
import { post } from "@/js/helper/api";
import { validationUserRegister } from "@/js/helper/form-validation/user-register";

const Register = ({ f7router }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async () => {
    // 1) lokalna validacija
    const v = validationUserRegister(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      f7.dialog.preloader("Registering...");

      // odredi tip uređaja (po želji zameni dropdownom)
      const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );
      const device_type = isMobileUA ? "mobile" : "web";
      // const device_type = "mobile"; // — ako želiš da forsiraš mobilni

      console.log(navigator.userAgent);
      // 2) backend register
      const data = await post("register", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role_id: 4,
        device_type,
      });

      f7.dialog.close();

      // 3) LS — identično kao u Login.jsx
      const token = data.token;
      const user = data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("device_type", user.device_type || device_type);
      localStorage.setItem("is_verified", "0"); // tek napravljen — nije verifikovan

      // 4) Grana po tipu uređaja
      if ((user.device_type || device_type) === "mobile") {
        // backend je već poslao 4‑cifreni kod; da ne šaljemo opet:
        sessionStorage.setItem("codeSentOnce", "1");
        f7router.navigate("/verify-code/");
      } else {
        // web – vodi na verify email rutu
        const id = user.id;
        const hash =
          user.email_verification_token ||
          data.verification_hash ||
          ""; // fallback ako backend šalje pod drugim imenom
        f7router.navigate(`/verify-email/${id}/${hash}`);
      }
    } catch (err) {
      f7.dialog.close();

      // Laravel 422 (validation) – u mom helperu post obično baca error.message sa JSON stringom
      try {
        const payload = JSON.parse(err.message || "{}");
        if (payload?.errors) {
          setErrors({
            first_name: payload.errors.first_name?.[0] || "",
            last_name: payload.errors.last_name?.[0] || "",
            email: payload.errors.email?.[0] || "",
            password: payload.errors.password?.[0] || "",
          });
          return;
        }
      } catch (_) {
        // nije 422, samo pusti alert
      }

      console.error("Register error:", err);
      f7.dialog.alert(err?.message || "Registration failed.");
    }
  };

  return (
    <Page name="register" className="login-custom-page no-navbar no-toolbar">
      <div className="login-wrapper">
        <div className="login-top">
          <img src={logo} alt="Logo" className="login-logo" />
        </div>

        <div className="login-container">
          <h2>Register</h2>

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="login-input"
          />
          {errors.first_name && (
            <div className="error-message text-sm mb-2">{errors.first_name}</div>
          )}

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="login-input"
          />
          {errors.last_name && (
            <div className="error-message text-sm mb-2">{errors.last_name}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="login-input"
          />
          {errors.email && (
            <div className="error-message text-sm mb-2">{errors.email}</div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
          />
          {errors.password && (
            <div className="error-message text-sm mb-2">{errors.password}</div>
          )}

          <Button fill large className="login-button" onClick={handleRegister}>
            Register
          </Button>

          <div className="login-footer">
            <span>Already have an account?</span>
            <Link href="/login/" className="signup-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Register;
