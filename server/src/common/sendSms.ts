import axios from "axios";

export async function sendSms(number: string, message: string) {
  const apiKey = process.env.BULKSMSBD_API_KEY;
  const senderId = process.env.BULKSMSBD_SENDER_ID;

  const url = "http://bulksmsbd.net/api/smsapi";

  const params = {
    api_key: apiKey,
    type: "text",
    number,
    senderid: senderId,
    message,
  };

  try {
    const res = await axios.post(url, null, { params });
    console.log("SMS sent:", res.data);
  } catch (err) {
    console.error("SMS error:", err);
  }
}
