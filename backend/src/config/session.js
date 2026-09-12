export const SESSION_COOKIE = "task_session";
export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
  maxAge: 86400000,
});
export const clearSession = (res) => {
  const options = cookieOptions();
  delete options.maxAge;
  res.clearCookie(SESSION_COOKIE, options);
};
export const sessionToken = (req) =>
  req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(SESSION_COOKIE + "="))
    ?.slice(SESSION_COOKIE.length + 1);
