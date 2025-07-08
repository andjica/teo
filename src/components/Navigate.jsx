import {
  Icon,
  Link,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
} from "framework7-react";
import React from "react";

const Navigate = () => {
  return (
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
  );
};

export default Navigate;
