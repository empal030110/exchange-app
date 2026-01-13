const ACCESS_TOKEN_COOKIE_KEY = "access_token";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function getAccessTokenCookie(): string | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ACCESS_TOKEN_COOKIE_KEY) {
      return value ? decodeURIComponent(value) : null;
    }
  }
  
  return null;
}

export function setAccessTokenCookie(token: string) {
  const secure = location.protocol === "https:" ? "Secure;" : "";

  document.cookie = `${ACCESS_TOKEN_COOKIE_KEY}=${encodeURIComponent( token )}; Max-Age=${ONE_DAY_IN_SECONDS}; Path=/; SameSite=Strict; ${secure}`;
}

export function clearAccessTokenCookie() {
  const secure = location.protocol === 'https:' ? 'Secure;' : ''

  document.cookie = `${ACCESS_TOKEN_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Strict; ${secure}`
}