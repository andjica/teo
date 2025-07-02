import { get } from "@/js/helper/api";
import { Block, Button, Icon, Page, Popup, f7 } from "framework7-react";
import React, { useEffect, useState } from "react";
import { getImageUrl } from "@/js/helper/displayImage";

const ProductView = ({ product, opened, onClose, onAddToCart }) => {
  const productId = product.id;
  const [showProduct, setShowProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  useEffect(() => {
    if (!opened || !productId) {
      setShowProduct(null);
      setMainImage(null);
      setQuantity(1);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await get(`product/${productId}`);
        setShowProduct(response.data);

        // Postavi glavnu sliku na primary ili prvu iz niza
        const primary =
          response.data.images.find((img) => img.is_primary) ||
          response.data.images[0];
        setMainImage(primary?.image_url || null);
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };

    fetchProduct();
  }, [opened, productId]);

  const cleanDescription = (showProduct?.description || "").replace(
    /<[^>]*>/g,
    ""
  );

  // Quantity stepper handlers
  const increaseQty = () => {
    if (showProduct && quantity < showProduct.quantity) {
      setQuantity((q) => q + 1);
    } else {
      f7.dialog
        .alert({
          text: "You cannot take more products than are in stock.",
          closeTimeout: 2000,
          position: "bottom",
        })
        .open();
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddProduct = (product, quantity) => {
    if (!product) return;

    // Uzmi trenutni cart iz localStorage ili inicijalizuj prazan niz
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Proveri da li proizvod već postoji u korpi
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // Proizvod postoji — povećaj količinu i ukupnu cenu
      const existingItem = cart[existingIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Ako nova količina prelazi dostupnu količinu, ograniči je
      const finalQuantity = Math.min(newQuantity, product.quantity);

      cart[existingIndex] = {
        ...existingItem,
        quantity: finalQuantity,
        totalPrice: +(finalQuantity * product.base_price),
      };
    } else {
      // Novi proizvod u korpi
      cart.push({
        id: product.id,
        name: product.name,
        image: mainImage, // možeš podesiti i product.images[0].image_url ako želiš
        price: product.base_price,
        quantity: Math.min(quantity, product.quantity),
        totalPrice: +(
          Math.min(quantity, product.quantity) * product.base_price
        ),
      });
    }

    // Sačuvaj nazad u localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Toast potvrda
    f7.toast
      .create({
        text: `Added ${quantity} × ${product.name} to cart.`,
        closeTimeout: 2000,
      })
      .open();
  };

  return (
    <Popup
      opened={opened}
      onPopupClosed={onClose}
      className="safe-areas"
      style={{ "--f7-popup-width": "100%", "--f7-popup-height": "100%" }}
    >
      {showProduct && (
        <Page
          noToolbar
          noNavbar
          className="product-view-page"
          style={{ position: "relative", paddingBottom: 80 }}
        >
          {/* Top buttons: back and cart */}
          <div
            style={{
              position: "fixed",
              top: 16,
              left: 16,
              right: 16,
              display: "flex",
              justifyContent: "space-between",
              zIndex: 1000,
            }}
          >
            <Button
              small
              round
              className="shadow"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                width: 44,
                height: 44,
              }}
              onClick={onClose}
              aria-label="Back"
            >
              <Icon f7="arrowshape_turn_up_left_fill" size={20} />
            </Button>

            <Button
              small
              round
              className="shadow"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                width: 44,
                height: 44,
              }}
              onClick={() => onAddToCart(showProduct, quantity)}
              aria-label="Add to cart"
            >
              <Icon f7="bag" size={20} />
            </Button>
          </div>

          {/* Main image */}
          <div
            style={{
              marginTop: 72,
              marginBottom: 16,
              textAlign: "center",
              width: "100%", // možeš staviti max širinu ili fiksnu širinu, npr. 400px
              maxWidth: 400, // primer max širine
              height: 300, // fiksna visina da ne "skače"
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff", // možeš staviti pozadinu da ne vidiš prazninu
              overflow: "hidden", // da ne izlazi slika van okvira
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mainImage ? (
              <img
                src={getImageUrl(mainImage)}
                alt={showProduct.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 300,
                  background: "#eee",
                  borderRadius: 12,
                }}
              />
            )}
          </div>

          {/* Thumbnail images */}
          <div
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingLeft: 16,
              paddingRight: 16,
              marginBottom: 24,
            }}
          >
            {showProduct.images.map((imgObj) => (
              <button
                key={imgObj.id}
                onClick={() => setMainImage(imgObj.image_url)}
                aria-label={`Select image ${imgObj.id}`}
                style={{
                  border:
                    mainImage === imgObj.image_url
                      ? "3px solid #007aff"
                      : "2px solid #ccc",
                  borderRadius: "50%",
                  padding: 2,
                  cursor: "pointer",
                  background: "white",
                  flexShrink: 0,
                  width: 64,
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 0.3s",
                }}
              >
                <img
                  src={getImageUrl(imgObj.image_url)}
                  alt={`Thumbnail ${imgObj.id}`}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Product info */}
          <Block strong style={{ paddingLeft: 16, paddingRight: 16 }}>
            <h2
              style={{ marginBottom: 4, fontWeight: "700", fontSize: "1.8rem" }}
            >
              {showProduct.name}
            </h2>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.3rem",
                color: "#007aff",
                marginBottom: 6,
              }}
            >
              ${showProduct.base_price}
            </p>
            <p style={{ color: "#888", marginBottom: 24, fontSize: "0.95rem" }}>
              {showProduct.category?.name}
            </p>

            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontWeight: "600", marginBottom: 8 }}>
                Description
              </h3>
              <p style={{ lineHeight: 1.5, color: "#444" }}>
                {cleanDescription || "No description available."}
              </p>
            </div>
            <div>
              <p>
                <strong>Qurent on stock: </strong>
                {showProduct.quantity}
              </p>
            </div>

            {/* Quantity selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 40,
              }}
            >
              <b style={{ fontSize: "1rem" }}>Quantity</b>
              <div
                className="qty-stepper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1.5px solid #ccc",
                  borderRadius: 8,
                  overflow: "hidden",
                  width: 120,
                  userSelect: "none",
                }}
              >
                <button
                  onClick={decreaseQty}
                  style={{
                    flex: "1 1 33%",
                    border: "none",
                    backgroundColor: "#f5f5f5",
                    cursor: quantity > 1 ? "pointer" : "not-allowed",
                    color: quantity > 1 ? "#333" : "#aaa",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    padding: "8px 0",
                    transition: "background-color 0.3s",
                  }}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div
                  style={{
                    flex: "1 1 34%",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    color: "#222",
                    userSelect: "none",
                  }}
                  aria-live="polite"
                >
                  {quantity}
                </div>
                <button
                  onClick={increaseQty}
                  style={{
                    flex: "1 1 33%",
                    border: "none",
                    backgroundColor: "#f5f5f5",
                    cursor:
                      showProduct && quantity < showProduct.quantity
                        ? "pointer"
                        : "not-allowed",
                    color:
                      showProduct && quantity < showProduct.quantity
                        ? "#333"
                        : "#aaa",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                    padding: "8px 0",
                    transition: "background-color 0.3s",
                  }}
                  disabled={!(showProduct && quantity < showProduct.quantity)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </Block>

          {/* Bottom fixed bar */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 16px",
              backgroundColor: "#fff",
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1000,
              boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Button
              round
              outline
              style={{
                width: 48,
                height: 48,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => addToCartLocalStorage(showProduct, quantity)}
              aria-label="Add to favorites"
            >
              <Icon f7="heart" size={24} color="#007aff" />
            </Button>

            <Button
              large
              fill
              style={{ flexGrow: 1, marginLeft: 16, fontWeight: "600" }}
              onClick={() => handleAddProduct(showProduct, quantity)}
              aria-label="Add to cart"
            >
              <Icon f7="bag" />
              <span style={{ marginLeft: 8 }}>Add to cart</span>
            </Button>
          </div>
        </Page>
      )}
    </Popup>
  );
};

export default ProductView;
