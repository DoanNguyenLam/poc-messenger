import request from "request";
import {
  FB_BASE_URL,
  FB_TOKEN,
  PAGE_ID,
} from "../configs/application-props.js";
import { post } from "./request.js";
import { getMessageFromBot } from "../services/chatbotService.js";

// Handles messaging_postbacks events
export const handlePostback = async (sender_psid, received_postback) => {
  console.log("-----------handlePostback \n", received_postback);

  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, try sending another image." };
  }
  // Send the message to acknowledge the postback
  await callSendAPI(sender_psid, response);
};

export const handleMessage = async (sender_psid, message) => {
  //handle message for react, like press like button
  // id like button: sticker_id 369239263222822
  console.log("----------- handleMessage START -----------");
  console.log("Message", message);

  if (message && message.attachments && message.attachments[0].payload) {
    await callSendAPI(sender_psid, "Thank you for watching my video !!!");
    callSendAPIWithTemplate(sender_psid);
    console.log("----------- handleMessage ATTACHMENT ENDED -----------");
    return;
  }

  let entitiesArr = ["wit$greetings", "wit$thanks", "wit$bye"];
  let entityChosen = "";
  entitiesArr.forEach((name) => {
    let entity = firstTrait(message.nlp, name);
    console.log("entity", name, message.nlp, entity);
    if (entity && entity.confidence > 0.8) {
      entityChosen = name;
    }
  });

  if (entityChosen === "") {
    //default
    console.log("----------- handleMessage AIdaBOT -----------");

    // Embed message from AIdaBOT
    const msg = await getMessageFromBot(message.text);
    // const msg = `The bot is needed more training, try to say "thanks a lot" or "hi" to the bot`;

    await callSendAPI(sender_psid, msg);
  } else {
    if (entityChosen === "wit$greetings") {
      //send greetings message
      console.log("----------- handleMessage GREETING -----------");

      await callSendAPI(
        sender_psid,
        "Hello! I'm AIdaBOT. How can I assist you today?"
      );
    }
    if (entityChosen === "wit$thanks") {
      //send thanks message
      console.log("----------- handleMessage THANKS -----------");
      await callSendAPI(sender_psid, `You 're welcome!`);
    }
    if (entityChosen === "wit$bye") {
      //send bye message
      console.log("----------- handleMessage BYE -----------");
      await callSendAPI(
        sender_psid,
        "Goodbye! If you have any more questions in the future, feel free to ask. Have a great day!"
      );
    }
  }
};

// Sends response messages via the Send API
export const callSendAPI = async (sender_psid, response) => {
  console.log("----------- callSendAPI \n", response);

  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: { text: response },
  };

  const params = {
    access_token: FB_TOKEN,
  };

  try {
    const res = await post(
      `${FB_BASE_URL}/${PAGE_ID}/messages`,
      request_body,
      params
    );
    console.log("Response from FB", res);
    console.log("Sent message successfully ✅");
  } catch (error) {
    console.error("Unable to send message ❌:" + error);
  }

  // Send the HTTP request to the Messenger Platform
  //   request(
  //     {
  //       uri: FB_BASE_URL,
  //       qs: { access_token: FB_TOKEN },
  //       method: "POST",
  //       json: request_body,
  //     },
  //     (err, res, body) => {
  //       if (!err) {
  //         console.log("message sent!");
  //       } else {
  //         console.error("Unable to send message:" + err);
  //       }
  //     }
  //   );
};

// export const firstTrait(nlp, name) {
//     return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
// }

export const firstTrait = (nlp, name) => {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
};

const callSendAPIWithTemplate = async (sender_psid) => {
  // document fb message template
  // https://developers.facebook.com/docs/messenger-platform/send-messages/templates
  let body = {
    recipient: {
      id: sender_psid,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Want to build sth awesome?",
              image_url:
                "https://www.nexmo.com/wp-content/uploads/2018/10/build-bot-messages-api-768x384.png",
              subtitle: "Watch more videos on my youtube channel ^^",
              buttons: [
                {
                  type: "web_url",
                  url: "https://bit.ly/subscribe-haryphamdev",
                  title: "Watch now",
                },
              ],
            },
          ],
        },
      },
    },
  };

  const params = {
    access_token: FB_TOKEN,
  };

  try {
    const res = await post(`${FB_BASE_URL}/${PAGE_ID}/messages`, body, params);
    console.log("Response from FB", res);
    console.log("Sent message successfully ✅");
  } catch (error) {
    console.error("Unable to send message ❌:" + error);
  }
};
