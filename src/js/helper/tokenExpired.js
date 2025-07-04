import { f7 } from "framework7-react";

export function isTokenExpired() {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);

    if (now >= expiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      f7.dialog.alert("Your session has expired. Please log in again.", "Session timed out", () => {
        f7.views.main.router.navigate("/login");
      });

      return true;
    }

    return false;
  } catch (e) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    f7.dialog.alert("Invalid token. Please log in again.", "Error", () => {
      f7.views.main.router.navigate("/login");
    });

    return true;
  }
}
