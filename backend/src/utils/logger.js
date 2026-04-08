/**
 * Simple structured logger utility
 * Logs to console with timestamp, level, and module name
 * Log levels: error, warn, info, debug
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const COLORS = {
  error: "\x1b[31m", // Red
  warn: "\x1b[33m", // Yellow
  info: "\x1b[36m", // Cyan
  debug: "\x1b[90m", // Gray
  reset: "\x1b[0m",
};

class Logger {
  constructor(moduleName = "App") {
    this.moduleName = moduleName;
    this.logLevel =
      LOG_LEVELS[process.env.LOG_LEVEL || "info"] || LOG_LEVELS.info;
  }

  _log(level, message, data = null) {
    if (LOG_LEVELS[level] > this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const color = COLORS[level];
    const reset = COLORS.reset;
    const levelUpper = level.toUpperCase().padEnd(5);

    let logMessage = `${color}[${levelUpper}]${reset} [${timestamp}] [${this.moduleName}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  error(message, data = null) {
    this._log("error", message, data);
  }

  warn(message, data = null) {
    this._log("warn", message, data);
  }

  info(message, data = null) {
    this._log("info", message, data);
  }

  debug(message, data = null) {
    this._log("debug", message, data);
  }
}

export default Logger;
