import React, { useEffect, useState } from "react";
import { Page, f7 } from "framework7-react";
import AuctionDetail from "../components/auction/AuctionDetail";
import { get } from "@/js/helper/api";

export default function AukcijaPage({ f7route }) {
  const { id } = f7route.params;
  const status = f7route.params?.status || f7route.query?.status;

  const [auction, setAuction] = useState(null);
  const [bidVal, setBidVal] = useState("");

  // --- fetch auction ---
  useEffect(() => {
    console.log("ROUTER CURRENT ROUTE:", f7route);

    (async () => {
      try {
        const response = await get(`auction/${id}`);
        setAuction(response.data);
      } catch (err) {
        console.error("Failed to fetch auction:", err.message);
        f7.dialog.alert("Could not load auction details.");
      }
    })();
  }, [id]);

  // --- payment status alerts ---
  useEffect(() => {
    if (!status) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;
    const cardSetupKey = `user-card-setup-${userId}`;

    if (status === "success" && !localStorage.getItem(cardSetupKey)) {
      f7.dialog.alert("✅ Payment successful! Your card is set up.");
      localStorage.setItem(cardSetupKey, "1");
    }

    if (status === "failed") {
      f7.dialog.alert("❌ Payment failed. Please try again.");
    }
  }, [status]);

  return (
    <Page name="aukcija">
      {auction ? (
        <AuctionDetail auction={auction} bidVal={bidVal} setBidVal={setBidVal} />
      ) : (
        <p>Loading...</p>
      )}
    </Page>
  );
}
