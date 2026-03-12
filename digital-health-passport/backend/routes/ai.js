const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route  POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are a helpful AI health assistant for the Digital Health Passport application. 
    You provide general health information, explain medical terms, and help users understand their health records.
    
    IMPORTANT RULES:
    - Always clarify that you are NOT a doctor and your responses are NOT medical advice
    - Never diagnose conditions or prescribe treatments
    - For emergencies, always recommend calling emergency services (911, 112, etc.)
    - Be empathetic, clear, and educational
    - Keep responses concise and easy to understand
    - If asked about medications, always recommend consulting a pharmacist or doctor
    
    Start responses with helpful information, then remind users to consult healthcare professionals for personal medical advice.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (err) {
    if (err.code === 'invalid_api_key' || err.status === 401) {
      return res.status(500).json({ success: false, message: 'AI service not configured. Please add a valid OpenAI API key.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
