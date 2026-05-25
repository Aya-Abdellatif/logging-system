import logger from "./index.js";

logger.init({
  apiKey: "123",
  appName: "myApp",
});

logger.log({
  message: "hello world",
  level: "INFO",
});