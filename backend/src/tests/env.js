process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "isolated-test-secret-at-least-32-characters";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.RATE_LIMIT_STORE = "memory";
delete process.env.MONGO_URI;
