import mongoose from "mongoose";

const connectDB = async () => {
  const dbURI = String(process.env.DATABASE_URL);

  try {
    await mongoose.connect(dbURI);

    if (!dbURI) {
      console.error("❌Database URI is not defined");
      process.exit(1);
    }

    console.log("✅Database connected successfully!");
  } catch (error) {
    console.error("❌Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
