import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  host: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  jwtSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.DB_HOST || "localhost",
  dbName: process.env.DB_NAME || "expressdb",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
