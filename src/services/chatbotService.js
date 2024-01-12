import {
  AIDABOT_BASE_URL,
  CHAT_HISTORY_ID,
  CLIENT_ID,
} from "../configs/application-props.js";
import { post } from "../utils/request.js";

export const getMessageFromBot = async (question) => {
  const END_POINT_CHAT = "/http/web-chatting";
  const URL = AIDABOT_BASE_URL + END_POINT_CHAT;

  const BODY = {
    source: "messenger-chat",
    client_id: CLIENT_ID,
    chat_history_id: CHAT_HISTORY_ID,
    question,
  };

  try {
    console.log("URL", URL);
    console.log("BODY", BODY);
    const res = await post(URL, BODY);
    return res.data;
  } catch (error) {
    console.error("Chatting failed", error);
    throw new Error(error.message);
  }
};
