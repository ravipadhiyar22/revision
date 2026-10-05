import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    );
    console.log(
      `\n mongodb connect DB host :${connectionInstance.connection.host} and connection instance:${connectionInstance}`,
    );
  } catch (error) {
    console.log("database connection error:", error);
    process.exit(1);
  }
}