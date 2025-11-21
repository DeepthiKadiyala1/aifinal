import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY; // set this in your environment

app.post("/api/generate-breakdown", async (req, res) => {
  const { habit, mood, time } = req.body || {};
  if (!habit) return res.status(400).json({ error: "missing habit" });

  // If no API key provided, return 400 so frontend can fallback
  if (!API_KEY) {
    return res.status(400).json({ error: "no API key configured on server" });
  }

  try {
    // Construct a prompt asking the model to produce short timed subtasks tailored to mood/time.
    const prompt = `Break down this habit into short, actionable timed steps. Habit: "${habit}". Mood: "${mood || "neutral"}". Preferred time: "${time || "any"}". Return the steps as a JSON array of strings where each string is like \"5 minutes: do X\".`;

    // Google Generative Language API endpoint (example for text-bison-001). Replace model if needed.
    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;

    const body = {
      prompt: {
        text: prompt,
      },
      temperature: 0.2,
      maxOutputTokens: 500,
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("AI request failed:", r.status, errText);
      return res.status(502).json({ error: "AI provider error", details: errText });
    }

    const data = await r.json();

    // Try to extract the generated text. Different APIs return different shapes.
    // Google generative responses typically have `candidates[0].output` or `candidates[0].content`.
    let text = null;
    if (data?.candidates && data.candidates.length > 0) {
      // join content parts if available
      const cand = data.candidates[0];
      if (typeof cand.output === "string") text = cand.output;
      else if (typeof cand.content === "string") text = cand.content;
      else if (Array.isArray(cand.content)) {
        text = cand.content.map((c) => (c.text ? c.text : c)).join(" ");
      }
    } else if (typeof data?.output === "string") {
      text = data.output;
    }

    if (!text) {
      // fallback: tell client to use non-AI fallback
      return res.status(502).json({ error: "no text from AI" });
    }

    // Try to parse JSON array if model returned JSON
    let steps = null;
    try {
      const maybeJson = text.trim();
      if (maybeJson.startsWith("[")) {
        steps = JSON.parse(maybeJson);
      }
    } catch (e) {
      steps = null;
    }

    if (!steps) {
      // Fallback: split text into lines and use non-empty lines as steps
      steps = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    }

    return res.json({ subtasks: steps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

app.listen(PORT, () => {
  console.log(`AI proxy server listening on ${PORT}`);
  if (!API_KEY) console.warn("GEMINI_API_KEY not set — AI calls will fail until configured.");
});
