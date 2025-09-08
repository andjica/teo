// src/pages/PaymentSuccess.jsx
import { Page, Navbar, Block, f7, f7ready } from "framework7-react";
import { useEffect } from "react";

function getQueryFromHash() {
  // npr: "#/payment-success?context=auction&entity_id=123"
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  if (qIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.substring(qIndex + 1));
}

export default function PaymentSuccess({ f7route }) {
  useEffect(() => {
    // 1) probaj preko F7 rute
    const q1 = f7route?.query || {};
    let context = q1.context;
    let entityId = q1.entity_id;

    // 2) fallback: parsiraj iz hash-a (jer je hash router)
    if (!context || !entityId) {
      const q2 = getQueryFromHash();
      context = context || q2.get("context");
      entityId = entityId || q2.get("entity_id");
    }

    // 3) fallback: pokušaj iz localStorage ako si to čuvao ranije
    if (!context || !entityId) {
      try {
        const saved = JSON.parse(localStorage.getItem("returnContext") || "null");
        if (saved) {
          context = context || saved.type;
          entityId = entityId || saved.auctionId;
          if (saved.pendingBid) {
            localStorage.setItem("applyPendingBid", String(saved.pendingBid));
          }
          localStorage.removeItem("returnContext");
        }
      } catch {}
    }

    f7ready(() => {
      if (context === "auction" && entityId) {
        // Ako i dalje negde koristiš popup iz liste:
        // localStorage.setItem("openAuctionId", String(entityId));

        // Direktno na stranicu detalja (rutu /auctions/:id)
        f7.views.main.router.navigate(`/auctions/${entityId}`, {
          replaceState: true,
        });
        return;
      }

      if (context === "webshop" && entityId) {
        f7.views.main.router.navigate(`/shop/${entityId}`, { replaceState: true });
        return;
      }

      // fallback
      f7.views.main.router.navigate("/", { replaceState: true });
    });
  }, [f7route]);

  return (
    <Page>
      <Navbar title="Payment Success" />
      <Block strong>
        <p>Your payment method was added successfully.</p>
      </Block>
    </Page>
  );
}
