import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { review, ownerName, restaurantName, ownerLang } = await req.json();
    const targetLang = ownerLang || 'English';
    
    const prompt = `
      You are an expert restaurant reputation manager.
      
      CONTEXT:
      Restaurant Name: "${restaurantName || 'Our Restaurant'}"
      Owner Name: "${ownerName || 'Management'}"
      
      TASK:
      1. Analyze the customer review.
      2. Translate the customer's original review into ${targetLang} so the owner fully understands the complaint.
      3. Write a professional, empathetic, and polite reply to the review in the SAME language as the original review.
      4. Sign the reply with the Owner Name and Restaurant Name.
      5. Provide a translation of your reply into ${targetLang}.

      FORMAT:
      Return strictly in JSON format:
      {
        "reviewTranslation": "Translation of the original customer review into ${targetLang}...",
        "reply": "The actual reply text in the customer's language...",
        "translation": "The translation of the reply for the owner in ${targetLang}..."
      }

      Customer Review: "${review}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}
