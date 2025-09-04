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

  const now = new Date();

  // 0h0p hôm nay
  const day = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).toISOString();
  // 0h0p đầu tháng hiện tại
  const month = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  ).toISOString();

  const [
    reponse_all,
    response_vip,
    response_kyc,
    reponse_day,
    response_month,
    resonse_withdraw,
  ] = await Promise.all([
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type][_in]=referral_bonus,referral_kyc_bonus&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type][_in]=referral_bonus&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type][_in]=referral_kyc_bonus&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[date_created][_gte]=${day}&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type][_in]=referral_bonus,referral_kyc_bonus&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[date_created][_gte]=${month}&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type][_in]=referral_bonus,referral_kyc_bonus&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[amount][_lte]=0&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=withdraw&aggregate[sum]=amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      })),
  ]);

  if (
    reponse_all.ok &&
    response_vip.ok &&
    response_kyc.ok &&
    reponse_day.ok &&
    response_month.ok &&
    resonse_withdraw.ok
  ) {
    return NextResponse.json({
      ok: true,
      result: {
        all: reponse_all.result,
        vip: response_vip.result,
        kyc: response_kyc.result,
        day: reponse_day.result,
        month: response_month.result,
        withdraw: resonse_withdraw.result,
      },
    });
  }
};
