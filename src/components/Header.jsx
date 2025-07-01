import {
  Icon,
  Link,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
} from "framework7-react";

const Header = ({ cartItems = [], setCartOpen }) => {
  return (
    <Navbar className="custom-navbar">
      <NavLeft>
        <Link href="/settings/">
          <Icon f7="gear_alt" />
        </Link>
      </NavLeft>

      <NavTitle sliding className="custom-navbar-title">
        <img
          src="assets/images/logo.png"
          alt="Teo Market Logo"
          style={{ height: "50px" }}
        />
      </NavTitle>

      <NavRight>
        <Link onClick={() => setCartOpen(true)} className="cart-icon-wrapper">
          <Icon f7="cart_fill_badge_plus" className="color-blue" />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </Link>
      </NavRight>
    </Navbar>
  );
};

export default Header;
