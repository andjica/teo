/* src/pages/Settings.jsx */
import React, { useEffect, useState } from "react";
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
  BlockTitle,
  Block,
  Toggle,
  Button,
  f7,
} from "framework7-react";
import "../css/app.less";

export default function Settings() {
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    cardNumber: "",
    cardExp: "",
    cardCvv: "",
    ship: {
      line1: "",
      city: "",
      zip: "",
      country: "",
    },
    newsletter: true,
  });

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountry();
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (user.ship.country) {
      fetchCity(user.ship.country);
    } else {
      setCities([]);
      setUser((prev) => ({
        ...prev,
        ship: { ...prev.ship, city: "" },
      }));
    }
  }, [user.ship.country]);

  const fetchCountry = () => {
    fetch("http://localhost:8000/api/countries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data) => {
        setCountries(data.countries);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        f7.dialog.alert("Failed to fetch countries");
      });
  };

  const fetchCity = (countryId) => {
    if (!countryId) return;

    fetch(`http://localhost:8000/api/cities/${countryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cities");
        return res.json();
      })
      .then((data) => {
        const fetchedCities = data.cities || [];
        setCities(fetchedCities);

        // Optionally auto-select the first city
        if (fetchedCities.length > 0) {
          setUser((prev) => ({
            ...prev,
            ship: { ...prev.ship, city: fetchedCities[0].id },
          }));
        } else {
          setUser((prev) => ({
            ...prev,
            ship: { ...prev.ship, city: "" },
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        f7.dialog.alert("Failed to fetch cities");
      });
  };

  const save = () => {
    localStorage.setItem("is_finished_profile", 1);
    f7.dialog.alert("Settings saved (demo)", "Success", () => {
      console.log(user);
    });
  };

  return (
    <Page name="settings">
      {/* NAVBAR */}
      <Navbar>
        <NavLeft>
          <Link back>
            <Icon f7="arrow_left" />
          </Link>
        </NavLeft>
        <NavTitle sliding>
          <img
            src="assets/images/logo.jpeg"
            alt="logo"
            style={{ height: 60 }}
          />
        </NavTitle>
        <NavRight>
          <Icon f7="gear_alt" />
        </NavRight>
      </Navbar>

      {/* ACCOUNT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <BlockTitle>Account</BlockTitle>
        <List strongIos dividersIos insetMd>
          <ListInput
            label="Full name"
            type="text"
            placeholder="Your name"
            value={localUser.first_name + " " + localUser.last_name}
            onInput={(e) => setUser({ ...user, name: e.target.value })}
          />
          <ListInput
            label="E-mail"
            type="email"
            placeholder="you@mail.com"
            value={localUser.email}
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

        {/* SHIPPING */}
        <BlockTitle>Shipping address</BlockTitle>
        <List strongIos dividersIos insetMd>
          <ListInput
            label="Country"
            type="select"
            value={user.ship.country}
            onChange={(e) =>
              setUser({
                ...user,
                ship: { ...user.ship, country: e.target.value, city: "" },
              })
            }
          >
            <option value="" disabled>
              Choose…
            </option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </ListInput>

          <ListInput
            label="City"
            type="select"
            value={user.ship.city}
            disabled={!user.ship.country}
            onChange={(e) =>
              setUser({ ...user, ship: { ...user.ship, city: e.target.value } })
            }
          >
            <option value="" disabled>
              {user.ship.country ? "Choose…" : "Select country first"}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </ListInput>

          <ListInput
            label="Street / No."
            placeholder="Address line 1"
            value={user.ship.line1}
            onInput={(e) =>
              setUser({
                ...user,
                ship: { ...user.ship, line1: e.target.value },
              })
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
        </List>

        {/* PAYMENT */}
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

        {/* PREFERENCES */}
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

        {/* SAVE BUTTON */}
        <Block strong insetMd>
          <Button large fill type="submit">
            Save settings
          </Button>
        </Block>
      </form>
    </Page>
  );
}
