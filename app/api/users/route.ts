import { NextResponse } from "next/server";
import { UsersEntity } from "@/models/users/user-entity";
import { getDBConnection } from "@/config/db/dbconnection";
import { hashedPassword } from "@/middlewares/auth.middleware";
import { UserValidationSchema } from "@/models/users/validation";
import { CreateUserDto } from "@/models/users/dtos";

export async function POST(request: Request) {
  const connection = await getDBConnection();
  const data = await request.json();

  const validation = UserValidationSchema.safeParse(data);

  if (!validation.success) {
    return NextResponse.json({
      status: 401,
      message: validation.error.formErrors,
    });
  }

  const user = connection.getRepository(UsersEntity);

  const userChecking = await user.findOne({
    where: { username: data.username },
  });

  if (userChecking) {
    return NextResponse.json({
      message: "Username already exists",
      status: 401,
    });
  }

  const emailChecking = await user.findOne({
    where: { email: data.email },
  });

  if (emailChecking) {
    return NextResponse.json({
      message: "email already exists",
      status: 401,
    });
  }

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
