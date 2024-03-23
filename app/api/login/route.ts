import { matchPassword, getSignJwtToken } from "@/common/auth.middleware";
import { getDBConnection } from "@/config/db/dbconnection";
import { UsersEntity } from "@/models/users/user-entity";
import { loginDto } from "@/types/login";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  // console.log("🚀 ~ response:", response.headers.set())
  const connection = await getDBConnection();
  const data = await request.json();

  const user = await connection.getRepository(UsersEntity);

  const oldUser = await user.findOne({ where: { username: data.username } });

  if (!oldUser) {
    return NextResponse.json({
      message: `username ${data.username} not found `,
      status: 404,
    });
    // throw new Error(`username ${data.username} not find `);
  }
  const isMatch = await matchPassword(data.password, oldUser);

  if (!isMatch) {
    return NextResponse.json({
      message: "Authorization is not Valid!",
      status: 401,
    });
    // throw new Error("Authorization is not Valid!");
  }

  // const token = await getSignJwtToken(oldUser);

  //  const cookietoken = await sendCookiesResponse(token);

  delete oldUser.password;

  return NextResponse.json({
    message: "Login successfully",
    status: 200,
    data: oldUser,
  });
}
