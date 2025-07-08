import { Link, Toolbar } from "framework7-react";
import React from "react";

const Footer = () => {
  return (
    <Toolbar tabbar icons bottom>
      <Link href="/new-products/">
        <i className="icon custom-icon">
          <img src="/assets/images/product.png" alt="brandnew" />
        </i>
        <span className="tabbar-label color-black">Brand New</span>
      </Link>

      <Link  href="/auctions/">
        <i className="icon custom-icon">
          <img src="/assets/images/auction.png" alt="Auctions" />
        </i>
        <span className="tabbar-label color-black">Auctions</span>
      </Link>

      <Link href="/second-hand-products/">
        <i className="icon custom-icon">
          <img src="/assets/images/second-hand.png" alt="2nd Hand" />
        </i>
        <span className="tabbar-label color-black">2nd Hand</span>
      </Link>
    </Toolbar>
  );
};

export default Footer;
