import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

beforeAll(async () => {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("MongoDB connected");
});

afterAll(async () => {
  await mongoose.connection.close();
});
