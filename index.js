import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { ENV, MY_VERIFY_FB_TOKEN, PORT } from "./src/configs/application-props.js";

const app = express();

// Set view engine
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "src", "views"));

app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/webhook/", function (req, res) {
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === MY_VERIFY_FB_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Application run in environment ${ENV}`);
  console.log(`App listening on port http://localhost:${PORT} 🦾`);
});

export default app;
