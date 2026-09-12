import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { resetRateLimitStore } from "../middlewares/rate.limiter.js";
let database;
beforeAll(async () => {
  database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri());
});
afterEach(async () => {
  resetRateLimitStore();
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({}),
    ),
  );
});
afterAll(async () => {
  await mongoose.disconnect();
  await database?.stop();
});
