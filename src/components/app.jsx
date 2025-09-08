// // src/components/app.jsx
// import React, { useEffect } from "react";
// import { getDevice } from "framework7/lite-bundle";
// import {
//   App,
//   Views,
//   View,
//   f7,
//   f7ready,
// } from "framework7-react";

// import routes from "../js/routes";
// import store from "../js/store";
// import { isTokenExpired } from "../js/helper/tokenExpired";

// // Public rute koje su vidljive gostima NA WEBU
// const PUBLIC_WEB_PREFIXES = [
//   "/",
//   "/home/",
//   "/product/",
//   "/catalog/",
//   "/new-products/",
//   "/second-hand-products/",
//   "/auctions/",
//   "/auction/",
//   "/about/",
//   "/payment-success/",
// ];

// // Rute koje su uvek zaštićene (login + verified)
// const PROTECTED_PREFIXES = [
//   "/checkout/",
//   "/settings/",
//   "/orders/",
//   "/profile/",
//   "/messages/",
//   "/rooms/",
//   "/auction/",
//   "/payment-success/",
// ];

// const MyApp = () => {
//   const device = getDevice();

//   // Odredi tip uređaja
//   const lsDeviceType = localStorage.getItem("device_type");
//   const inferredDeviceType =
//     lsDeviceType || (device.cordova ? "mobile" : "web");

//   // Ako backend vrati hash rutu, ovo je pokupi
//   const rawHash = window.location.hash || "";
//   const currentPath = rawHash.replace(/^#/, ""); 
//   // npr "#/auctions/5/success" -> "/auctions/5/success"

//   // Odredi startUrl
//   const startUrl = currentPath
//     ? currentPath
//     : inferredDeviceType === "web"
//     ? "/home/"
//     : "/login/";

//   const f7params = {
//     name: "Teo",
//     theme: "auto",
//     store,
//     routes,
//     input: {
//       scrollIntoViewOnFocus: device.cordova,
//       scrollIntoViewCentered: device.cordova,
//     },
//     statusbar: {
//       iosOverlaysWebView: true,
//       androidOverlaysWebView: false,
//     },
//     // view: {

//     //   pushState: true,          // koristi browser history
//     //   pushStateSeparator: "#!", // clean hash (izgleda /#!/auctions/5)
//     // },
//   };

//   const guard = async () => {
//     const router = f7?.views?.main?.router;
//     if (!router) return;

//     const current = router.currentRoute?.path || "";

//     const tokenRaw = localStorage.getItem("token");
//     const userRaw = localStorage.getItem("user");
//     const isVerifiedLS = localStorage.getItem("is_verified") === "1";
//     const deviceType =
//       localStorage.getItem("device_type") || inferredDeviceType;

//     let user = null;
//     try {
//       user = userRaw ? JSON.parse(userRaw) : null;
//     } catch {}
//     const computedVerified = isVerifiedLS || !!user?.email_verified_at;

//     // --- WEB: pusti public rute bez login-a ---
//     if (deviceType === "web") {
//       const isPublic = PUBLIC_WEB_PREFIXES.some((p) =>
//         current.startsWith(p)
//       );
//       const isProtected = PROTECTED_PREFIXES.some((p) =>
//         current.startsWith(p)
//       );
//       if (isPublic && !isProtected) return;
//     }

//     // --- MOBILE ili WEB protected ---
//     if (!tokenRaw || isTokenExpired()) {
//       const allowWhenNoToken =
//         current === "/login/" ||
//         current === "/register/" ||
//         current === "/verify-code/" ||
//         current.startsWith("/verify-email") ||
//         current === "/verify-success/";

//       if (!allowWhenNoToken) {
//         router.navigate("/login/", { reloadCurrent: true });
//       }
//       return;
//     }

//     if (!computedVerified) {
//       if (deviceType === "mobile") {
//         if (current !== "/verify-code/") {
//           router.navigate("/verify-code/", { reloadCurrent: true });
//         }
//       } else {
//         if (!current.startsWith("/verify-email")) {
//           const hash =
//             user?.email_verification_token ||
//             localStorage.getItem("verification_hash") ||
//             "0";
//           const id = user?.id || 0;
//           router.navigate(`/verify-email/${id}/${hash}`, {
//             reloadCurrent: true,
//           });
//         }
//       }
//       return;
//     }
//   };

