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
    `${process.env.NEXT_PUBLIC_API_URL}/items/member?filter[status][_in]=active&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[referrer_id]=${id}&aggregate[count]=*`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      return NextResponse.json({
        ok: true,
        result: result.data[0].count,
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
