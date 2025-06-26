import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Link,
  Icon,
  Block,
  Button,
  Card,
  CardContent,
  BlockTitle,
  Sheet,
  List,
  ListItem,
  ListInput,
  Popup,
  f7,
} from 'framework7-react';

/* ----  SWIPER  --------------------------------------------------- */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
/* ----------------------------------------------------------------- */

const categories = [
  'All', 'Conservative', 'Endodontics', 'Impressions',
  'Machines', 'Disinfection', 'Used', 'Instruments', 'Posts',
];

const products = [
  {
    id: 1,
    name: 'Endo Motor X300',
    brand: 'TeoDental',
    images: [
      'https://focusdental.hr/wp-content/uploads/2023/12/Presigum-A-silikon2-1-1-2048x1357.jpg',
      'https://picsum.photos/seed/endo-x300/600/400',
    ],
    price: 119.99,
    taxRate: 0.2,
    description:
      'Brzi i pouzdan endo motor s tri brzinska moda i moment kontrolom.',
    variants: { size: ['Small', 'Medium', 'Large'], color: ['White', 'Black'] },
  },
  {
    id: 2,
    name: 'LED Curing Light',
    brand: 'DentLux',
    images: [
      'https://focusdental.hr/wp-content/uploads/2023/12/AR-Kofferdam-110-025-1-17-pcs-2-scaled.jpg',
      'https://picsum.photos/seed/led-curing/600/400',
    ],
    price: 89.5,
    taxRate: 0.2,
    description:
      'Snažna LED lampa za polimerizaciju kompozita, autonomija 120 min.',
    variants: { size: ['Standard'], color: ['Blue', 'Silver'] },
  },
  {
    id: 3,
    name: 'Glass Ionomer Cement',
    brand: 'GC Europe',
    images: [
      'https://focusdental.hr/wp-content/uploads/2023/12/AR-Kofferdam-110-025-1-17-pcs-2-scaled.jpg',
      'https://picsum.photos/seed/gic/600/400',
    ],
    price: 42,
    taxRate: 0.2,
    description:
      'Visokokvalitetni GIC sa superiornom adhezijom i fluorid-release-om.',
    variants: { size: ['10g'], color: ['Natural'] },
  },
];

