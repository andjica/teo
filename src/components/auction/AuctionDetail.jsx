import React, { useMemo } from "react";
import {
  Block,
  BlockTitle,
  Button,
  Icon,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  f7,
} from "framework7-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { leftTime } from "@/js/helper/countdown";
import { getImageUrl } from "@/js/helper/displayImage";

export default function AuctionDetail({ auction, bidVal, setBidVal }) {
  const currency = "€";

  // --- lokalni bidovi ---
  const localStoredBids = useMemo(() => {
    const all = JSON.parse(localStorage.getItem("bidAuctions") || "[]");
    return all.filter((b) => b.auctionId === auction?.id);
  }, [auction?.id]);

  // --- trenutna cena ---
  const currentBid = useMemo(() => {
    const allBids = [...(auction?.bids || []), ...localStoredBids];
    return allBids.length
      ? Math.max(...allBids.map((b) => parseFloat(b.amount)))
      : parseFloat(auction?.base_price || 0);
  }, [auction?.bids, localStoredBids, auction?.base_price]);

  if (!auction) return null;

  // --- custom bid prompt ---
  const showCustomBidPrompt = () => {
    const dialog = f7.dialog.create({
      title: "Custom bid",
      text: `Enter amount higher than ${currency}${currentBid}`,
      content: `
        <div class="dialog-input-field">
          <input type="number" placeholder="Enter amount" class="dialog-input" />
        </div>
      `,
      buttons: [
        { text: "Cancel" },
        {
          text: "OK",
          bold: true,
          onClick: (dialog) => {
            const input = dialog.el.querySelector("input").value;
            const value = parseFloat(input);
            if (!input || isNaN(value)) {
              f7.dialog.alert("Please enter a valid number.");
              return false;
            }
            if (value <= currentBid) {
              f7.dialog.alert(
                `Value must be greater than ${currency}${currentBid}`
              );
              return false;
            }
            setBidVal(String(value));
          },
        },
      ],
      on: {
        opened() {
          dialog.el.querySelector("input").focus();
        },
      },
    });
    dialog.open();
  };

  // --- bidanje ---
  const handleBidClick = async () => {
    try {
      const amountToSend = parseFloat(bidVal || currentBid);
      const res = await fetch(
        `http://164.92.209.125:8000/api/place-bid/${auction.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: amountToSend }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.status === 402 && data.requires_payment_setup) {
        f7.dialog.confirm(
          "Before bidding, please insert your payment card.",
          async () => {
            const setupRes = await fetch(
              "http://164.92.209.125:8000/api/payment/create-setup",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  context: "auction",
                  entity_id: auction.id,
                }),
              }
            );
            const setupData = await setupRes.json();
            if (setupRes.ok && setupData.checkout_url) {
              window.location.href = setupData.checkout_url;
            } else {
              f7.dialog.alert("Could not start payment setup.");
            }
          }
        );
        return;
      }

      if (!res.ok) {
        f7.dialog.alert(data.message || "Something went wrong.");
        return;
      }

      if (data.success && data.data) {
        const newBid = {
          auctionId: auction.id,
          name: auction.name,
          amount: data.data.amount,
          user: data.data.user?.first_name
            ? `${data.data.user.first_name} ${data.data.user.last_name}`
            : data.data.user || "You",
          time: data.data.placed_at,
        };

        auction.bids = [newBid, ...(auction.bids || [])];
        f7.dialog.alert("Your bid was placed successfully.");
        setBidVal("");
      }
    } catch (err) {
      console.error(err);
      f7.dialog.alert("Error placing bid.");
    }
  };

  return (
    <>
      <Navbar>
        <NavLeft>
            <Link
              back
              onClick={(e) => {
                e.preventDefault();
                if (f7.views.main.router.history.length > 1) {
                  f7.views.main.router.back();
                } else {
                  f7.views.main.router.navigate('/auctions/');
                }
              }}
            >
              <Icon f7="arrow_left" /> Back
            </Link>
          </NavLeft>
        <NavTitle>{auction.name}</NavTitle>
        <NavRight>
          <Link>
            <Icon f7="ellipsis" />
          </Link>
        </NavRight>
      </Navbar>

      {/* Slike */}
      <Swiper pagination modules={[Pagination]}>
        {auction.images?.length > 0 ? (
          auction.images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={getImageUrl(src?.image_url || src)}
                alt={`Auction image ${i + 1}`}
                style={{ width: "100%", height: 260, objectFit: "cover" }}
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="flex items-center justify-center w-full h-[260px] bg-gray-200 text-gray-600 text-lg">
              No images available
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Info o aukciji */}
      <div className="bg-black text-white rounded-t-[32px] p-6">
        <h1 className="text-2xl font-semibold">{auction.name}</h1>
      </div>

      {/* Bid info */}
      <Block strong noHairlines className="pt-0">
        <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-md -mt-11">
          <div className="w-[48%]">
            <div className="text-sm text-gray-500">Starting price</div>
            <p className="text-lg font-medium">
              {currency}
              {auction.base_price}
            </p>
          </div>
          <div className="w-px h-[60px] bg-gray-300" />
          <div className="w-[48%]">
            <div className="text-sm text-gray-500">Current Bid Price</div>
            <b className="text-lg">
              {currency}
              {currentBid}
            </b>
            <div className="flex items-center text-sm mt-2 text-gray-500">
              <Icon f7="timer" size={16} className="mr-1" />
              {leftTime(auction.auction_date)} remaining
            </div>
          </div>
        </div>

        {/* Bid lista */}
        <BlockTitle className="mt-4 flex justify-between items-center">
          Live Auction
          <span className="text-sm text-gray-500">
            {auction.bids?.length || 0} bids
          </span>
        </BlockTitle>

        <List inset dividers>
          {[...(auction.bids || []), ...localStoredBids]
            .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
            .map((b, i) => (
              <ListItem
                key={i}
                title={
                  typeof b.user === "object"
                    ? `${b.user.first_name || ""} ${b.user.last_name || ""}`
                    : b.user || "Unknown"
                }
                after={`€${b.amount}`}
                footer={
                  b.placed_at
                    ? new Date(b.placed_at).toLocaleString()
                    : b.time
                    ? new Date(b.time).toLocaleString()
                    : null
                }
              />
            ))}
        </List>

        {/* Dugmići za povećanje */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[0.05, 0.1, 0.15].map((pct) => {
            const inc = Math.round(currentBid * (1 + pct));
            return (
              <Button
                key={pct}
                small
                outline
                onClick={() => setBidVal(String(inc))}
              >
                {currency}
                {inc}
              </Button>
            );
          })}
          <Button small outline onClick={showCustomBidPrompt}>
            custom bid
          </Button>
        </div>

        {/* Dugme place bid */}
        <Button
          large
          fill
          className="bg-emerald-700 hover:bg-emerald-800 rounded-lg fixed w-[92%] left-[4%] bottom-4 z-10"
          onClick={handleBidClick}
          disabled={!bidVal}
        >
          Place Bid for {currency}
          {bidVal || currentBid}
        </Button>
      </Block>
    </>
  );
}
