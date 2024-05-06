import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request) {
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

export async function POST(request) {
  const requestBody = await request.json();
  const { technology, difficulty, mode, questions } = requestBody;
  let prompt = "";

  if (mode === "Quiz") {
    prompt = `Create for me ${questions} questions for a quiz in technology ${technology}. The difficulty level will be ${difficulty}. Provide me an array where the first element is the correct answer and the rest three are wrong answers. The question should be one sentence. Send me the response in json format like that: {
    "questions": [
      {
        "question": "What keyword is used to declare a variable in JavaScript?",
        "answers": ["var", "let", "const", "function"]
      },
      {
        "question": "Which operator is used for comparison in JavaScript?",
        "answers": ["==", "===", "!=", ">="]
      }
    ]
  } `;
  } else {
    prompt = `Create for me one programming question that requires code using technology ${technology} as answer. The difficulty will be ${difficulty}. The response should be in json format. Be carefull with special characters like string literals in the returned json. This is an example of a response: {
      "question": "Create a function in JavaScript that takes two numbers as parameters and returns their sum.",
      "difficulty": "Beginner",
      "hint": "You can use the + operator to add the two numbers together."
    }`;
  }

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
