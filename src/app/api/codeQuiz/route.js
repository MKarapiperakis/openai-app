import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request) {
    const requestBody = await request.json();
    const { question,code } = requestBody;
    
    const prompt =`A programming question generated from you was this one: "${question}" and the user response in this question was "${code}". Grade his answer with a number from 0 to 100 and return a response in json format with his score and comments for his implementation. If the user's response is empty the score should be 0`
    
    console.log(prompt);
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    console.log(chatCompletion.choices[0].message.content);
  
    const responseData = chatCompletion.choices[0].message.content;
  
    return NextResponse.json(
      {
        responseData,
      },
      { status: 200 }
    );
  }