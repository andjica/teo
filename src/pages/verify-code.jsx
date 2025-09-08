// src/pages/verify-code.jsx
import React, { useState, useRef, useEffect } from "react";
import { Page, Navbar, Block, BlockTitle, Button, f7 } from "framework7-react";

const VerifyCode = ({ f7router }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 min
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  // Guard: ako je LS flag ON, ništa se više ne dešava
  const verifiedRef = useRef(localStorage.getItem("otp_stop") === "1");
  const timerRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user?.email || "";

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
  };

  const handleVerify = async () => {
    const joined = code.join("");
    if (joined.length !== 4) {
      f7.dialog.alert("Unesi 4 cifre.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://164.92.209.125:5174/api/verify-mobile-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ email, code: joined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Greška pri verifikaciji");

      // ✅ uspeh: UGASI SVE
      verifiedRef.current = true;
      localStorage.setItem("otp_stop", "1"); // trajni guard
      setCanResend(false);
      setTimeLeft(0);
      setCode(["", "", "", ""]);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      localStorage.setItem("is_user_verify", "1");
      localStorage.setItem("is_verified", "1");

      f7.dialog.alert("Verification success!", "OK", () => {
        f7router.navigate("/home/");
      });
    } catch (err) {
      f7.dialog.alert(err.message || "Pogrešan kod ili greška na serveru.");
    } finally {
      setLoading(false);
    }
  };

  // ⏱️ Timer – pokreći samo ako NISMO verifikovani
  useEffect(() => {
    if (verifiedRef.current) return;
    if (timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((s) => (verifiedRef.current ? s : s - 1));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft]);

  // ⛔ Expiry – ne radi ništa ako je verifikovano
  useEffect(() => {
    if (verifiedRef.current) return;
    if (timeLeft === 0 && !canResend) {
      setCanResend(true);
      resendCode(true).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Kad ova stranica odlazi iz DOM-a, obavezno “zakucaj” guard
  useEffect(() => {
    return () => {
      verifiedRef.current && localStorage.setItem("otp_stop", "1");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const resendCode = async (auto = false) => {
    if (verifiedRef.current) return; // ne šalji ako je već verifikovano
    try {
      const res = await fetch("http://164.92.209.125:5174/api/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message || "Resend nije uspeo");
      }

      // reset tajmera samo ako i dalje nismo verifikovani
      if (!verifiedRef.current) {
        setCode(["", "", "", ""]);
        setTimeLeft(180);
        setCanResend(false);
        if (auto) f7.dialog.alert("Code has been expired. We sent new code on your email.");
        else f7.toast.create({ text: "New code is sent successfully.", closeTimeout: 2000 }).open();
      }
    } catch (err) {
      if (!verifiedRef.current) {
        f7.dialog.alert(err.message || "Greška pri slanju novog koda.");
      }
    }
  };

  return (
    <Page name="verify-code">
      <Navbar title="Verify Code" />
      <Block
        className="text-align-center"
        style={{
          marginTop: "25vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BlockTitle style={{ marginBottom: "16px" }}>
          Enter the 4-digit code we sent to your email
        </BlockTitle>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{
                width: "25px",
                height: "35px",
                fontSize: "18px",
                textAlign: "center",
                border: "1.5px solid #007aff",
                borderRadius: "6px",
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: "12px", fontSize: "14px", color: "#999" }}>
          {canResend ? (
            "Code expired."
          ) : (
            <>Code expires in: <strong>{formatTime(timeLeft)}</strong></>
          )}
        </div>
        <Button
          style={{width: "60%" }}
          onClick={() => resendCode(false)}
          disabled={verifiedRef.current}
        >
          Resend Code
        </Button>
        <Button
          fill
          large
          style={{ marginTop: "22px", width: "80%" }}
          onClick={handleVerify}
          disabled={loading || code.includes("")}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>

       
      </Block>
    </Page>
  );
};

export default VerifyCode;
