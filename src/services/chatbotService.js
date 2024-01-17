import {
  AIDABOT_BASE_URL,
  CHAT_HISTORY_ID,
  CLIENT_ID,
} from "../configs/application-props.js";
import { post } from "../utils/request.js";

export const getMessageFromBot = async (question) => {
    console.log("********** Message from AIdaBOT START");
  const END_POINT_CHAT = "/http/web-chatting";
  const URL = AIDABOT_BASE_URL + END_POINT_CHAT;

  const BODY = {
    source: "messenger-chat",
    client_id: CLIENT_ID,
    chat_history_id: CHAT_HISTORY_ID,
    question,
  };

  try {
    console.log("-----------URL\n", URL);
    console.log("-----------BODY\n", BODY);
    const res = await post(URL, BODY);
    console.log("-----------BODY\n", res);
    console.log("********** Message from AIdaBOT END\n");
    return `🤖 ${res.data}`;
  } catch (error) {
    console.error("Chatting failed", error);
    throw new Error(error.message);
  }
};
