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

  const fetchData = async (url: string) => {
    return await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => ({
        ok: true,
        result: result.data[0]?.sum?.amount,
      }))
      .catch((error) => ({
        ok: false,
        result: error,
      }));
  };

  const [stake_dont_claw, stake_dont_claw_24h, stake_dont_claw_week, stake_dont_claw_month, stake_in, stake_out, stake_reward] =
    await Promise.all([
      // stake_dont_claw
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_reward&aggregate[sum]=amount`
      ),
      // stake_dont_claw_24h
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[amount][_gte]=0&filter[date_created][_gte]=${new Date(new Date().setHours(0,0)).toISOString()}&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_reward&aggregate[sum]=amount`
      ),
      // stake_dont_claw_week
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[amount][_gte]=0&filter[date_created][_gte]=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_reward&aggregate[sum]=amount`
      ),
      // stake_dont_claw_month
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[amount][_gte]=0&filter[date_created][_gte]=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_reward&aggregate[sum]=amount`
      ),
      // stake_in
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_in&aggregate[sum]=amount`
      ),
      // stake_out
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_out&aggregate[sum]=amount`
      ),
      // stake_reward
      await fetchData(
        `${process.env.NEXT_PUBLIC_API_URL}/items/txn?filter[status][_in]=completed&filter[amount][_gte]=0&filter[member_id]=${id}&filter[app_id]=${process.env.NEXT_PUBLIC_APP_ID}&filter[type]=stake_reward&aggregate[sum]=amount`
      ),
    ]);

  if (stake_in.ok) {
    return NextResponse.json({
      ok: true,
      result: {
        stake_dont_claw: stake_dont_claw.result,
        stake_dont_claw_24h: stake_dont_claw_24h.result,
        stake_dont_claw_week: stake_dont_claw_week.result,
        stake_dont_claw_month: stake_dont_claw_month.result,
        stake_in: stake_in.result,
        stake_out: stake_out.result,
        stake_reward: stake_reward.result,
      },
    });
  }
};
