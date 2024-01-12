import axios from "axios";

export const get = async (baseURL, body, params) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await axios.get(baseURL, body, { headers, params });
    return res.data;
  } catch (error) {
    console.error("Error GET resource:", error.response.data);
    throw error;
  }
};

export const post = async (baseURL, body, params) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const res = await axios.post(baseURL, body, { headers, params });
    return res.data;
  } catch (error) {
    console.error("Error POST resource:", error.response);
    throw error;
  }
};