//   useEffect(() => {
//     f7ready(() => {
//       guard();
//       f7.views.main.router.on("routeChange", guard);
//     });
//     return () => {
//       try {
//         f7?.views?.main?.router?.off?.("routeChange", guard);
//       } catch {}
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <App {...f7params}>
//       <Views className="safe-areas">
//         <View id="main-view" main url={startUrl} />
//       </Views>
//     </App>
//   );
// };

// export default MyApp;
// src/components/app.jsx
// import React, { useEffect } from "react";
// import { getDevice } from "framework7/lite-bundle";
// import { App, Views, View, f7, f7ready } from "framework7-react";
// import routes from "../js/routes";
// import store from "../js/store";
// import { isTokenExpired } from "../js/helper/tokenExpired";

// const PUBLIC_WEB_PREFIXES = [
//   "/",
//   "/home/",
//   "/product/",
//   "/catalog/",
//   "/new-products/",
//   "/second-hand-products/",
//   "/auctions/",
//   "/auction/",
//   "/about/",
//   "/payment-success/",
// ];

// const PROTECTED_PREFIXES = [
//   "/checkout/",
//   "/settings/",
//   "/orders/",
//   "/profile/",
//   "/messages/",
//   "/rooms/",
//   "/auction/",
//   "/payment-success/",
// ];

// const MyApp = () => {
//   const device = getDevice();

//   // hash -> path (npr "#/auctions/5" -> "/auctions/5")
//   const rawHash = window.location.hash || "";
//   const currentPath = rawHash.replace(/^#/, "");

//   const inferredDeviceType = localStorage.getItem("device_type") || (device.cordova ? "mobile" : "web");

//   // <<< KORISTIMO ga stvarno
//   const startUrl = currentPath ? currentPath : (inferredDeviceType === "web" ? "/home/" : "/login/");

//   const f7params = {
//     name: "Teo",
//     theme: "auto",
//     store,
//     routes,
//     stackPages: true,
//     input: {
//       scrollIntoViewOnFocus: device.cordova,
//       scrollIntoViewCentered: device.cordova,
//     },
//     statusbar: { iosOverlaysWebView: true, androidOverlaysWebView: false },
//     // Ako želiš "čiste" URL-ove na webu, odkomentariši:
//     // view: { browserHistory: true, browserHistorySeparator: '' },
//   };

//   const guard = () => {
//     const router = f7?.views?.main?.router;
//     if (!router) return;

//     // Ako je prazno (inicijalno), uzmi startUrl da ne padne na Not found
//     const current = router.currentRoute?.path || startUrl;

//     const tokenRaw = localStorage.getItem("token");
//     const userRaw = localStorage.getItem("user");
//     const isVerifiedLS = localStorage.getItem("is_verified") === "1";
//     let user = null;
//     try { user = userRaw ? JSON.parse(userRaw) : null; } catch {}
//     const computedVerified = isVerifiedLS || !!user?.email_verified_at;

//     // WEB: pusti public rute
//     const isPublic = PUBLIC_WEB_PREFIXES.some((p) => current.startsWith(p));
//     const isProtected = PROTECTED_PREFIXES.some((p) => current.startsWith(p));

//     if (inferredDeviceType === "web" && isPublic && !isProtected) return;

//     if (!tokenRaw || isTokenExpired()) {
//       const allow = ["/login/","/register/","/verify-code/"].some((p)=>current.startsWith(p)) ||
//                     current.startsWith("/verify-email") ||
//                     current === "/verify-success/";
//       if (!allow) router.navigate("/login/", { reloadCurrent: true });
//       return;
//     }

//     if (!computedVerified) {
//       if (inferredDeviceType === "mobile") {
//         if (current !== "/verify-code/") router.navigate("/verify-code/", { reloadCurrent: true });
//       } else {
//         if (!current.startsWith("/verify-email")) {
//           const hash = user?.email_verification_token || localStorage.getItem("verification_hash") || "0";
//           const id = user?.id || 0;
//           router.navigate(`/verify-email/${id}/${hash}`, { reloadCurrent: true });
//         }
//       }
//     }
//   };

