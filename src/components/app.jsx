// src/components/app.jsx
import React, { useEffect } from 'react';
import { getDevice } from 'framework7/lite-bundle';
import {
  App,
  Views,
  View,
  f7,
  f7ready,
} from 'framework7-react';

import routes from '../js/routes';
import store from '../js/store';
import { isTokenExpired } from '../js/helper/tokenExpired';

// Public rute koje su vidljive gostima NA WEBU
const PUBLIC_WEB_PREFIXES = [
  '/',                // ako koristiš root kao landing
  '/home/',
  '/product/',
  '/catalog/',
  '/new-products/',
  '/second-hand-products/',
  '/auctions/',
  '/about/',
];

// Rute koje su uvek zaštićene (login + verified) na obe platforme
const PROTECTED_PREFIXES = [
  '/checkout/',
  '/settings/',
  '/orders/',
  '/profile/',
  '/messages/',
  '/rooms/',
];

const MyApp = () => {
  const device = getDevice();

  // Odredi tip uređaja: prvo LS, pa heuristika (Cordova => mobile, ostalo => web)
  const lsDeviceType = localStorage.getItem('device_type');
  const inferredDeviceType = lsDeviceType || (device.cordova ? 'mobile' : 'web');

  // Start URL: web -> /home/ (gosti vide shop), mobile -> /login/ (zatvoreno dok se ne prijavi)
  const startUrl = inferredDeviceType === 'web' ? '/home/' : '/login/';

  const f7params = {
    name: 'Teo',
    theme: 'auto',
    store,
    routes,
    input: {
      scrollIntoViewOnFocus: device.cordova,
      scrollIntoViewCentered: device.cordova,
    },
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  const guard = async () => {
    const router = f7?.views?.main?.router;
    if (!router) return;

    const current = router.currentRoute?.path || '';

    const tokenRaw        = localStorage.getItem('token');
    const userRaw         = localStorage.getItem('user');
    const isVerifiedLS    = localStorage.getItem('is_verified') === '1';
    const deviceType      = localStorage.getItem('device_type') || inferredDeviceType;

    let user = null;
    try { user = userRaw ? JSON.parse(userRaw) : null; } catch {}
    const computedVerified = isVerifiedLS || !!user?.email_verified_at;

    // --- WEB: pusti public rute bez login-a ---
    if (deviceType === 'web') {
      const isPublic = PUBLIC_WEB_PREFIXES.some(p => current.startsWith(p));
      const isProtected = PROTECTED_PREFIXES.some(p => current.startsWith(p));
      // Ako je public i nije protected -> pusti bez obzira na token/verifikaciju
      if (isPublic && !isProtected) return;
    }

    // Odavde: ili je MOBILE (nema public), ili WEB ali ide na protected rutu

    // 1) Nema (validnog) tokena → traži login (dozvoli login/register/verify rute)
    if (!tokenRaw || isTokenExpired()) {
      const allowWhenNoToken =
        current === '/login/' ||
        current === '/register/' ||
        current === '/verify-code/' ||
        current.startsWith('/verify-email') ||
        current === '/verify-success/';

      if (!allowWhenNoToken) {
        router.navigate('/login/', { reloadCurrent: true });
      }
      return;
    }

    // 2) Nije verifikovan → prebaci na odgovarajući verify flow
    if (!computedVerified) {
      if (deviceType === 'mobile') {
        if (current !== '/verify-code/') {
          router.navigate('/verify-code/', { reloadCurrent: true });
        }
      } else {
        if (!current.startsWith('/verify-email')) {
          const hash = user?.email_verification_token
            || localStorage.getItem('verification_hash')
            || '0';
          const id = user?.id || 0;
          router.navigate(`/verify-email/${id}/${hash}`, { reloadCurrent: true });
        }
      }
      return;
    }

    // 3) Verifikovan → ne radi prisilne redirecte; Login/ekrani vode dalji tok
  };

  useEffect(() => {
    f7ready(() => {
      guard();
      f7.views.main.router.on('routeChange', guard);
    });
    return () => {
      try { f7?.views?.main?.router?.off?.('routeChange', guard); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <App {...f7params}>
      <Views tabs className="safe-areas">
        <View main url={startUrl} />
      </Views>
    </App>
  );
};

export default MyApp;
