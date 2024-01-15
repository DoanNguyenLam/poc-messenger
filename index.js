import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

import {
  ENV,
  MY_VERIFY_FB_TOKEN,
  PAGE_ID,
  PORT,
} from "./src/configs/application-props.js";
import { handleMessage, handlePostback } from "./src/utils/chat.js";

const app = express();

// Set view engine
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "src", "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.render("pages/index", { pageId: PAGE_ID });
});

app.get("/webhook/", (req, res) => {
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

app.post("/webhook", function (req, res) {
  // Parse the request body from the POST
  console.log("********** WEBHOOK START **********");
  let body = req.body;

  // Check the webhook event is from a Page subscription
  console.log("Body \n", body);

  try {
    if (body.object === "page") {
      // Iterate over each entry - there may be multiple if batched

      for (const entry of body.entry) {
        // Gets the body of the webhook event
        console.log("ENTRY \n", entry);
        if (!entry.messaging || !entry.messaging.length) {
          console.log("Event failure");
          continue;
        }
        let webhook_event = entry.messaging[0];
        console.log("webhook_event \n", webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      }

      // Return a '200 OK' response to all events
      res.status(200).send("EVENT_RECEIVED");
      console.log("********** WEBHOOK ENDED **********");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
      console.log("********** WEBHOOK 404 **********");
    }
  } catch (error) {
    console.log("Exception Body: \n", body);
    console.log("Exception Entry: \n", body.entry);
    console.log("Exception Exception: \n", error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Application run in environment ${ENV}`);
  console.log(`App listening on port http://localhost:${PORT} 🦾`);
});

export default app;
