import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const completion = await client.chat.completions.create({
  model: "openai/gpt-oss-20b:free",
  messages: [
    {
      role: "user",
      content: "Say Hello",
    },
  ],
});

console.log(completion.choices[0].message.content);