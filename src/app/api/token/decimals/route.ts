import { NextRequest, NextResponse } from "next/server";
import { getDecimals } from "@/libs/token";
import { fetchAppMetadata } from "@/libs/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chainId, tokenAddress, rpc } = body;
    const metadata = await fetchAppMetadata();
    // Ưu tiên rpc truyền vào, nếu không có thì lấy từ metadata
    const rpcUrl = rpc || metadata?.custom_fields?.ids_stake_wallet?.rpc_url;
    const decimals = await getDecimals({chainId, tokenAddress, rpc: rpcUrl});
    return NextResponse.json({ decimals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Lỗi không xác định" }, { status: 500 });
  }
} 