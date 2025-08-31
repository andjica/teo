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
import "@/css/app.less";
import { get, post } from "@/js/helper/api";
import { validateUserSettings } from "@/js/helper/form-validation/user-settings";

const Settings = ({ f7router }) => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const [originalUser, setOriginalUser] = useState(null);
  const localhostUser = JSON.parse(localStorage.getItem("user")) || {};
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch countries on mount
  useEffect(() => {
    if (token) {
      fetchCountry();
      fetchUserDetail();
    }
  }, [token]);

  // Fetch cities when country changes
  useEffect(() => {
    if (user.country) {
      fetchCity(user.country);
    } else {
      setCities([]);
      setUser((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [user.country]);

  const fetchCountry = () => {
    get("countries")
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

    get(`cities/${countryId}`)
      .then((data) => {
        const fetchedCities = data.cities || [];
        setCities(fetchedCities);
      })
      .catch(() => {
        f7.dialog.alert("Failed to fetch cities");
      });
  };

  const fetchUserDetail = () => {
    setIsLoading(true);
    get("user-info")
      .then((data) => {
        const fetchedUser = data.data || {};
        const newUser = {
          first_name: fetchedUser.first_name || localhostUser?.first_name || "",
          last_name: fetchedUser.last_name || localhostUser?.last_name || "",
          email: fetchedUser.email || localhostUser?.email || "",
          phone: fetchedUser.phone || "",
          address: fetchedUser.address || "",
          country: fetchedUser.country_id || "",
          city: fetchedUser.city_id || "",
          zip: fetchedUser.zip_code || "",
          is_finished_profile: 1,
        };
        setUser(newUser);
        setOriginalUser(newUser);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        f7.dialog.alert("Failed to fetch user");
        f7router.navigate('/home/');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isUserChanged = () => {
    if (!originalUser) return true; // ako nema originalnih podataka, smatramo da ima promena
    return JSON.stringify(user) !== JSON.stringify(originalUser);
  };

  const uploadUser = () => {
    const errors = validateUserSettings(user);

    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join("<br />");
      f7.dialog.alert(errorMessage, "Validation Error");
      return;
    }

    if (!isUserChanged()) {
      f7.dialog.alert("You don't have change data in your profile");
      return;
    }

    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      country_id: user.country,
      city_id: user.city,
      zip_code: user.zip,
    };

    post("user-info", payload)
      .then((data) => {
        console.log(data);
        f7.dialog.alert("Settings saved", "Success");
        console.log("Saved user data: ", payload);
        // localStorage.setItem("user", data);
        localStorage.setItem("is_finished_profile", "1");
        setOriginalUser(user);

        f7router.navigate("/home/");
      })
      .catch((err) => {
        console.error("Error saving user:", err);
        localStorage.setItem("is_finished_profile", "0");
        f7.dialog.alert("Failed to save user");
      });
  };

  const logOut = () => {
    f7router.navigate("/login/");
    localStorage.clear();
  };

  return (
    <Page name="user-settings" className="page-settings">
      {/* Navbar */}
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
        {/* <NavRight>
          <Icon f7="gear_alt" />
        </NavRight> */}
      </Navbar>

      {/* Form */}

      {isLoading ? (
        <Block strong inset className="text-center">
          <p>Loading user data...</p>
        </Block>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadUser();
          }}
        >
          {/* Account Info */}
          <BlockTitle>Account</BlockTitle>
          <List>
            <ListInput
              id="first_name"
              label="First name"
              type="text"
              placeholder="Your first name"
              value={user.first_name}
              input={{ disabled: true }}
              onInput={(e) => setUser({ ...user, first_name: e.target.value })}
            />
            <ListInput
              id="last_name"
              label="Last name"
              type="text"
              placeholder="Your last name"
              value={user.last_name}
              input={{ disabled: true }}
              onInput={(e) => setUser({ ...user, last_name: e.target.value })}
            />
            <ListInput
              id="email"
              label="E-mail"
              type="email"
              placeholder="you@mail.com"
              value={user.email}
              input={{ disabled: true }}
              onInput={(e) => setUser({ ...user, email: e.target.value })}
            />
            <ListInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="+381 65 123-456"
              value={user.phone}
              onInput={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </List>

          {/* Address */}
          <BlockTitle>Address</BlockTitle>
          <List>
            <ListInput
              id="country"
              label="Country"
              type="select"
              value={user.country}
              onChange={(e) =>
                setUser({ ...user, country: e.target.value, city: "" })
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
              id="city"
              label="City"
              type="select"
              value={user.city}
              disabled={!user.country}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
            >
              <option value="" disabled>
                {user.country ? "Choose…" : "Select country first"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </ListInput>

            <ListInput
              label="Street / No."
              placeholder="Address line"
              value={user.address}
              onInput={(e) => setUser({ ...user, address: e.target.value })}
            />
            <ListInput
              label="ZIP"
              type="number"
              placeholder="Postal code"
              value={user.zip}
              onInput={(e) => setUser({ ...user, zip: e.target.value })}
            />
          </List>

          {/* Buttons */}
          <Block strong insetMd>
            <Button fill large className="login-button" type="submit">
              Save
            </Button>
            <Button onClick={logOut} color="red">
              Log Out
            </Button>
          </Block>
        </form>
      )}
    </Page>
  );
};

export default Settings;

