import mysql from "mysql2/promise";
import "dotenv/config";
import fs from "fs/promises";

const dbConfig = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  multipleStatements: true,
};

if (process.env.MYSQL_CERT) {
  dbConfig.ssl = { ca: await fs.readFile("DigiCertGlobalRootCA.crt.pem") };
}

const dbConnection = await mysql.createConnection(dbConfig);

export default dbConnection;
