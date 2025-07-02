import React, { useEffect, useState } from "react";
import {
  Page,
  Icon,
  Block,
  Button,
  Card,
  CardContent,
  BlockTitle,
  Sheet,
  Popup,
  f7,
} from "framework7-react";

/* ----  SWIPER  --------------------------------------------------- */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductView from "./product/ProductView";
import { isTokenExpired } from "@/js/helper/tokenExpired";
import { get } from "@/js/helper/api";
import CartSheet from "@/components/CartSheet";
/* ----------------------------------------------------------------- */

const categories = [
  "All",
  "Conservative",
  "Endodontics",
  "Impressions",
  "Machines",
  "Disinfection",
  "Used",
  "Instruments",
  "Posts",
];

const HomePage = ({f7router}) => {
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    if (isTokenExpired()) {
      // Token je istekao ili ne postoji
      localStorage.clear(); // ili removeItem za selektivno brisanje
      f7router.navigate('/login/');
    } else {
      // Token je validan, možeš fetchovati proizvode i ostalo
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await get("products"); // 👈 koristi get iz api.js
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("storage")) {
      return `http://localhost:8000/${path}`;
    }
    return `http://localhost:8000/storage/${path}`;
  };

  const handleVariantChange = (pid, type, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], [type]: value },
    }));
  };

  const updateQty = (idx, delta) => {
    setCartItems((prev) => {
      const items = [...prev];
      const item = items[idx];
      if (!item) return items;
      const newQty = (item.quantity || 1) + delta;
      if (newQty < 1) return items;
      items[idx] = { ...item, quantity: newQty };
      return items;
    });
  };

  const addToCart = (product) => {
    const sel = selectedVariants[product.id] || {};
    const newItem = {
      ...product,
      selectedSize: sel.size || product?.variants.size[0],
      selectedColor: sel.color || product?.variants.color[0],
    };
    setCartItems((prev) => [...prev, newItem]);

    const img = document.querySelector(`img[data-pid='${product.id}']`);
    if (img) {
      const clone = img.cloneNode(true);
      const { left, top, width } = img.getBoundingClientRect();
      Object.assign(clone.style, {
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        transition: "all 0.6s ease-in-out",
        zIndex: 9999,
      });
      document.body.appendChild(clone);
      setTimeout(() => {
        clone.style.left = `${window.innerWidth - 50}px`;
        clone.style.top = "10px";
        clone.style.opacity = 0;
        clone.style.transform = "scale(0.2)";
      }, 10);
      setTimeout(() => document.body.removeChild(clone), 600);
    }

    f7.toast
      .create({
        text: `${product.name} je dodat u korpu`,
        position: "top",
        closeTimeout: 1500,
      })
      .open();
  };

  const removeFromCart = (idx) =>
    setCartItems((prev) => prev.filter((_, i) => i !== idx));

  const total = cartItems.reduce((sum, p) => sum + p.price, 0);

  /* ----------------  UI  ---------------- */
  return (
    <Page className="hide-scrollbar" name="home">
      {/* ---------- NAVBAR ---------- */}
      <Header cartItems={cartItems} setCartOpen={setCartOpen} />

      {/* ---------- KATEGORIJE ---------- */}
      {/* <Block className="category-scroll hide-scrollbar">
        <div
          className="scroll-cat-row hide-scrollbar"
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            padding: "10px",
          }}
        >
          {categories.map((cat) => (
            <Button key={cat} small outline>
              {cat}
            </Button>
          ))}
        </div>
      </Block> */}

      {/* ---------- POPULAR SLIDER ---------- */}
      {/* <BlockTitle>Popular Products</BlockTitle>
      <Block className="horizontal-scroll hide-scrollbar">
        <div style={{ display: "flex", gap: "10px" }}>
          {products.map((p) => (
            <Card key={`slider-${p.id}`} style={{ minWidth: 220 }}>
              <img
                src={p.images[0]}
                data-pid={p.id}
                alt={p.name}
                style={{ width: "100%", borderRadius: 10 }}
              />
              <div className="price-badge">€{p.price.toFixed(2)}</div>
              <CardContent>
                <div className="font-bold">{p.name}</div>
                <div className="text-color-gray">{p.brand}</div>
                <div className="mt-1"></div>
                <div className="flex justify-between mt-2">
                  <Button small fill onClick={() => addToCart(p)}>
                    <Icon f7="cart_fill_badge_plus" className="text-white" />
                  </Button>
                  <Button
                    small
                    outline
                    klass2
                    onClick={() => setProductDetailOpen(p)}
                  >
                    see more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Block> */}

      {/* ---------- GRID ---------- */}
      <BlockTitle>Product Grid</BlockTitle>
      <Block className="grid grid-cols-2 grid-gap">
        {products.map((p) => (
          <Card key={p.id} className="product-card">
            <img
              src={getImageUrl(p.primary_image.image_url)}
              data-pid={p.id}
              alt={p.name}
              style={{ width: "100%", height:"50%" ,borderRadius: 10 }}
            />
            <div className="price-badge">€{p.base_price}</div>
            <CardContent>
              <div className="product-content">
                <div className="product-name">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-color-gray">{p.category.name}</div>
                </div>
                <div className="flex justify-between mt-2">
                  <Button fill small onClick={() => addToCart(p)}>
                    <Icon f7="cart_fill_badge_plus" className="text-white" />
                  </Button>
                  <Button outline small onClick={() => setProductDetailOpen(p)}>
                    See more
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Block>

      {/* ---------- SHEET (KORPA) ---------- */}
      {/* ---------- CART SHEET (card-style) ---------- */}
      <CartSheet cartOpen={cartOpen} setCartOpen={setCartOpen} />

      {/* ---------- CHECKOUT POPUP ---------- */}
      <Popup opened={checkoutOpen} onPopupClosed={() => setCheckoutOpen(false)}>
        <Block strong>
          <BlockTitle>Checkout</BlockTitle>
          <p>
            Ukupan iznos: <b>€{total.toFixed(2)}</b>
          </p>
          <p>Checkout proces stiže uskoro…</p>
          <Button fill onClick={() => setCheckoutOpen(false)}>
            Zatvori
          </Button>
        </Block>
      </Popup>

      {/* ---------- PRODUCT DETAIL POPUP ---------- */}
      <ProductView
        product={productDetailOpen}
        opened={!!productDetailOpen}
        onClose={() => setProductDetailOpen(false)}
        onAddToCart={addToCart}
      />
      <Footer />
    </Page>
  );
};

export default HomePage;
