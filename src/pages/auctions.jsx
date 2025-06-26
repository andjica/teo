/* src/pages/Auctions.jsx */
import React, { useState, useEffect } from 'react';
import {
  Page, Navbar, NavLeft, NavRight, NavTitle,
  Link, Icon, Block, BlockTitle, Button,
  Card, CardContent, List,Popup, ListItem, ListInput, f7,
} from 'framework7-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* ---------- kategorije ---------- */
const categories = ['All', 'Equipment', 'Instruments', 'Consumables', 'Used'];

/* ---------- demo aukcije ---------- */
const initAuctions = [
  {
    id: 1,
    category: 'Equipment',
    name: 'Satelec P5 Scaler',
    brand: 'Acteon',
    images: ['https://focusdental.hr/wp-content/uploads/2023/12/surgical-microscope.jpg'],
    endsAt: Date.now() + 1000 * 60 * 60 * 3,
    currentBid: 420,
    bids: [{ user: 'Ana', amount: 420 }],
    currency: '€',
  },
  {
    id: 2,
    category: 'Instruments',
    name: 'Tester 3',
    brand: 'Hu-Friedy',
    images: ['https://focusdental.hr/wp-content/uploads/2023/12/Eighteeth-WEB-Curing-Pen-E1-1-2048x1356.jpg'],
    endsAt: Date.now() + 1000 * 60 * 45,
    currentBid: 32,
    bids: [{ user: 'Marko', amount: 32 }],
    currency: '€',
  },
  {
    id: 3,
    category: 'Consumables',
    name: 'Tester 4',
    brand: 'GC Europe',
    images: ['https://focusdental.hr/wp-content/uploads/2023/12/Eighteeth-Polimerizacijska-lampa_CuringLamp-1-2048x1357.jpg'],
    endsAt: Date.now() + 1000 * 60 * 10,
    currentBid: 14,
    bids: [{ user: 'Ivana', amount: 14 }],
    currency: '€',
  },
];

