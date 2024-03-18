import { NextResponse } from "next/server";


export async function GET(request: Request, context: any) {
  return NextResponse.json({
    status: 200,
    message: "success",
    data: {name: "gowtam kumar"},
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log("req");

  return NextResponse.json({
    status: 201,
    message: "success",
    data: data,
  });
}
