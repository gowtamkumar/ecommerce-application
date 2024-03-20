import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { params } = context;

  return NextResponse.json({
    status: 200,
    message: "success",
    data: { name: "single data" },
  });
}

export async function DELETE(request: Request, context: any) {
  const { params } = context;
  console.log("Hello Delete");

  return NextResponse.json({
    starus: 200,
    message: "Delete Successfull",
    data: {},
  });
}

export async function PATCH(request: Request, context: any) {
  const { params } = context;
  console.log("🚀 ~ params:", params);
  console.log("Hello PUT");

  return NextResponse.json({
    starus: 200,
    message: "Update a single product Successfull",
    data: {},
  });
}
