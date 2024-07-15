import OpenAI from 'openai';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
  });

app.post("/gpt", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, error: "No prompt provided" });
    }

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{"role": "user", "content": prompt}],
      });

    if (!response || !response.choices || !response.choices.length) {
      return res.status(500).json({ success: false, error: "Invalid response from OpenAI" });
    }

    const message = response.choices[0].message;
    
    if (!message || !message.content) {
      return res.status(500).json({ success: false, error: "Invalid message format from OpenAI" });
    }

    res.status(200).json({
      success: true,
      data: message.content.trim(),
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : error.message,
    });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
