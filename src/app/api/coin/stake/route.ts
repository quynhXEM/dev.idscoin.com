import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { amount, lockPeriod, walletAddress, txHash } = await request.json();
    const response = await fetch(`${process.env.API_URL}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        lock_period: lockPeriod,
        wallet_address: walletAddress,
        tx_hash: txHash,
      }),
    });
    return NextResponse.json(
      { result: response, ok: response.ok },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 400 });
  }
};
