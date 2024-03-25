import { NextRequest, NextResponse } from "next/server";
import { Upload } from "@/middlewares/fileUpload";
import { getDBConnection } from "@/config/db/dbconnection";
import { FileEntity } from "@/models/file/file.entity";
import { CreateFileDto } from "@/models/file/dtos/createFile.dto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const connection = await getDBConnection();
  const fileEntity = await connection.getRepository(FileEntity);

  // Get the file from the form data
  const getFile = formData.getAll("file");

  const file = getFile as File[];

  const results = [] as any;

  if (file.length) {
    try {
      file.map(async (item) => {
        const saveFile = await Upload(item);
        const createFile = fileEntity.create(saveFile as CreateFileDto);
        await fileEntity.save(createFile);
      });
    } catch (err) {
      console.log("err");
    }
  }

  return NextResponse.json({
    message: "New file Create",
    status: 200,
    data: results,
  });
}

// export async function GET(request: Request) {
//   // const session = await getServerSession(authOptions);

//   // if (!session) {
//   //   return NextResponse.json({
//   //     status: 201,
//   //     message: "Authorized faild",
//   //   });
//   // }

//   const connection = await getDBConnection();
//   const user = await connection.getRepository(UsersEntity);

//   const result = await user.find({
//     select: {
//       id: true,
//       name: true,
//       username: true,
//       email: true,
//       role: true,
//       status: true,
//     },
//   });

//   return NextResponse.json({
//     status: 200,
//     message: "Get a users",
//     length: 100,
//     data: result,
//   });
// }
