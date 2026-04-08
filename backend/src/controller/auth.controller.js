import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Logger from "../utils/logger.js";

const logger = new Logger("AuthController");

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.info("Registration attempt", { username, email });

    if ((!username && !email) || !password) {
      logger.warn("Registration validation failed: missing fields", {
        username,
        email,
        passwordProvided: !!password,
      });
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await prisma.User.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      logger.warn("Registration failed: user already exists", {
        username,
        email,
      });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info("User registered successfully", {
      userId: user.id,
      username,
      email,
    });

    res.status(201).json({
      message: "User registeres successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    logger.error("Registration error", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    logger.info("Login attempt", { identifier });

    const user = await prisma.User.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      logger.warn("Login failed: user not found", { identifier });
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn("Login failed: invalid credentials", { identifier });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info("Login successful", {
      userId: user.id,
      username: user.username,
    });

    res.status(201).json({
      message: "Login successful",
      token,
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    logger.error("Login error", { error: error.message, stack: error.stack });
    res.status(500).json({
      message: "Intenal server error",
      error: error.message,
    });
  }
};
