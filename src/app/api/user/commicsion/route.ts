import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { id } = await request.json();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const reponse =  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=referral_bonus&aggregate[sum]=amount`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return NextResponse.json({
        ok: true,
        result: result.data[0]?.sum?.amount,
      });
    })
    .catch((error) => {
      return NextResponse.json({
        ok: false,
        result: error,
      });
    });

    return reponse;
};
