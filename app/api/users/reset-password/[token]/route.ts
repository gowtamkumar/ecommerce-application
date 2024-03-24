// import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { UsersEntity } from "@/models/users/user-entity";
import { getDBConnection } from "@/config/db/dbconnection";
import { uuid } from "uuidv4";
import { sendEmail } from "@/middlewares/sendMail.middleware";
import { MailOptions } from "@/models/users/dtos/mailOptions.dto";
import { forgotPasswordDto } from "@/models/users/dtos/forgot.dto";
import { userCreateDto } from "@/models/users/dtos/createUser.dto";
import { hashedPassword } from "@/middlewares/auth.middleware";

export async function PATCH(request: NextRequest, context: any) {
  const { token } = context;

  const connection = await getDBConnection();
  const data = await request.json();
  const newPassword = await hashedPassword(data.password);
  // const origin = request.nextUrl.origin;
  // const token = uuid();
  const user = connection.getRepository(UsersEntity);

  const finduser = await user.findOneBy({
    resetToken: token,
    resetTokenExpire: "24/03/2024",
  });
  console.log("🚀 ~ finduser:", finduser)

  // resetToken: string;
  // resetTokenExpire: string;

  if (!finduser) {
    return NextResponse.json({
      status: 201,
      message: "Invalid or expired reset token",
    });
  }

  // // token expires after one hour
  const updatedata = {
    resetToken: token,
    resetTokenExpire: "24/03/2024",
  } as forgotPasswordDto;

  const result = user.merge(
    finduser as userCreateDto,
    { password: newPassword, resetToken: null, resetTokenExpire: null } as any
  );
  await user.save(result);

  return NextResponse.json({
    message: "Reset password successfully",
    status: 200,
    // data: forgotPassData,
  });
}
