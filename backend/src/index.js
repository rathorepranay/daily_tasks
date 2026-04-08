import dotenv from "dotenv";
import app from "./app.js";
import Logger from "./utils/logger.js";

dotenv.config();
const logger = new Logger("Server");
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`App is running on PORT: ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server", { error: error.message });
  }
};

startServer();
