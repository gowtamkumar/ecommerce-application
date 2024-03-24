import { NextResponse } from "next/server";
import { UsersEntity } from "@/models/users/user-entity";
import { getDBConnection } from "@/config/db/dbconnection";
import { hashedPassword } from "@/middlewares/auth.middleware";
import { CreateUserDto } from "@/models/users/dtos/createUser.dto";

export async function POST(request: Request) {
  const data = await request.json();
  const connection = await getDBConnection();

  const user = await connection.getRepository(UsersEntity);

  const newUser = user.create({
    ...data,
    password: await hashedPassword(data.password),
  } as CreateUserDto);

  await user.save(newUser);

  return NextResponse.json({
    message: "Create new User",
    status: 200,
    data: data,
  });
}

export async function GET(request: Request) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json({
  //     status: 201,
  //     message: "Authorized faild",
  //   });
  // }

  const connection = await getDBConnection();
  const user = await connection.getRepository(UsersEntity);

  const result = await user.find({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return NextResponse.json({
    status: 200,
    message: "Get a users",
    length: 100,
    data: result,
  });
}
