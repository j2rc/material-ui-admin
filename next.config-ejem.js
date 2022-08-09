module.exports = {
  reactStrictMode: true,
  env: {
    "GITHUB_ID": "",
    "GITHUB_SECRET": "",
    "NEXTAUTH_SECRET": "",
    "NEXTAUTH_URL": "",
    "GOOGLE_ID": "",
    "GOOGLE_SECRET": "",
    "DB_URI": "",
    "ZULAR_DB": "",
    "BASE_URL": "",
    "PROFILE_URL": "",
    "CLIENT_ID_GMAIL": "",
    "CLIENT_SECRET_GMAIL": "",
    "ACCESS_TOKEN_GMAIL": "",
    "REFRESH_TOKEN_GMAIL": ""
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `/:path*`,
      },
      {
        source: "/profile",
        destination: `http://localhost:3008/profile`,
      },
      {
        source: "/profile/:path*",
        destination: `http://localhost:3008/profile/:path*`,
      },
      {
        source: "/admin",
        destination: `http://localhost:3004/admin`,
      },
      {
        source: "/admin/:path*",
        destination: `http://localhost:3004/admin/:path*`,
      },
    ];
  }
}