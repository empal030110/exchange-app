const ACCESS_TOKEN_COOKIE_KEY = "access_token";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function setAccessTokenCookie(token: string) {
  const secure = location.protocol === "https:" ? "Secure;" : "";

  document.cookie = `${ACCESS_TOKEN_COOKIE_KEY}=${encodeURIComponent( token )}; Max-Age=${ONE_DAY_IN_SECONDS}; Path=/; SameSite=Strict; ${secure}`;
}