// // useEffect(() => {
// //   f7ready(() => {
// //     try {
// //       const r = f7?.views?.main?.router;
// //       if (r && r.currentRoute?.path !== startUrl) {
// //         r.navigate(startUrl, { reloadCurrent: true, ignoreCache: true });
// //       }
// //     } catch {}

// //     guard();
// //     f7.views.main.router.on("routeChange", guard);
// //   });
// //   return () => {
// //     try { f7?.views?.main?.router?.off?.("routeChange", guard); } catch {}
// //   };
// // }, []);


//   return (
//     <App {...f7params}>
//       <Views className="safe-areas">
//      <View id="main-view" main url="/" stackPages />


//       </Views>
//     </App>
//   );
// };

// export default MyApp;
// src/components/app.jsx
import React, { useEffect } from "react";
import { getDevice } from "framework7/lite-bundle";
import { App, Views, View, f7, f7ready } from "framework7-react";

import routes from "../js/routes";
import store from "../js/store";
import { isTokenExpired } from "../js/helper/tokenExpired";

const PUBLIC_WEB_PREFIXES = [
  "/",
  "/home/",
  "/product/",
  "/catalog/",
  "/new-products/",
  "/second-hand-products/",
  "/auctions/",
  "/auction/",
  "/about/",
  "/payment-success/",
];

const PROTECTED_PREFIXES = [
  "/checkout/",
  "/settings/",
  "/orders/",
  "/profile/",
  "/messages/",
  "/rooms/",
  "/auction/",
  "/payment-success/",
];

const MyApp = () => {
  const device = getDevice();

  // hash -> path (za web: "#/auctions/5" → "/auctions/5")
  const rawHash = window.location.hash || "";
  const currentPath = rawHash.replace(/^#/, "");

  const inferredDeviceType =
    localStorage.getItem("device_type") || (device.cordova ? "mobile" : "web");

  const startUrl = currentPath
    ? currentPath
    : inferredDeviceType === "web"
    ? "/home/"
    : "/login/";

  // --- F7 params ---
  const f7params = {
    name: "Teo",
    theme: "auto",
    store,
    routes,
    stackPages: true, // da stranice budu pravilno current
    // Za web koristi browserHistory, za apk hash routing
    view: device.cordova
      ? {} // Cordova -> hash routing
      : { browserHistory: true, browserHistorySeparator: "" }, // Web -> clean URL
    input: {
      scrollIntoViewOnFocus: device.cordova,
      scrollIntoViewCentered: device.cordova,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    view: {
  pushState: false
}
  };

  // Guard
  const guard = () => {
    const router = f7?.views?.main?.router;
    if (!router) return;

    const current = router.currentRoute?.path || startUrl;

    const tokenRaw = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    const isVerifiedLS = localStorage.getItem("is_verified") === "1";

    let user = null;
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {}

    const computedVerified = isVerifiedLS || !!user?.email_verified_at;

    const isPublic = PUBLIC_WEB_PREFIXES.some((p) => current.startsWith(p));
    const isProtected = PROTECTED_PREFIXES.some((p) => current.startsWith(p));

    if (inferredDeviceType === "web" && isPublic && !isProtected) return;

    if (!tokenRaw || isTokenExpired()) {
      const allow =
        ["/login/", "/register/", "/verify-code/"].some((p) =>
          current.startsWith(p)
        ) ||
        current.startsWith("/verify-email") ||
        current === "/verify-success/";
      if (!allow) router.navigate("/login/", { reloadCurrent: true });
      return;
    }

    if (!computedVerified) {
      if (inferredDeviceType === "mobile") {
        if (current !== "/verify-code/") {
          router.navigate("/verify-code/", { reloadCurrent: true });
        }
      } else {
        if (!current.startsWith("/verify-email")) {
          const hash =
            user?.email_verification_token ||
            localStorage.getItem("verification_hash") ||
            "0";
          const id = user?.id || 0;
          router.navigate(`/verify-email/${id}/${hash}`, {
            reloadCurrent: true,
          });
        }
      }
    }
  };

  useEffect(() => {
    f7ready(() => {
      guard();
      f7.views.main.router.on("routeChange", guard);
    });
    return () => {
      try {
        f7?.views?.main?.router?.off?.("routeChange", guard);
      } catch {}
    };
  }, []);

  return (
    <App {...f7params}>
      
        <View main url={startUrl} />

    </App>
  );
};

export default MyApp;
