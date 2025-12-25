import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    // process.exit(1); // Removed to prevent container restart loops in specific edge cases, though locally it is fine.
  }
};
