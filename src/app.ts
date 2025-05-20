import express from "express";
import routerInfo from "./routes/info";
import routerAuth from "./routes/authors";
import routerBooks from "./routes/books";
import routerUsers from "./routes/users";
import { swaggerSpec, swaggerUiExpress } from "./swagger";
import config from "./config/config";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(express.json());
app.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpec)
);

app.use(routerInfo);
app.use("/api", routerBooks);
app.use("/api", routerAuth);
app.use("/api", routerUsers);
app.get("/", (req, res) => {
  res.json({ message: "everything is running" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
