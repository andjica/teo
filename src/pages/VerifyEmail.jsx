// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import { Button, Page, f7 } from "framework7-react";
import LogoImage from "../assets/images/logo.png";

const VerifyEmail = ({ f7router, f7route }) => {
  const id = f7route?.params?.id;
  const hash = f7route?.params?.hash;
  const query = window.location.search || ""; // npr. ?expires=...&signature=...

  const token = localStorage.getItem("token");

  const verifyEmail = async () => {
    try {
      f7.dialog.preloader("Verifying...");

      // Ako koristiš helper za bazni URL, zameni localhost bazom iz helpera
      const res = await fetch(
        `http://localhost:8000/api/email/verify/${id}/${hash}${query}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      f7.dialog.close();

      // Laravel može vratiti 200 (ok), 204 (no content), 409 (already verified) itd.
     if (res.ok || res.status === 204 || res.status === 409) {
      try {
        const data = await res.json().catch(() => ({})); // pokupi JSON ako postoji
        const userRaw = localStorage.getItem("user");
        console.log(userRaw);
        if (userRaw) {
          const user = JSON.parse(userRaw);

          // Ako backend vrati email_verified_at sa datumom → stavi jedinicu
          if (data?.email_verified_at || user?.email_verified_at) {
            user.is_verified = 1;
            localStorage.setItem("is_verified", "1");
          }

          // Osveži user u LS
          localStorage.setItem("user", JSON.stringify({
            ...user,
            ...(data || {}),
          }));
        }
      } catch {}

      f7.views.main.router.navigate("/home/", { reloadCurrent: true });
      return;
    }

      // Ako nije ok, pokušaj pročitati poruku
      let msg = "Invalid or expired verification link.";
      try {
        const data = await res.json();
        if (data?.message) msg = data.message;
      } catch {}
      f7.dialog.alert(msg, "Verification failed");
    } catch (e) {
      f7.dialog.close();
      f7.dialog.alert("Something went wrong during verification.", "Error");
      // (opciono) možeš vratiti na login ili ostaviti korisnika ovde
    }
  };

  const resendEmail = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.email) {
      f7.dialog.alert("User not found in localStorage.", "Error");
      return;
    }

    f7.dialog.preloader("Sending...");
    fetch("http://localhost:8000/api/email/verification-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ user }),
    })
      .then((response) => {
        f7.dialog.close();
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(() => {
        f7.dialog.alert("Verification email has been resent ✅", "Success");
      })
      .catch((error) => {
        f7.dialog.close();
        f7.dialog.alert(`Resend failed: ${error.message}`, "Error");
      });
  };

  useEffect(() => {
    // Automatska verifikacija čim se ruta otvori
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page name="verify-email" className="verify-email-page">
      <div className="login-top">
        <img className="login-logo" alt="logo" src={LogoImage} />
      </div>
      <div className="verify-email-container">
        <h1>Verifying your email…</h1>
        <p>If nothing happens, you can resend the verification email.</p>
        <Button
          fill
          large
          className="login-button"
          type="button"
          onClick={resendEmail}
        >
          Resend verification email
        </Button>
      </div>
    </Page>
  );
};

export default VerifyEmail;
