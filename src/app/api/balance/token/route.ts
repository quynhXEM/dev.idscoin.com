import { NextRequest, NextResponse } from "next/server";
import { getBalance } from "@/libs/token";
import { fetchAppMetadata } from "@/libs/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, chainId, tokenAddress, rpc } = body;
    const metadata = await fetchAppMetadata();
    if (!address) {
      return NextResponse.json({ error: "Thiếu metadata hoặc address" }, { status: 400 });
    }
    // Ưu tiên rpc truyền vào, nếu không có thì lấy từ metadata
    const rpcUrl = rpc || metadata?.custom_fields?.ids_stake_wallet?.rpc_url;
    const balance = await getBalance(address, chainId, tokenAddress, rpcUrl);
    return NextResponse.json({ balance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Lỗi không xác định" }, { status: 500 });
  }
} 