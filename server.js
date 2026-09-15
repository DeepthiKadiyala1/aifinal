import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

// Serve the Vite production build
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/generate-breakdown", async (req, res) => {
  const { habit, mood, time } = req.body || {};

  if (!habit) {
    return res.status(400).json({ error: "missing habit" });
  }

  if (!API_KEY) {
    return res.status(400).json({
      error: "no API key configured on server",
    });
  }

  try {
    const prompt = `Break down this habit into short, actionable timed steps. Habit: "${habit}". Mood: "${mood || "neutral"}". Preferred time: "${time || "any"}". Return the steps as a JSON array of strings where each string is like "5 minutes: do X".`;

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("AI request failed:", r.status, errText);

      return res.status(502).json({
        error: "AI provider error",
        details: errText,
      });
    }

    const data = await r.json();

    let text = null;

    if (data?.candidates?.length > 0) {
      const cand = data.candidates[0];

      if (typeof cand.output === "string") {
        text = cand.output;
      } else if (typeof cand.content === "string") {
        text = cand.content;
      } else if (Array.isArray(cand.content)) {
        text = cand.content
          .map((c) => (c.text ? c.text : c))
          .join(" ");
      }
    } else if (typeof data?.output === "string") {
      text = data.output;
    }

    if (!text) {
      return res.status(502).json({
        error: "no text from AI",
      });
    }

    let steps = null;

    try {
      const maybeJson = text.trim();

      if (maybeJson.startsWith("[")) {
        steps = JSON.parse(maybeJson);
      }
    } catch {
      steps = null;
    }

    if (!steps) {
      steps = text
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
    }

    return res.json({
      subtasks: steps,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "server error",
    });
  }
});

// Send the React app for all other browser requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI Habit Builder running on port ${PORT}`);

  if (!API_KEY) {
    console.warn(
      "GEMINI_API_KEY not set — AI calls will fail until configured."
    );
  }
});