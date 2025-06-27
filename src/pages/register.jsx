import { Button, f7, Page } from "framework7-react";
import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png"; // prilagodi putanju ako je drugačije


const Register = ({ f7router }) => {
  const [form, setForm] = useState({
    first_name:"",
    last_name:"",
    email: "",
    password: "",
    errors: {
      first_name:"",
      last_name:"",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   document.body.classList.add('no-toolbar');
  //   return () => {
  //     document.body.classList.remove('no-toolbar');
  //   };
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" }, // Resetuje grešku za to polje
    }));
  };

  const handleRegister = async () => {
    const { first_name, last_name, email, password } = form;

    const newErrors = {
      first_name:"",
      last_name:"",
      email: "",
      password: "",
    };

    let hasError = false;

    if (!first_name) {
      newErrors.first_name = "First Name is required.";
      hasError = true;
    }

    if (!last_name) {
      newErrors.last_name = "Last Name is required.";
      hasError = true;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email is invalid.";
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (hasError) {
      setForm((prev) => ({ ...prev, errors: newErrors }));
      return;
    }

    try {
      f7.dialog.preloader("Registering...");

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          role_id: 4,
        }),
      });

      const data = await response.json();
      f7.dialog.close();

      if (!response.ok) {
        if (data.errors) {
          const apiErrors = {
            first_name: data.errors.first_name?.[0] || "",
            last_name: data.errors.last_name?.[0] || "",
            email: data.errors.email?.[0] || "",
            password: data.errors.password?.[0] || "",
          };
          setForm((prev) => ({ ...prev, errors: apiErrors }));
        } else {
          f7.dialog.alert(data.message || "Registration failed.");
        }
        return;
      }

      // ✅ Uspešno
      console.log("Register data",data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("is_finised_profile", 0);
      const id = data.user.id;
      const hash = data.user.email_verification_token;
      f7router.navigate(`/verify-email/${id}/${hash}`);
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert("Server error. Please try again later.");
      console.error("Register error:", error);
    }
  };

  return (
    <Page name="register" className="login-custom-page no-navbar no-toolbar">
      {/* Inline CSS to hide toolbar */}
      <style>{`
        .toolbar.tabbar.toolbar-bottom.tabbar-icons.toolbar-transitioning{
        display:none !important;}
      `}</style>

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
          {form.errors.first_name && (
            <div className="error-message text-sm mb-2">{form.errors.first_name}</div>
          )}

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="login-input"
          />
          {form.errors.last_name && (
            <div className="error-message text-sm mb-2">{form.errors.last_name}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="login-input"
          />
          {form.errors.email && (
            <div className="error-message text-sm mb-2">{form.errors.email}</div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
          />
          {form.errors.password && (
            <div className="error-message text-sm mb-2">
              {form.errors.password}
            </div>
          )}
          <Button fill large className="login-button" type="button" onClick={handleRegister}>
            Register
          </Button>

          <div className="login-footer">
            <span>Already have an account?</span>
            <a href="/login/" className="signup-link">
              Login
            </a>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Register;
