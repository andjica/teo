import { Button, f7, Page } from "framework7-react";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { post } from "@/js/helper/api";
import { validationUserRegister } from "@/js/helper/form-validation/user-register";

const Register = ({ f7router }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    errors: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

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

    const errors = validationUserRegister({
      first_name,
      last_name,
      email,
      password,
    });

    if (Object.keys(errors).length > 0) {
      setForm((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      f7.dialog.preloader("Registering...");

      // ✅ API poziv bez nepotrebnog .json()
      const data = await post("register", {
        first_name,
        last_name,
        email,
        password,
        role_id: 4,
      });

      f7.dialog.close();

      // ✅ Sačuvaj podatke
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("is_finished_profile", "0");

      const id = data.user.id;
      const hash = data.verification_hash; // proveri da li se vraća ovo ili drugačije na backendu

      f7router.navigate(`/verify-email/${id}/${hash}`);
    } catch (error) {
      f7.dialog.close();

      if (error.message.includes("422")) {
        // Laravel validation error
        const err = JSON.parse(error.message);
        const apiErrors = {
          first_name: err.errors?.first_name?.[0] || "",
          last_name: err.errors?.last_name?.[0] || "",
          email: err.errors?.email?.[0] || "",
          password: err.errors?.password?.[0] || "",
        };
        setForm((prev) => ({ ...prev, errors: apiErrors }));
      } else {
        console.error("Register error:", error);
        f7.dialog.alert(error.message || "Registration failed.");
      }
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
            <div className="error-message text-sm mb-2">
              {form.errors.first_name}
            </div>
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
            <div className="error-message text-sm mb-2">
              {form.errors.last_name}
            </div>
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
            <div className="error-message text-sm mb-2">
              {form.errors.email}
            </div>
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
          <Button
            fill
            large
            className="login-button"
            type="button"
            onClick={handleRegister}
          >
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
