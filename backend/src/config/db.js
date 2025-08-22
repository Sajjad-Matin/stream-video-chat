import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ONLINE);
    console.log("MONGODB CONNECTED SUCCESSFULLY TO ONLINE!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    try {
      await mongoose.connect(process.env.MONGO_URI_LOCAL);
      console.log("MONGODB CONNECTED SUCCESSFULLY TO LOCAL!");
    } catch (error) {
      console.error("Error connecting to local MongoDB:", error.message);
      process.exit(1); // Exit the process with failure
    }
  }
};
