import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/en-US/home",
      permanent: true,
      locale: false,
    },
    // Tự động redirect khi không có locale và không phải là file liên quan đến PWA
    // {
    //   source: "/:path((?!vi-VN|en-US|api(?:/.*)?|manifest\\.json|manifest\\.ts|manifest\\.webmanifest|sw\\.js|icon-192x192\\.png|icon-512x512\\.png|favicon\\.ico|vercel\\.svg|next\\.svg|window\\.svg|file\\.svg|globe\\.svg).*)",
    //   destination: "/en-US/:path",
    //   permanent: true,
    //   locale: false,
    // },
    {
      source: "/:locale(vi-VN|en-US)",
      destination: "/:locale/home",
      permanent: true,
      locale: false,
    },
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cryptologos.cc"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
