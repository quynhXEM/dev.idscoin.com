import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const fileInput = formData.getAll("files") || [];
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.APP_TOKEN}`);

  const formdata = new FormData();
  formdata.append("folder", process.env.KYC_FOLDER_ID || "");
  fileInput.forEach((file) => {
    formdata.append("files", file as File, "KYC_"+ file?.name);
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const uploadResults = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files`,
    requestOptions
  )
    .then((response) => response.json())
    .then(data => data.data)
    .catch((error) => console.error(error));
  return NextResponse.json(
    { ok: true, results: uploadResults },
    { status: 200 }
  );
}
