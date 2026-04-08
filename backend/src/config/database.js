import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    throw error;
  }
};

export default prisma;
export { connectDB };
