import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const chakraPetch = localFont({
  src: [
    {
      path: "../../../public/font/ChakraPetch-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/font/ChakraPetch-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../public/font/ChakraPetch-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/font/ChakraPetch-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/font/ChakraPetch-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/font/ChakraPetch-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../public/font/ChakraPetch-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/font/ChakraPetch-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../../public/font/ChakraPetch-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/font/ChakraPetch-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-chakra-petch",
  display: "swap",
});
