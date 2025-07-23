import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getCountryCodeFromIp } from "@/libs/utils";

const LOCALE_COOKIE = "NEXT_LOCALE";
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  VN: "vi-VN",
  US: "en-US",
};

function getLocaleFromCountry(countryCode: string | null): "vi-VN" | "en-US" {
  if (!countryCode) return routing.defaultLocale;
  return (
    (COUNTRY_LOCALE_MAP[countryCode] as "vi-VN" | "en-US") ||
    routing.defaultLocale
  );
}

export default async function middleware(req: NextRequest) {
  const pathLocale = req.nextUrl.pathname.split("/")[1] as
    | "vi-VN"
    | "en-US"
    | undefined;

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value as
    | "vi-VN"
    | "en-US"
    | undefined;

  if (!cookieLocale) {
    // Nếu không có, lấy từ IP
    let ip = req.headers.get("x-forwarded-for") || "";
    if (ip.includes(",")) ip = ip.split(",")[0];
    let countryCode: string | null = null;
    try {
      countryCode = await getCountryCodeFromIp(ip);
    } catch {}
    const locale = getLocaleFromCountry(countryCode);

    const newPath = req.nextUrl.pathname.replace(
      /^\/(vi-VN|en-US)/,
      `/${locale}`
    );
    const url = req.nextUrl.clone();
    url.pathname = newPath;
    // Tạo response redirect và set cookie luôn
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  // 1. Nếu cookieLocale tồn tại và hợp lệ, luôn ưu tiên sử dụng
  if (cookieLocale && routing.locales.includes(cookieLocale)) {
    // Nếu pathLocale khác cookieLocale, redirect sang đúng locale
    if (pathLocale && pathLocale !== cookieLocale) {
      const newPath = req.nextUrl.pathname.replace(
        /^\/(vi-VN|en-US)/,
        `/${cookieLocale}`
      );
      const url = req.nextUrl.clone();
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    // Nếu đã đúng locale trên URL, tiếp tục như cũ
    const res = createMiddleware({
      ...routing,
      defaultLocale: cookieLocale,
    })(req);
    res.cookies.set(LOCALE_COOKIE, cookieLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }

  // 2. Nếu không có cookieLocale, lấy từ pathLocale nếu hợp lệ
  if (pathLocale && routing.locales.includes(pathLocale)) {
    const res = createMiddleware({
      ...routing,
      defaultLocale: pathLocale,
    })(req);
    res.cookies.set(LOCALE_COOKIE, pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  }
}

export const config = {
  matcher: [
    // Chỉ match các path gốc hoặc có locale, loại trừ các static/api/well-known
    "/((?!_next|api|.well-known|favicon.ico|sw.js).*)",
    "/(vi-VN|en-US)/:path*",
  ],
};
