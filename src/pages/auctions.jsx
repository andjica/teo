/* src/pages/Auctions.jsx */
import Category from "@/components/Category";
import { get } from "@/js/helper/api";
import { leftTime } from "@/js/helper/countdown";
import { getImageUrl } from "@/js/helper/displayImage";
import {
  Block,
  BlockTitle,
  Button,
  Card,
  CardContent,
  f7,
  Icon,
  Link,
  List,
  ListInput,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Popup,
} from "framework7-react";
import React, { useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { isToday } from "@/js/helper/customeDate";
import AuctionDetail from "@/components/auction/AuctionDetail";
import Footer from "@/components/Footer";

/* ---------- demo aukcije ---------- */
// const initAuctions = [
//   {
//     id: 1,
//     category: 'Equipment',
//     name: 'Satelec P5 Scaler',
//     brand: 'Acteon',
//     images: ['https://focusdental.hr/wp-content/uploads/2023/12/surgical-microscope.jpg'],
//     endsAt: Date.now() + 1000 * 60 * 60 * 3,
//     currentBid: 420,
//     bids: [{ user: 'Ana', amount: 420 }],
//     currency: '€',
//   },
// ];

export default function Auctions() {
  const [aucs, setAucs] = useState([]);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [tick, setTick] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("All");

  /* popup state */
  const [open, setOpen] = useState(false);
  const [bidVal, setBidVal] = useState("");

  /* sekundni rerender za countdown */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchAuction();
    fetchCategory();
  }, []);

  const fetchAuction = async () => {
    try {
      const response = await get("auctions");
      setAucs(response.data);
    } catch (err) {
      console.error("Error fetching auctione:", err.message);
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

  const fetchAuctionById = async (auctionId) => {
    try {
      const response = await get(`auction/${auctionId}`);
      setCurrentAuction(response.data);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching auctione by id:", err.message);
    }
  }

  /* filtriraj */
  const view = useMemo(() => {
    return aucs.filter((a) => activeCat === "All" || a.category === activeCat);
  }, [aucs, activeCat]);

  /* handle bid */
  const placeBid = () => {
    const val = parseFloat(bidVal);
    if (isNaN(val) || val <= currentAuction.currentBid) {
      f7.dialog.alert("The bid must be higher than the current price.");
      return;
    }
    f7.dialog.confirm(`Confirm bid from €${val}?`, () => {
      setAucs((list) =>
        list.map((a) =>
          a.id === currentAuction.id
            ? {
                ...a,
                currentBid: val,
                bids: [...(a.bids || []), { user: "YOU", amount: val }],
              }
            : a
        )
      );
      setCurrentAuction((c) => ({
        ...c,
        currentBid: val,
        bids: [...(c.bids || []), { user: "YOU", amount: val }],
      }));
      setBidVal("");
      f7.toast.show({ text: "Bid placed", closeTimeout: 1500 });
    });
  };
  
  // const filteredAuctions =
  //   selectedBrand === "All"
  //     ? aucs
  //     : aucs.filter((a) => a.brand === selectedBrand);

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
          <Category categories={categories} />
        </div>
      </Block>

      {/* GRID */}
      <BlockTitle>{activeCat} auctions</BlockTitle>

      <Block
        className="auctions-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          padding: "0 12px",
        }}
      >
        {view.map((a) => (
          <Card
            key={a.id}
            style={{
              width: "calc(50% - 8px)", // 2 u redu, sa razmakom (gap/2)
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "transform 0.2s",
              position: "relative",
            }}
            className="hover:scale-105"
          >
            <img
              src={getImageUrl(a.images[0]?.image_url)}
              alt={a.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
              }}
            />

            <CardContent style={{ padding: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{a.name}</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>
                {a.description}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: "-36px",
                  right: "0",
                  fontSize: 13,
                  marginTop: 8,
                  backgroundColor: isToday(a.auction_date)
                    ? "#4CAF50"
                    : "transparent",
                  color: isToday(a.auction_date) ? "#fff" : "#000",
                  padding: isToday(a.auction_date) ? "4px 8px" : 0,
                  borderRadius: isToday(a.auction_date) ? 8 : 0,
                  display: "inline-block",
                }}
              >
                <b>{leftTime(a.auction_date)}</b>
              </div>

              <div
                className="flex justify-between items-end mt-4"
                style={{ alignItems: "center" }}
              >
                <Button
                  small
                  fill
                  style={{
                    backgroundColor: "#377762",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 14,
                  }}
                  onClick={() => fetchAuctionById(a.id)}
                >
                  Enter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </Block>
      {/* --------- POPUP DETAIL --------- */}
      {/* ---------- POP-UP DETAIL ---------- */}
      <AuctionDetail
        auction={currentAuction}
        open={open}
        onClose={() => setOpen(false)}
        onBidClick={placeBid}
        bidVal={bidVal}
        setBidVal={setBidVal}
      />
      <Footer />
    </Page>
  );
}