const BrandNewProductsPage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const handleVariantChange = (pid, type, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], [type]: value },
    }));
  };

  const addToCart = (product) => {
    const sel = selectedVariants[product.id] || {};
    const newItem = {
      ...product,
      selectedSize: sel.size || product.variants.size[0],
      selectedColor: sel.color || product.variants.color[0],
    };
    setCartItems((prev) => [...prev, newItem]);

    const img = document.querySelector(`img[data-pid='${product.id}']`);
    if (img) {
      const clone = img.cloneNode(true);
      const { left, top, width } = img.getBoundingClientRect();
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        transition: 'all 0.6s ease-in-out',
        zIndex: 9999,
      });
      document.body.appendChild(clone);
      setTimeout(() => {
        clone.style.left = `${window.innerWidth - 50}px`;
        clone.style.top = '10px';
        clone.style.opacity = 0;
        clone.style.transform = 'scale(0.2)';
      }, 10);
      setTimeout(() => document.body.removeChild(clone), 600);
    }

    f7.toast
      .create({
        text: `${product.name} je dodat u korpu`,
        position: 'top',
        closeTimeout: 1500,
      })
      .open();
  };

  const removeFromCart = (idx) =>
    setCartItems((prev) => prev.filter((_, i) => i !== idx));

  const total = cartItems.reduce((sum, p) => sum + p.price, 0);
  const [selectedBrand, setSelectedBrand] = useState('All');

  const filteredProducts = selectedBrand === 'All'
    ? products
    : products.filter((p) => p.brand === selectedBrand);
  
  /* ----------------  UI  ---------------- */
  return (
    <Page className="hide-scrollbar" name="catalog">
      {/* ---------- NAVBAR ---------- */}
      <Navbar>
      <NavLeft>
    {/* vodi na /settings */}
    <Link href="/settings/">
      <Icon f7="gear_alt" />   {/* biraj ikonu po želji */}
    </Link>
  </NavLeft>
        <NavTitle sliding>
          <img
            src="assets/images/logo.png"
            alt="Teo Market Logo"
            style={{ height: '57px' }}
          />
        </NavTitle>
        <NavRight>
          <Link onClick={() => setCartOpen(true)}>
            <Icon f7="cart_fill_badge_plus" className="color-blue" />
            {cartItems.length > 0 && (
              <span
                className="badge color-red"
                style={{ position: 'absolute', top: '-5px', right: '-5px' }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>
        </NavRight>
      </Navbar>
      <BlockTitle>Filter by Brand</BlockTitle>
      <Block className="brand-scroll">
        <div className="scroll-brand-row hide-scrollbar">
          {['All', 'TeoDental', 'DentLux', 'GC Europe', 'Fanta', 'Eighteeth', 'HAHNENKRATT', 'AR INSTRUMED'].map((brand) => (
            <Button
              key={brand}
              small
              outline
              className={`brand-pill ${selectedBrand === brand ? 'active' : ''}`}
              onClick={() => setSelectedBrand(brand)}
            >
              {brand}
            </Button>
          ))}
        </div>
      </Block>



      {/* ---------- KATEGORIJE ---------- */}
      <BlockTitle>Categories</BlockTitle>
      <Block className="category-scroll hide-scrollbar">
        <div
          className="scroll-cat-row hide-scrollbar"
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            padding: '10px',
          }}
        >
          {categories.map((cat) => (
            <Button key={cat} small outline>
              {cat}
            </Button>
          ))}
        </div>
      </Block>

      {/* ---------- POPULAR SLIDER ---------- */}
      <BlockTitle>All Products</BlockTitle>
      <Block className="horizontal-scroll hide-scrollbar">
        <div style={{ display: 'flex', gap: '10px' }}>
          {products.map((p) => (
            <Card key={`slider-${p.id}`} style={{ minWidth: 220 }}>
              <img
                src={p.images[0]}
                data-pid={p.id}
                alt={p.name}
                style={{ width: '100%', borderRadius: 10 }}
              />
               <div className="price-badge">
  €{p.price.toFixed(2)}
</div>
              <CardContent>
                <div className="font-bold">{p.name}</div>
                <div className="text-color-gray">{p.brand}</div>
                <div className="mt-1">
                </div>
                <div className="flex justify-between mt-2">
                  <Button small fill onClick={() => addToCart(p)}>
                  <Icon f7="cart_fill_badge_plus" className="text-white" />
                                    </Button>
                  <Button small outline klass2 onClick={() => setProductDetailOpen(p)}>
                    see more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Block>

      <BlockTitle>Conservative Products</BlockTitle>
      <Block className="horizontal-scroll hide-scrollbar">
        <div style={{ display: 'flex', gap: '10px' }}>
          {products.map((p) => (
            <Card key={`slider-${p.id}`} style={{ minWidth: 220 }}>
              <img
                src={p.images[0]}
                data-pid={p.id}
                alt={p.name}
                style={{ width: '100%', borderRadius: 10 }}
              />
               <div className="price-badge">
  €{p.price.toFixed(2)}
</div>
              <CardContent>
                <div className="font-bold">{p.name}</div>
                <div className="text-color-gray">{p.brand}</div>
                <div className="mt-1">
                </div>
                <div className="flex justify-between mt-2">
                  <Button small fill onClick={() => addToCart(p)}>
                  <Icon f7="cart_fill_badge_plus" className="text-white" />
                                    </Button>
                  <Button small outline klass2 onClick={() => setProductDetailOpen(p)}>
                    see more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Block>

      


      {/* ---------- SHEET (KORPA) ---------- */}
   {/* ---------- CART SHEET (card-style) ---------- */}
<Sheet
  opened={cartOpen}
  onSheetClosed={() => setCartOpen(false)}
  style={{height:'94vh'}}
  backdrop
>
  <Block strong>
    <h2 style={{margin:0}}>My Cart</h2>
  </Block>

  <Block noHairlines>
    {cartItems.length === 0 && (
      <p className="text-align-center">Cart is empty</p>
    )}

    {cartItems.map((it, idx) => (
      <div key={idx} className="cart-card">
        <img src={it.images[0]} alt={it.name} />

        <div>
          <h4>{it.name}</h4>
          <p>{it.subtitle || it.brand}</p>
          <div className="price">
            {it.cur || '€'}
            {(it.price * (it.quantity || 1)).toFixed(2)}
          </div>
        </div>

        {/* qty pill */}
        <div className="stepper-pill">
          <Button small clear onClick={() => updateQty(idx, -1)}>
            <Icon f7="minus" />
          </Button>
          {it.quantity || 1}
          <Button small clear onClick={() => updateQty(idx, +1)}>
            <Icon f7="plus" />
          </Button>
        </div>
      </div>
    ))}
  </Block>

  <div className="cart-footer">
      <div className="summary-total">
        <h4>Total&nbsp;({cartItems.length} item)</h4>
        <h4>€{total.toFixed(2)}</h4>
      </div>

      <Button
        large
        fill
        className="checkout-wide"
        onClick={() => f7.dialog.alert('Checkout flow ➜')}
      >
        Proceed to Checkout
        <Icon f7="arrow_right_circle_fill" />
      </Button>
    </div>
</Sheet>


      {/* ---------- CHECKOUT POPUP ---------- */}
      <Popup
        opened={checkoutOpen}
        onPopupClosed={() => setCheckoutOpen(false)}
      >
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
      <Popup
        opened={!!productDetailOpen}
        onPopupClosed={() => setProductDetailOpen(false)}
        className="safe-areas"
      >
        {productDetailOpen && (
          <Page>
            {/* ► gornji back & bag dugmad */}
            <Button
              small round
              style={{position:'absolute',left:24,top:24,width:48,height:48,background:'#000',color:'#fff',zIndex:5}}
              onClick={()=>setProductDetailOpen(false)}
            >
              <Icon f7="arrowshape_turn_up_left_fill" />
            </Button>
            <Button
              small round
              style={{position:'absolute',right:24,top:24,width:48,height:48,background:'#fff',zIndex:5}}
              onClick={()=>addToCart(productDetailOpen)}
            >
              <Icon f7="bag" color="#000" />
            </Button>

            <Block strong className="mt-6">
              {/* ► Slika + rating badge */}
              <div className="detail-img-box">
                <img
                  src={productDetailOpen.images[0]}
                  alt=""
                  style={{width:'100%',height:260,objectFit:'contain'}}
                />
                <div className="detail-rating">
                  <div>
                    <Icon f7="star_fill" size="16" className="star"/> 4.9
                  </div>
                  <small style={{opacity:.8}}>170 Review</small>
                </div>
              </div>

              {/* ► Naslov + subtitle */}
              <h2 style={{marginTop:24,marginBottom:4}}>{productDetailOpen.name}</h2>
              <p className="color-gray text-small">{productDetailOpen.brand}</p>

              {/* ► Qty stepper */}
              <div className="flex justify-between items-center mt-2">
                <b>Description</b>
                <div className="qty-pill">
                  <Button small clear onClick={()=>f7.toast.create({text:'-',closeTimeout:600}).open()}>
                    <Icon f7="minus" />
                  </Button>
                  1
                  <Button small clear onClick={()=>f7.toast.create({text:'+',closeTimeout:600}).open()}>
                    <Icon f7="plus" />
                  </Button>
                </div>
              </div>

              {/* ► Opis */}
              <p style={{lineHeight:'22px'}}>
                {productDetailOpen.description}
              </p>

              {/* ► SIZE selector */}
              <b>Size</b>
              <div className="flex gap-3 mt-2">
                {productDetailOpen.variants.size.map(s=>(
                  <div key={s} className={`pill-size ${s==='Medium'?'active':''}`}>{s}</div>
                ))}
              </div>

              {/* ► COLOR selector
              {productDetailOpen.variants.color.length>0 && (
                <>
                  <div className="flex gap-2 mt-4">
                    {productDetailOpen.variants.color.map((c,i)=>(
                      <div
                        key={c}
                        className={`color-dot ${i===0?'active':''}`}
                        style={{background:c}}
                      />
                    ))}
                  </div>
                </>
              )} */}

              {/* ► Bottom bar */}
              <div className="bottom-bar">
                <Button className="heart">
                  <Icon f7="heart" size="24" color="#000"/>
                </Button>
                <Button large fill className="cart-btn" onClick={()=>addToCart(productDetailOpen)}>
                  <Icon f7="bag"/>&nbsp;Add to cart
                </Button>
              </div>
            </Block>
          </Page>
        )}
      </Popup>
    </Page>
  );
};

export default BrandNewProductsPage;
