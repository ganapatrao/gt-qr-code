import "dotenv/config";

const {
  PORT = PORT,
  DB_URL = DB_URL,
  DB_PORT = DB_PORT,
  DB_NAME = DB_NAME,
} = process.env;

const DB_CONNECTION_URL = `${DB_URL}:${DB_PORT}/${DB_NAME}`;

export const DB_CONFIG = {
  DB_URL: DB_CONNECTION_URL || "mongodb://127.0.0.1:27017/profiler",
  PORT,
};
