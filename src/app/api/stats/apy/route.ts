import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed,canceled&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_in&aggregate[avg]=stake_apy`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
        return NextResponse.json({
            ok: true,
            result: result.data[0].avg
        })
    })
    .catch((error) => {
        return NextResponse.json({
            ok: false,
            result: error
        })
    });
};
