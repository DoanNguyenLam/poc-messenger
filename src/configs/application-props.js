import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const ENV = process.env.ENV;
const MY_VERIFY_FB_TOKEN = process.env.MY_VERIFY_FB_TOKEN;
const FB_TOKEN = process.env.FB_TOKEN;
const FB_BASE_URL = process.env.FB_BASE_URL;
const AIDABOT_BASE_URL = process.env.AIDABOT_BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CHAT_HISTORY_ID = process.env.CHAT_HISTORY_ID;
const PAGE_ID = process.env.PAGE_ID;

export {
  PORT,
  ENV,
  MY_VERIFY_FB_TOKEN,
  FB_TOKEN,
  FB_BASE_URL,
  AIDABOT_BASE_URL,
  CLIENT_ID,
  CHAT_HISTORY_ID,
  PAGE_ID,
};
