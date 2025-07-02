import { Block, Button, Icon, Sheet } from "framework7-react";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "@/js/helper/displayImage";

const CartSheet = ({ cartOpen, setCartOpen }) => {
  const [productCart, setProductCart] = useState([]);

  useEffect(() => {
    if (cartOpen) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setProductCart(cart);
    }
  }, [cartOpen]);

  const totalPrice = productCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Kad se promeni productCart, možeš sačuvati u localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(productCart));
  }, [productCart]);

  const updateQty = (idx, delta) => {
    setProductCart((prev) => {
      const newCart = [...prev];
      const item = newCart[idx];
      if (!item) return newCart;
      const newQty = (item.quantity || 1) + delta;
      if (newQty < 1) return newCart;
      item.quantity = newQty;
      return newCart;
    });
  };

  const removeFromCart = (idx) => {
    setProductCart((prev) => {
      const newCart = [...prev];
      newCart.splice(idx, 1);
      return newCart;
    });
  };

  return (
    <Sheet
      opened={cartOpen}
      onSheetClosed={() => setCartOpen(false)}
      style={{ height: "94vh" }}
      backdrop
    >
      <Block strong>
        <h2 style={{ margin: 0 }}>My Cart</h2>
      </Block>

      <Block noHairlines style={{ position: "relative" }}>
        {productCart.length === 0 ? (
          <p className="text-align-center">Cart is empty</p>
        ) : (
          productCart.map((it, idx) => (
            <div
              key={idx}
              className="cart-card"
              style={{
                display: "flex",
                marginBottom: 16,
                position: "relative", // da roditelj bude relativan
              }}
            >
              <img
                src={getImageUrl(it.image) || ""}
                alt={it.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginRight: 16,
                }}
              />

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{it.name}</h4>
                <p style={{ margin: "4px 0" }}>
                  {it.subtitle || it.brand || ""}
                </p>
                <div className="price" style={{ fontWeight: "600" }}>
                  €{(it.price * (it.quantity || 1)).toFixed(2)}
                </div>
              </div>

              <div
                className="stepper-pill"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Button small clear onClick={() => updateQty(idx, -1)}>
                  <Icon f7="minus" />
                </Button>
                <span>{it.quantity || 1}</span>
                <Button small clear onClick={() => updateQty(idx, +1)}>
                  <Icon f7="plus" />
                </Button>
              </div>
              <Button
                small
                clear
                onClick={() => removeFromCart(idx)}
                aria-label="Remove product"
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  zIndex: 10,
                  color: "red",
                }}
              >
                <Icon f7="xmark_circle_fill" color="red" size={24} />
              </Button>
            </div>
          ))
        )}
      </Block>

      <div
        className="cart-footer"
        style={{
          padding: 16,
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          className="summary-total"
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h4>
            Total ({productCart.length} item
            {productCart.length !== 1 ? "s" : ""})
          </h4>
          <h4>€{totalPrice}</h4>
        </div>

        {/* Dugme za brisanje korpe */}
        <Button
          large
          outline
          color="red"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => {
            setProductCart([]);
            localStorage.removeItem("cart");
            f7.toast
              .create({
                text: "Cart has been cleared.",
                position: "bottom",
                closeTimeout: 1500,
              })
              .open();
          }}
        >
          Clear Cart
        </Button>

        <Button
          large
          fill
          className="checkout-wide"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => {
            setCartOpen(false);
            setTimeout(() => {
              f7.views.current.router.navigate("/checkout/");
            }, 300);
          }}
        >
          Proceed to Checkout
          <Icon f7="arrow_right_circle_fill" />
        </Button>
      </div>
    </Sheet>
  );
};

export default CartSheet;
