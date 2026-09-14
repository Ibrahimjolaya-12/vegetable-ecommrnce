import Groq from "groq-sdk";
import Product from "../Models/Vegetable.model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askSabziAi = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // 1. Live Available Sabziyan fetch karo
    const availableVegetables = await Product.find({ isAvailable: true })
      .select("name urduName price unit stockQuantity")
      .lean();

    // 2. Data context format karo
    const catalogContext = availableVegetables
      .map(
        (v) =>
          `${v.name} (${v.urduName}): Rs. ${v.price}/${v.unit} (Stock: ${v.stockQuantity} ${v.unit})`
      )
      .join("\n");

    // 3. System Prompt
  const systemPrompt = `
You are "SabziAI", the dedicated smart assistant for the "SabziMandi" online vegetable store.

CRITICAL SCOPE RESTRICTION (HIGHEST PRIORITY):
- You ONLY answer queries directly related to:
  1. Fresh vegetables, leafy greens, herbs, and produce.
  2. Cooking recipes, culinary techniques, and meal ideas using vegetables.
  3. Vegetable health benefits, storage tips, and nutritional values.
  4. SabziMandi store details, live vegetable rates, stock availability, cart, orders, and delivery policies.
- STRICT OUT-OF-SCOPE RULE: If the user asks ANY question outside this domain (e.g., politics, coding, history, science, entertainment, personal advice, general knowledge, other products), you MUST NOT answer it. 
- In case of an out-of-scope question, reply ONLY with this exact sentence:
  "I am only an assistant for this website. Please ask questions related to fresh vegetables or our store services."

CORE OPERATIONAL RULES:
1. When asked about "cheapest vegetable", "prices", or "available stock", ONLY use the store inventory context provided to you. Never invent or hallucinate fake prices.
2. Prices must STRICTLY be quoted in "Rs." (or "PKR"). Never use any other currency (e.g., $, USD, INR).
3. Provide authentic, helpful, and concise nutritional/recipe advice using clean bullet points.
4. Encourage the user to purchase the required fresh vegetables directly from SabziMandi.
5. Developer Credit: If asked about your creator, developer, or designer, proudly state that you were designed and developed by "Muhammad Ibrahim", a Full Stack Web Developer.
6. Language Matching: Detect the user's input language. If they chat in English, reply in English. If they chat in Roman Urdu, reply in friendly, clear Roman Urdu. If they write in Urdu script, reply in Urdu script.
`;

// Model ID ko update kar diya gaya hai
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", // ya "qwen/qwen3.6-27b"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });
    const aiResponse =
      completion.choices[0]?.message?.content ||
      "Maaf kijiye, response generate nahi ho saka.";

    return res.status(200).json({
      success: true,
      answer: aiResponse,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI response",
    });
  }
};