import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// This command deliberately ignores deployment credentials and uses disposable local data.
process.env.NODE_ENV = "development";
process.env.RATE_LIMIT_STORE = "memory";
process.env.JWT_SECRET = "local-demo-secret-never-use-in-production";
process.env.CORS_ORIGIN = "http://localhost:5173";
const database = await MongoMemoryServer.create();
process.env.MONGO_URI = database.getUri();
const { default: app } = await import("../src/app.js");
const { default: User } = await import("../src/models/User.js");
await mongoose.connect(database.getUri());
const user = await User.create({
  name: "Portfolio Demo",
  username: "portfolio-demo",
  email: "demo@example.test",
  password: "PortfolioDemo123!",
});
const { default: Task } = await import("../src/models/Task.js");
await Task.insertMany(
  [
    {
      title: "Plan the next release",
      content: "Review feedback and choose the next improvements.",
      priority: "High",
      state: "Pending",
      position: 100,
    },
    {
      title: "Write regression tests",
      content: "Cover authentication recovery and task ownership.",
      priority: "Medium",
      state: "Pending",
      position: 200,
    },
    {
      title: "Polish the task board",
      content: "Check keyboard controls and responsive layout.",
      priority: "High",
      state: "In Progress",
      position: 100,
    },
    {
      title: "Ship the first version",
      content: "Deploy the frontend and API.",
      priority: "Low",
      state: "Completed",
      position: 100,
    },
    ...Array.from({ length: 12 }, (_, index) => ({
      title: "Completed milestone " + (index + 1),
      content: "Documented and verified.",
      priority: "Low",
      state: "Completed",
      archived: true,
      position: index + 1,
    })),
  ].map((task) => ({ ...task, user: user._id })),
);
const server = app.listen(5000, "127.0.0.1", () =>
  console.log("Disposable demo API: http://127.0.0.1:5000/api"),
);
const shutdown = async () => {
  server.close();
  await mongoose.disconnect();
  await database.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
