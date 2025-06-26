/* src/pages/Settings.jsx */
import React, { useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Icon,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockTitle,
  Block,
  Toggle,
  Button,
  f7,
} from 'framework7-react';

export default function Settings() {
  /* demo state */
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    birth: '',
    cardNumber: '',
    cardExp: '',
    cardCvv: '',
    ship: {
      line1: '',
      city: '',
      zip: '',
      country: '',
    },
    newsletter: true,
  });

  const save = () =>
    f7.dialog.alert('Settings saved (demo)', 'Success', () =>
      console.log(user),
    );

  return (
    <Page name="settings">
      {/* NAVBAR – isti kao na drugim ekranima */}
      <Navbar>
        <NavLeft>
          <Link back>
            <Icon f7="arrow_left" />
          </Link>
        </NavLeft>
        <NavTitle sliding>
          <img src="assets/images/logo.jpeg" alt="logo" style={{ height: 60 }} />
        </NavTitle>
        <NavRight>
          <Icon f7="gear_alt" />
        </NavRight>
      </Navbar>

      {/* ------------ ACCOUNT ------------ */}
      <BlockTitle>Account</BlockTitle>
      <List strongIos dividersIos insetMd>
        <ListInput
          label="Full name"
          type="text"
          placeholder="Your name"
          value={user.name}
          onInput={(e) => setUser({ ...user, name: e.target.value })}
        />
        <ListInput
          label="E-mail"
          type="email"
          placeholder="you@mail.com"
          value={user.email}
          onInput={(e) => setUser({ ...user, email: e.target.value })}
        />
        <ListInput
          label="Phone"
          type="tel"
          placeholder="+381 65 123-456"
          value={user.phone}
          onInput={(e) => setUser({ ...user, phone: e.target.value })}
        />
        <ListInput
          label="Birth date"
          type="date"
          value={user.birth}
          onInput={(e) => setUser({ ...user, birth: e.target.value })}
        />
      </List>

      {/* ------------ SHIPPING ------------ */}
      <BlockTitle>Shipping address</BlockTitle>
      <List strongIos dividersIos insetMd>
        <ListInput
          label="Street / No."
          placeholder="Address line 1"
          value={user.ship.line1}
          onInput={(e) =>
            setUser({ ...user, ship: { ...user.ship, line1: e.target.value } })
          }
        />
        <ListInput
          label="City"
          placeholder="City"
          value={user.ship.city}
          onInput={(e) =>
            setUser({ ...user, ship: { ...user.ship, city: e.target.value } })
          }
        />
        <ListInput
          label="ZIP"
          type="number"
          placeholder="Postal code"
          value={user.ship.zip}
          onInput={(e) =>
            setUser({ ...user, ship: { ...user.ship, zip: e.target.value } })
          }
        />
        <ListInput
          label="Country"
          type="select"
          value={user.ship.country}
          onChange={(e) =>
            setUser({ ...user, ship: { ...user.ship, country: e.target.value } })
          }
        >
          <option value="" disabled>
            Choose…
          </option>
          <option>Serbia</option>
          <option>Croatia</option>
          <option>Slovenia</option>
          <option>Bosnia &amp; Herz.</option>
        </ListInput>
      </List>

      {/* ------------ PAYMENT ------------ */}
      <BlockTitle>Payment card</BlockTitle>
      <List strongIos dividersIos insetMd>
        <ListInput
          label="Card number"
          type="text"
          placeholder="•••• •••• •••• ••••"
          value={user.cardNumber}
          onInput={(e) => setUser({ ...user, cardNumber: e.target.value })}
        />
        <ListInput
          label="Expiry"
          placeholder="MM / YY"
          value={user.cardExp}
          onInput={(e) => setUser({ ...user, cardExp: e.target.value })}
        />
        <ListInput
          label="CVV"
          type="password"
          placeholder="•••"
          value={user.cardCvv}
          onInput={(e) => setUser({ ...user, cardCvv: e.target.value })}
        />
      </List>

      {/* ------------ PREFERENCES ------------ */}
      <BlockTitle>Preferences</BlockTitle>
      <List strongIos dividersIos insetMd>
        <ListItem
          title="Subscribe to newsletter"
          after={
            <Toggle
              checked={user.newsletter}
              onToggle={(e) =>
                setUser({ ...user, newsletter: e.target.checked })
              }
            />
          }
        />
      </List>

      {/* ------------ SAVE BUTTON ------------ */}
      <Block strong insetMd>
        <Button large fill onClick={save}>
          Save settings
        </Button>
      </Block>
    </Page>
  );
}
