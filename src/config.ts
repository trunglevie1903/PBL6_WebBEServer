import dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';

// Load the environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Config {
  port: string | number;
  databaseUrl: string;
  jwtSecret: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
}

// Define the config object and export it
export const config: Config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'mysecretkey',
  DB_NAME: process.env.DB_NAME || "PBL6",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "12345678",
  DB_HOST: process.env.DB_HOST || "localhost"
};

export const sequelize: Sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS, {
    host: config.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);