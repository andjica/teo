import React, { useEffect, useState } from "react";
import { f7 } from "framework7-react";
import AuctionDetail from "../components/auction/AuctionDetail";
import { get } from "@/js/helper/api";


function AuctionDetailPage({ f7route }) {
  const { id } = f7route.params;
  const status = f7route.params?.status || f7route.query?.status;

  const [auction, setAuction] = useState(null);
  const [bidVal, setBidVal] = useState("");

  // --- fetch auction ---
  useEffect(() => {
      console.log('ROUTER CURRENT ROUTE:', f7.views.get('#main-view').router.currentRoute);

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

  if (status === "success") {
    // uvek prikaži alert prvi put kad se uđe sa success statusom
    if (!localStorage.getItem(cardSetupKey)) {
      f7.dialog.alert(
        "✅ Payment successful! Your card has been set up successfully. You can now place bids in auctions without interruptions."
      );
      // odmah posle prikaza upiši da je kartica setup-ovana
      localStorage.setItem(cardSetupKey, "1");
    }
  }

  if (status === "failed") {
    f7.dialog.alert(
      "❌ Payment failed. Please try again to set up your card before placing bids in auctions."
    );
  }
}, [status]);



  return auction ? (
    <AuctionDetail auction={auction} bidVal={bidVal} setBidVal={setBidVal} />
  ) : null;
}

export default AuctionDetailPage;
