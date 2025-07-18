import { NextResponse } from "next/server";
import { directus } from "@/libs/directus";
import {
  createItem,
  deleteItem,
  readItem,
  readItems,
  updateItem,
  withToken,
  readMe,
} from "@directus/sdk";

const APP_TOKEN = process.env.APP_TOKEN || "";
export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const type = data?.type ?? "";
    const collection = data?.collection ?? "";
    const id = data?.id ?? "";
    const params = data?.params ?? "";
    const items = data?.items ?? null;
    const admin = data?.admin ?? true;
    const access_token = APP_TOKEN;
    if (type) {
      let res;
      switch (type) {
        case "readMe":
          res = await directus.request(withToken(access_token || "", readMe()));
          break;
        case "readItem":
          res = await directus.request(
            withToken(APP_TOKEN, readItem(collection, id, params))
          );
          break;

        case "readItems":
          res = await directus.request(
            withToken(APP_TOKEN, readItems(collection, params))
          );
          break;

        case "updateItem":
          res = await directus.request(
            withToken(APP_TOKEN, updateItem(collection, id, items))
          );
          break;

        case "createItem":
          res = await directus.request(
            withToken(APP_TOKEN, createItem(collection, items, params))
          );
          break;

        case "deleteItem":
          res = await directus.request(
            withToken(APP_TOKEN, deleteItem(collection, items))
          );
          break;
      }

      if (res) {
        return NextResponse.json({ ok: true, result: res });
      }
    }

    return NextResponse.json({
      error: "DIRECTUS_REQUEST_ERROR",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error API directus:", error);
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return NextResponse.json(
        { error: "Directus Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      error: error,
    });
  }
};
