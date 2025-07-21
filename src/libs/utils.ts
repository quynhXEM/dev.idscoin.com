import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchAppMetadata() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/app/${process.env.NEXT_PUBLIC_APP_ID}`,
    requestOptions
  )
    .then((data) => data.json())
    .then((data) => data.data);
  return response;
}

export async function getCountryCodeFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.ipinfo.io/lite/${ip}?token=68adae36b3207a`
    ).then((data) => data.json());

    return res?.country_code;
  } catch {
    return null;
  }
}

export const timeFormat = (time: string) => {
  const d = new Date(time);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export function roundToFirstSignificantDecimal(value: number | string) {
  if (value === 0) return 0;

  const abs = Math.abs(Number(value));
  const digits = Math.floor(Math.log10(abs));
  const decimals = digits >= 0 ? 1 : Math.abs(digits) + 1;

  return Number(Number(value).toFixed(decimals));
}
