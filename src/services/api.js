export function isTokenExpired(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1])); // JWT'nin payload kısmını ayrıştır
  const expiration = payload.exp; // Token'in geçerlilik süresi
  const now = Math.floor(Date.now() / 1000); // Şu anki zaman

  return expiration < now;
}
