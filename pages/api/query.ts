import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req.body;
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: query,
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    res.status(200).json({ text: response.data.choices[0]["text"] });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
export default handler;
