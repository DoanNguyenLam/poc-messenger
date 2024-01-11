import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { ENV, PORT } from "./src/configs/application-props.js";

const app = express();

// Set view engine
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "src", "views"));

app.get("/", function (req, res) {
  res.render("pages/index");
});

app.listen(PORT, () => {
  console.log(`Application run in environment ${ENV}`);
  console.log(`App listening on port http://localhost:${PORT} 🦾`);
});

export default app;