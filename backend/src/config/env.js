import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const config = {
  MODEL_API_URL: process.env.MODEL_API_URL,
  YOLO_API_URL: process.env.YOLO_API_URL,
};
