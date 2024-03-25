import "reflect-metadata";
import { DataSource } from "typeorm";
import { UsersEntity } from "@/models/users/user-entity";
import { FileEntity } from "@/models/file/file.entity";

const dbConnection = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [UsersEntity, FileEntity],
  subscribers: [],
  migrations: [],
});

export const getDBConnection = async (): Promise<DataSource> => {
  if (!dbConnection.isInitialized) {
    await dbConnection
      .initialize()
      .then(() => {
        console.log("database connection successfully");
      })
      .catch((error) => console.log("Database connection error"));
  }
  return dbConnection;
};
