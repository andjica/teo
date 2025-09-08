import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Icon,
  Block,
  Button,
  List,
  ListItem,
  f7,
} from "framework7-react";
import { useEffect, useState } from "react";

export default function PaymentSettings() {
  const [hasCard, setHasCard] = useState(false);

  useEffect(() => {
    fetch("/api/user/payment-method", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setHasCard(data.hasCard))
      .catch(() => f7.dialog.alert("Error loading payment info"));
  }, []);

  const addPaymentMethod = async () => {
    try {
      const res = await fetch("/api/payment/create-setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url; // redirect na Mollie
      } else {
        f7.dialog.alert("Could not start payment setup.");
      }
    } catch (err) {
      console.error(err);
      f7.dialog.alert("Error creating payment setup.");
    }
  };

  return (
    <Page name="payment-settings">
      {/* NAVBAR */}
      <Navbar>
        <NavLeft>
          <Link back>
            <Icon f7="arrow_left" />
          </Link>
        </NavLeft>
        <NavTitle sliding>Payment Settings</NavTitle>
        <NavRight />
      </Navbar>

      {/* CONTENT */}
      <Block strong>
        {hasCard ? (
          <List inset>
            <ListItem
              title="Your default payment method"
              after="✓ Active"
            />
          </List>
        ) : (
          <>
            <p style={{ marginBottom: 10 }}>
              Before bidding in auctions or ordering in the webshop, please
              insert your payment card.
            </p>
            <Button fill onClick={addPaymentMethod}>
              Add Payment Method
            </Button>
          </>
        )}
      </Block>
    </Page>
  );
}
