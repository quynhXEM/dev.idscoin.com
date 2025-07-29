import { sendToken } from "@/libs/token";
import { fetchAppMetadata } from "@/libs/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const metadata = await fetchAppMetadata()
    const body = await req.json();
    const { amount, rpc, token_address, to, chain_id } = body;
    const privateKey = metadata?.custom_fields.usdt_payment_wallets[chain_id].private_key;
    if (!amount || !rpc || !token_address || !privateKey || !to || !chain_id) {
      return NextResponse.json({ success: false, error: "web3ChainDifferent" }, { status: 400 });
    }
    const txHash = await sendToken({ amount, rpc, token_address, privateKey, to, chain_id });
    return NextResponse.json({ success: true, txHash });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "walletErrorReport" }, { status: 500 });
  }
}
