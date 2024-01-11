import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const ENV = process.env.ENV;
const MY_VERIFY_FB_TOKEN = process.env.MY_VERIFY_FB_TOKEN;
const FB_TOKEN = process.env.FB_TOKEN;

export { PORT, ENV, MY_VERIFY_FB_TOKEN, FB_TOKEN };
