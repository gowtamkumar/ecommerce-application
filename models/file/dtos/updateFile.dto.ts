import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFileDto {
  push(item: File) {
    throw new Error("Method not implemented.");
  }
  fieldname?: string;
  originalname!: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename!: string;
  path?: string;
  size!: number;
}
