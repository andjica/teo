/* src/components/AuctionDetail.jsx */
import React from "react";
import {
  Block,
  BlockTitle,
  Button,
  Icon,
  Link,
  List,
  ListItem,
  Page,
  Popup,
} from "framework7-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { leftTime } from "@/js/helper/countdown";
import { getImageUrl } from "@/js/helper/displayImage";

export default function AuctionDetail({ auction, open, onClose, onBidClick, bidVal, setBidVal }) {
  if (!auction) return null;

  return (
    <Popup opened={open} onPopupClosed={onClose} className="safe-areas">
      <Page>
        <Link
          onClick={onClose}
          style={{ position: "absolute", left: 16, top: 14, zIndex: 5, fontSize: 24, background: "#ede9e2", borderRadius: "20px" }}
        >
          <Icon f7="arrow_left" />
        </Link>

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
              <div style={{
                width: "100%", height: 260, display: "flex", alignItems: "center",
                justifyContent: "center", backgroundColor: "#eee", fontSize: 16, color: "#666"
              }}>
                No images available
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        <div style={{
          background: "#000", color: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32,
          padding: "24px 20px 16px"
        }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>{auction.name}</h1>
        </div>

        <Block strong noHairlines style={{ paddingTop: 0 }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 3px 8px #dccab0", marginTop: -44
          }}>
            {/* <div style={{ width: "48%" }}>
              <div className="text-small color-gray">Starting price</div>
              <b style={{ fontSize: 18 }}>{auction.currency}</b>
            </div> */}
            <div style={{ width: 1, height: 60, background: "#e5e5e5" }} />
            <div style={{ width: "48%" }}>
              <div className="text-small color-gray">Current Bid Price</div>
              {/* <b style={{ fontSize: 18 }}>{auction.currency}{auction.currentBid}</b> */}
              <div className="flex items-center text-small mt-2 color-gray">
                <Icon f7="timer" size={16} className="mr-1" />
                {leftTime(auction.auction_date)} remaining
              </div>
            </div>
          </div>

          <BlockTitle className="mt-4 flex justify-between items-center">
            Live Auction
            <span className="text-small color-gray">{auction.bids?.length || 0} bids</span>
          </BlockTitle>

          <List inset dividers>
            {auction.bids?.slice().reverse().map((b, i) => (
              <ListItem key={i} title={b.user} after={`€${b.amount}`} />
            ))}
          </List>

          <div className="flex gap-2 mt-4 flex-wrap">
            {[0.1, 0.2, 0.3].map((pct) => {
              const inc = Math.round(auction.currentBid * (1 + pct));
              return (
                <Button key={pct} small outline onClick={() => setBidVal(String(inc))}>
                  {auction.currency}{inc}
                </Button>
              );
            })}
            <Button
              small
              outline
              onClick={() =>
                f7.dialog.prompt("Enter custom bid", "Custom bid", (v) => setBidVal(v))
              }
            >
              custom bid
            </Button>
          </div>

          <Button
            large
            fill
            style={{
              backgroundColor: "rgb(55 119 98)",
              position: "fixed", width: "92%", left: "4%", bottom: 17,
              zIndex: 10, borderRadius: 10
            }}
            onClick={onBidClick}
            disabled={!bidVal}
          >
            Place Bid for&nbsp;{auction.currency}{bidVal || auction.currentBid}
          </Button>
        </Block>
      </Page>
    </Popup>
  );
}
