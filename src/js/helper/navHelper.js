
import { f7 } from 'framework7-react';

export function goTo(path) {
  try {
    f7.views.main.router.navigate(path, {
      reloadAll: true,
      clearPreviousHistory: true,
      animate: false, // možeš isključiti animaciju
    });
    console.log("Navigated to:", path);
  } catch (err) {
    console.error("Navigation error:", err);
    // fallback ako router pukne → direktan hash change
    window.location.hash = `#${path}`;
  }
}
