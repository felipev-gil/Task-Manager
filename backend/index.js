import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running successfully on port: ${PORT}`);
    });
  } catch (error) {
    console.error("FATAL ERROR: Server startup failed.", error);
    process.exit(1);
  }
};

startServer();
