import { Link, Toolbar } from "framework7-react";
import React from "react";

const Footer = () => {
  return (
    <Toolbar tabbar icons bottom>
      <Link tabLink="#view-catalog">
        <i className="icon custom-icon">
          <img src="/assets/images/product.png" alt="brandnew" />
        </i>
        <span className="tabbar-label">Brand New</span>
      </Link>

      <Link tabLink="#view-auctions">
        <i className="icon custom-icon">
          <img src="/assets/images/auction.png" alt="Auctions" />
        </i>
        <span className="tabbar-label">Auctions</span>
      </Link>

      <Link tabLink="#view-home">
        <i className="icon custom-icon">
          <img src="/assets/images/second-hand.png" alt="2nd Hand" />
        </i>
        <span className="tabbar-label">2nd Hand</span>
      </Link>
    </Toolbar>
  );
};

export default Footer;
