import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" }, // 🚀 Always JSON
      messages: [
        {
          role: "system",
          content: `You are an invoice parser. Always return valid JSON with this schema:
{
  "vendorName": "string",
  "date": "YYYY-MM-DD",   // ISO format
  "employeeName": "string",
  "gstAmount": "number",
  "totalAmount": "number",
  "category": "Food | Travel | Utilities | Office Supplies | Entertainment | Healthcare | Other"
}`,
        },
        {
          role: "user",
          content: `Extract the fields from this invoice text:\n\n${text}`,
        },
      ],
      temperature: 0,
    });

    console.log("Token usage:", response.usage);

    let aiMessage = response.choices[0].message?.content || "{}";
    let parsed = JSON.parse(aiMessage);

    // 🛠️ Fix dates like "29-07" → "2025-07-29"
    if (parsed.date && /^\d{2}-\d{2}$/.test(parsed.date)) {
      const [day, month] = parsed.date.split("-");
      const year = new Date().getFullYear();
      parsed.date = `${year}-${month}-${day}`;
    }

    console.log("Parsed AI response:", parsed);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("AI parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse invoice", details: error.message },
      { status: 500 }
    );
  }
}
