import { Router, type IRouter } from "express";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";
import Groq from "groq-sdk";

const router: IRouter = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are SciBuddy, an enthusiastic and knowledgeable AI assistant specialized in science education. You help students understand scientific concepts across all disciplines — physics, chemistry, biology, astronomy, environmental science, and more.

Your personality:
- Encouraging and supportive, never condescending
- Use clear, accessible language but don't shy away from proper scientific terms (with explanations)
- Make complex concepts relatable with real-world examples and analogies
- Express genuine enthusiasm for science and discovery
- Keep responses concise but thorough — prefer bullet points and structure for complex topics
- Use markdown formatting for clarity (bold key terms, lists, etc.)

You're built for focused study sessions, so help students stay on track and deeply understand the material.`;

router.post("/chat", async (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { message, history = [] } = parsed.data;

  try {
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    const data = SendChatMessageResponse.parse({ reply, role: "assistant" });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Chat completion error");
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
