import Category from "@/components/Category";
import Footer from "@/components/Footer";
import Navigate from "@/components/Navigate";
import { get } from "@/js/helper/api";
import { getImageUrl } from "@/js/helper/displayImage";
import { isTokenExpired } from "@/js/helper/tokenExpired";
import {
    Block,
    BlockTitle,
    Button,
    Card,
    CardContent,
    Icon,
    Page,
} from "framework7-react";
import { useEffect, useState } from "react";
import ProductView from "./product/ProductView";

const NewProducts = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    if (isTokenExpired()) {
      // Token je istekao ili ne postoji
      localStorage.clear(); // ili removeItem za selektivno brisanje
      f7router.navigate("/login/");
    } else {
      // Token je validan, možeš fetchovati proizvode i ostalo
      fetchNewProducts();
      fetchCategory();
    }
  }, []);

  const fetchNewProducts = async () => {
    try {
      const response = await get("new/products"); // 👈 koristi get iz api.js
      setNewProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await get("categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  const handleVariantChange = (pid, type, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], [type]: value },
    }));
  };

  const addToCart = (product) => {
  const sel = selectedVariants[product.id] || {};
  const hasVariants = product?.variants && product.variants.size && product.variants.color;

  const newItem = {
    ...product,
    selectedSize: sel.size || (hasVariants ? product.variants.size[0] : null),
    selectedColor: sel.color || (hasVariants ? product.variants.color[0] : null),
    quantity: 1, // dodaj ako koristiš u `CartSheet`
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

  return (
    <Page className="hide-scrollbar" name="newProducts">
      <Navigate />
      <Category categories={categories} />
      {/* ---------- GRID ---------- */}
      <BlockTitle>New Product Grid</BlockTitle>
      <Block className="grid grid-cols-2 grid-gap">
        {newProducts.map((p) => (
          <Card key={p.id} className="product-card">
            <img
              src={getImageUrl(p.primary_image.image_url)}
              data-pid={p.id}
              alt={p.name}
              style={{ width: "100%", height: "50%", borderRadius: 10 }}
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

export default NewProducts;
