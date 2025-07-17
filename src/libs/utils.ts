import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchAppMetadata() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/app/${process.env.NEXT_PUBLIC_APP_ID}`,
    requestOptions
  ).then(data => data.json())
  .then(data => data.data)
  return response;
}
