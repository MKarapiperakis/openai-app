import openai from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiInstance = new openai.OpenAI(openaiApiKey);

export { openaiInstance as openai };
