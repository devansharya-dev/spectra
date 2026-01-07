import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MODEL_API_URL: process.env.MODEL_API_URL,
};
