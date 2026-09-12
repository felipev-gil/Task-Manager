import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Never read MONGO_URI: each suite owns a disposable local MongoDB process.
process.env.JWT_SECRET = "isolated-test-secret-not-for-production";
export const limitMock = jest.fn().mockResolvedValue({ success: true });
jest.unstable_mockModule("../config/upstash.js", () => ({
  default: { limit: limitMock },
}));
let database;
beforeAll(async () => {
  database = await MongoMemoryServer.create({
    instance: { dbName: "task_manager_test", launchTimeout: 60000 },
  });
  await mongoose.connect(database.getUri(), { dbName: "task_manager_test" });
}, 120000);
afterEach(async () => {
  // Only collections in the process created above may be cleaned.
  if (!database) return;
  if (mongoose.connection.name !== "task_manager_test")
    throw new Error("Unsafe test cleanup refused");
  for (const collection of Object.values(mongoose.connection.collections))
    await collection.deleteMany({});
  limitMock.mockReset().mockResolvedValue({ success: true });
});
afterAll(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});
