import express from "express";
import routerInfo from "./routes/info";
import routerUsers from "./routes/users";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiExpress } from "./swagger";
import config from "./config/config";
import { errorHandler } from "./middleware/error-handler";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import YAML from "yamljs";
import morgan from "morgan";
import { logger } from "./logger";
import routerV1 from "./routes";

const app = express();
const swaggerDocument = YAML.load("./openapi.yaml");

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:2201/"],
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
  })
);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(
//   "/api-docs",
//   swaggerUiExpress.serve,
//   swaggerUiExpress.setup(swaggerSpec)
// );
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use("/api", routerInfo);
app.use("/api", routerUsers);
app.use("/api", routerV1);
app.get("/", (req, res) => {
  res.json({ message: "everything is running" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
