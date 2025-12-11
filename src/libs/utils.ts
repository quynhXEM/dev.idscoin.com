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

  const [chains, metadata] = await Promise.all([
    fetchChain(),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/app/${process.env.NEXT_PUBLIC_APP_ID}`,
      requestOptions
    )
      .then((data) => data.json())
      .then((data) => data.data),
  ]);

  return {
    chains,
    ...metadata,
  };
}

export async function fetchTokenQuote(chain_list: string) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("X-API-Gateway-Currency", "CREDIT");
    myHeaders.append(
      "X-API-Gateway-Url",
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${chain_list}`
    );
    myHeaders.append(
      "X-API-Gateway-Description",
      "CoinMarketCap: Get latest market quote of crypto"
    );
    myHeaders.append("Authorization", `Bearer ${process.env.SOC_TOKEN}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SOC_URL}/api/gateway/get`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        
        return result.data
      });

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function fetchChain() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/app_chain?filter[status]=published&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[chain_id][type]=evm&limit=10&fields=chain_id.id,chain_id.name,chain_id.symbol,chain_id.native_currency,chain_id.rpc_url,chain_id.explorer_url,chain_id.icon,app_chain_token.name,app_chain_token.symbol,app_chain_token.decimals,app_chain_token.address,app_chain_token.icon`,
    requestOptions
  )
    .then((data) => data.json())
    .then((data) => data.data);

  const chain_list = response?.map((item: any) => item.chain_id.symbol)
    .join(",");
  const token_quote = await fetchTokenQuote(chain_list);
  if (token_quote) {
    const result = response.map((item: any) => ({
      ...item,
      token_quote_usd:
        token_quote?.[item.chain_id.symbol]?.quote?.USD?.price ?? 1,
    }));

    return result;
  }

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

  return roundDownDecimal(Number(value), decimals) || 0;
}

/**
 * Định dạng số với dấu phân cách phần nghìn, tối đa 2 số thập phân nếu có phần thập phân.
 * @param value Số hoặc chuỗi số cần định dạng
 * @param options Tuỳ chọn: giữ lại phần thập phân hay không (default: true)
 */
export function formatNumber(
  value: number | string,
  options?: { decimal?: boolean }
): string {
  if (value === null || value === undefined || value === "") return "0";
  const num = Number(value);
  if (isNaN(num)) return String(value);
  if (options?.decimal === false) {
    return roundDownDecimal(num).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
  }
  return roundDownDecimal(num).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

export function roundDownDecimal(number: number, decimalPlaces: number = 2) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(number * factor) / factor;
}

export function isValidEmail(email: string) {
  const hasPlus = email.includes("+");
  const domainOk = email.toLowerCase().endsWith("@xem.edu.vn");

  if (!hasPlus) return true; // Không có + => hợp lệ
  if (hasPlus && domainOk) return true; // Có + nhưng domain hợp lệ
  return false; // Còn lại => không hợp lệ
}

export const getFee = (chainId : any, chain: any, fee: number) => {
  const chaininfo = chain.find((opt: any) => opt.chain_id.id == Number(chainId))
  const deploy_fee = fee / chaininfo.token_quote_usd
  return deploy_fee
}