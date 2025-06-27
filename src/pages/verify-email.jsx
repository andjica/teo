import { useEffect } from "react";
import { Button, Page, f7 } from "framework7-react";
import "../css/app.less";
import LogoImage from "../assets/images/logo.png";

const VerifyEmail = ({ f7router, f7route }) => {
  const id = f7route.params?.id;
  const hash = f7route?.params?.hash;
    const query = window.location.search;
  console.log("ID:", id);
  console.log("Hash:", hash);
  console.log("f7route:", f7route);
  // console.log("query:", window.location.search);

  const token = localStorage.getItem("token");
//   const verifyEmail = () => {
//     f7.dialog.preloader("Verifying...");

//     fetch(`http://localhost:8000/api/email/verify/${id}/${hash}${query}`, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     })
//       .then((res) => {
//         f7.dialog.close();
//         console.log("RESPONSE:",res);
//         if (res.ok) {
//           f7.dialog.alert("Email successfully verified ✅", "Success", () => {
//              f7router.navigate("/verify-success/");
//           });
//         } else {
//           f7.dialog.alert("Invalid verification link ❌", "Error");
//         }
//       })
//       .catch(() => {
//         f7.dialog.close();
//         f7.dialog.alert("Something went wrong during verification ❌", "Error");
//       });
//   };

  const resendEmail = () => {
    const user = JSON.parse(localStorage.getItem("user"));

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
        Authorization: `Bearer ${token}`,
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

//   useEffect(() => {
//     verifyEmail();
//     // eslint-disable-next-line
//   }, []);

  return (
    <Page name="verify-email" className="verify-email-page">
      <div className="login-top">
        <img className="login-logo" alt="logo" src={LogoImage} />
      </div>
      <div className="verify-email-container">
        <h1>Check Your Email 📧</h1>
        <p>
          We’ve sent you a verification link. Please check your inbox to verify
          your account.
        </p>
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