/* ---------- helper za countdown ---------- */
const leftTime = (t) => {
  const s = Math.max(0, Math.floor((t - Date.now()) / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${ss}`;
};

export default function Auctions() {
  const [aucs, setAucs] = useState(initAuctions);
  const [activeCat, setActiveCat] = useState('All');
  const [tick, setTick] = useState(0);

  /* popup state */
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(null);
  const [bidVal, setBidVal] = useState('');

  /* sekundni rerender za countdown */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* filtriraj */
  const view = aucs.filter(
    (a) => activeCat === 'All' || a.category === activeCat,
  );

  /* handle bid */
  const placeBid = () => {
    const val = parseFloat(bidVal);
    if (isNaN(val) || val <= cur.currentBid) {
      f7.dialog.alert('Bid mora biti veći od trenutne cene.');
      return;
    }
    f7.dialog.confirm(`Potvrdi bid od €${val}?`, () => {
      setAucs((list) =>
        list.map((a) =>
          a.id === cur.id
            ? {
                ...a,
                currentBid: val,
                bids: [...a.bids, { user: 'YOU', amount: val }],
              }
            : a,
        ),
      );
      setCur((c) => ({
        ...c,
        currentBid: val,
        bids: [...c.bids, { user: 'YOU', amount: val }],
      }));
      setBidVal('');
      f7.toast.show({ text: 'Bid placed', closeTimeout: 1500 });
    });
  };
  const [selectedBrand, setSelectedBrand] = useState('All');
  const filteredAuctions = selectedBrand === 'All'
  ? aucs
  : aucs.filter((a) => a.brand === selectedBrand);


  /* ---------- UI ---------- */
  return (
    <Page name="auctions">
      {/* NAVBAR */}
      <Navbar>
        <NavLeft>
          <Link back>
            <Icon f7="arrow_left" />
          </Link>
        </NavLeft>
        <NavTitle sliding>
          <img src="assets/images/logo.png" alt="logo" style={{ height: 57 }} />
        </NavTitle>
        <NavRight>
          <Icon f7="coq" />
        </NavRight>
      </Navbar>

      {/* FILTER */}
            <BlockTitle>Filter by Brand</BlockTitle>
            <Block className="brand-scroll hide-scrollbar">
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
      
  
      <Block className="category-scroll hide-scrollbar">
        <div
          className="scroll-cat-row hide-scrollbar"
          style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: 10 }}
        >
          {categories.map((c) => (
            <Button
              key={c}
              small
              outline={activeCat !== c}
              fill={activeCat === c}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </Block>

      {/* GRID */}
      <BlockTitle>{activeCat} auctions</BlockTitle>
      <Block className="grid grid-cols-2 grid-gap">
        {view.map((a) => (
          <Card key={a.id} style={{ minWidth: 120 }}>
            <img
              src={a.images[0]}
              alt={a.name}
              style={{ width: '100%', objectFit: 'cover', borderRadius: 10 }}
            />
            <CardContent>
              <div className="font-bold auction-title">{a.name}</div>
              <div className="text-color-gray text-small">{a.brand}</div>

              <div className="text-small mt-1">
                Ends in <b>{leftTime(a.endsAt)}</b>
              </div>

              <div className="flex justify-between items-end mt-2">
                <div>
                  <div className="text-small">Current</div>
                  <div className="font-bold">
                    {a.currency}
                    {a.currentBid}
                  </div>
                </div>
                <Button small outline onClick={() => { setCur(a); setOpen(true); }}>
                  Enter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </Block>

      {/* --------- POPUP DETAIL --------- */}
      {/* ---------- POP-UP DETAIL ---------- */}
      <Popup opened={open} onPopupClosed={() => setOpen(false)} className="safe-areas">
  {cur && (
    <Page>
      {/* BACK strelica */}
      <Link
        onClick={() => setOpen(false)}
        style={{ position: 'absolute', left: 16, top: 14, zIndex: 5, fontSize: 24 }}
      >
        <Icon f7="arrow_left" />
      </Link>

      {/* Swiper slike */}
      <Swiper pagination modules={[Pagination]}>
        {cur.images.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt="" style={{ width: '100%', height: 260, objectFit: 'cover' }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CRNI header */}
      <div
        style={{
          background: '#000',
          color: '#fff',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: '24px 20px 16px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24 }}>{cur.name}</h1>
      </div>

      <Block strong noHairlines style={{ paddingTop: 0 }}>
        {/* INFO box */}
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 3px 8px #dccab0',
            marginTop: -44,
          }}
        >
          {/* Starting price */}
          <div style={{ width: '48%' }}>
            <div className="text-small color-gray">Starting price</div>
            <b style={{ fontSize: 18 }}>
              {cur.currency}
              {cur.bids[0].amount}
            </b>
          </div>

          {/* divider */}
          <div style={{ width: 1, height: 60, background: '#e5e5e5' }} />

          {/* Current bid */}
          <div style={{ width: '48%' }}>
            <div className="text-small color-gray">Current Bid Price</div>
            <b style={{ fontSize: 18 }}>
              {cur.currency}
              {cur.currentBid}
            </b>
            <div className="flex items-center text-small mt-2 color-gray">
              <Icon f7="timer" size={16} className="mr-1" />
              {leftTime(cur.endsAt)} remaining
            </div>
          </div>
        </div>

        {/* LISTA bid-ova */}
        <BlockTitle className="mt-4 flex justify-between items-center">
          Live Auction
          <span className="text-small color-gray">{cur.bids.length} bids made</span>
        </BlockTitle>

        <List inset dividers>
          {cur.bids
            .slice()
            .reverse()
            .map((b, i) => (
              <ListItem key={i} title={b.user} after={`€${b.amount}`} />
            ))}
        </List>

        {/* QUICK-BID dugmad */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[0.1, 0.2, 0.3].map((pct) => {
            const inc = Math.round(cur.currentBid * (1 + pct));
            return (
              <Button key={pct} small outline onClick={() => setBidVal(String(inc))}>
                {cur.currency}
                {inc}
              </Button>
            );
          })}
          <Button
            small
            outline
            onClick={() =>
              f7.dialog.prompt('Enter custom bid', 'Custom bid', (v) => setBidVal(v))
            }
          >
            custom bid
          </Button>
        </div>

        {/* PLACE bid */}
        <Button
  large
  fill
  style={{
    backgroundColor: 'rgb(55 119 98)',   //  ✔ camelCase + bez duplikata
    position: 'fixed',
    width: '92%',
    left: '4%',                   // centrirano (100-92)/2
    bottom: 17,
    zIndex: 10,  
    borderRadius: 10                 // da sigurno bude iznad sadržaja
  }}
  onClick={placeBid}
  disabled={!bidVal}
>
  Place Bid for&nbsp;{cur.currency}
  {bidVal || cur.currentBid}
</Button>

      </Block>
    </Page>
  )}
</Popup>


    </Page>
  );
}
