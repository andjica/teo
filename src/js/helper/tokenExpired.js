export function isTokenExpired() {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    if (now >= expiry) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // ako želiš i korisničke podatke da brišeš
      return true;
    }
    return false;
  } catch (e) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true; // Ako token nije validan
  }
}
