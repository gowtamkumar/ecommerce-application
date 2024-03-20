import "reflect-metadata";
import { NextResponse } from "next/server";
import { UsersEntity } from "@/models/users/user-entity";
import { getDBConnection } from "@/config/db/dbconnection";
import { hashedPassword } from "@/common/auth.middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function POST(request: Request) {
  const data = await request.json();
  // console.log("🚀 ~ data:", data)
  const connection = await getDBConnection();

  const user = await connection.getRepository(UsersEntity);

  const newUser = user.create({
    ...data,
    password: await hashedPassword(data.password),
  });
  await user.save(newUser);

  return NextResponse.json({
    message: "Create new User",
    status: 200,
    data: data,
  });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({
      status: 201,
      message: "Authorized faild",
    });
  }

  const connection = await getDBConnection();
  const user = await connection.getRepository(UsersEntity);

  const result = await user.find();

  return NextResponse.json({
    status: 200,
    message: "Get a users",
    length: 100,
    data: result,
  });
}
