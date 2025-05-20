import mysql from "mysql2/promise";
import config from "./config/config";

const { host, dbName, dbUser, dbPassword } = config;

export const db = mysql.createPool({
  host: host,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
