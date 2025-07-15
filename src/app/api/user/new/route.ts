import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { email, username, password, wallet_address, referrer_id } =
      await request.json();
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer R1tv5lkpuGlrxgJ4_ZwUoVk06F2b01QD"
    );
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      status: "active",
      NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID || "db2a722c-59e2-445c-b89e-7b692307119a",
      email,
      username,
      password,
      wallet_address,
      referrer_id,
    });

    const response = await fetch(`${process.env.API_URL}/items/member`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
    });
    return NextResponse.json(
      { result: response, ok: response.ok },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 400 });
  }
};
