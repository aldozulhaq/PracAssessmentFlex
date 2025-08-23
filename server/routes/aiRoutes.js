const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/summarize-reviews', async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ message: 'No reviews provided.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'AI service is not configured.' });
  }

  const prompt = `
    You are a helpful assistant for a property manager. Analyze the following guest reviews for a single property.
    Your task is to provide a concise summary, identify recurring positive themes, and highlight specific, actionable areas for improvement.

    Please provide your response in a valid JSON object format with the following keys: "summary", "positive_points", "improvement_areas".
    - "summary" should be a short paragraph (2-3 sentences).
    - "positive_points" should be an array of short strings.
    - "improvement_areas" should be an array of short strings.

    Here are the reviews:
    ---
    ${reviews.join('\n---\n')}
    ---
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const aiResult = JSON.parse(response.data.choices[0].message.content);
    res.json(aiResult);

  } catch (error) {
    console.error('OpenRouter Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to generate AI insights.' });
  }
});

router.post('/summarize-public-reviews', async (req, res) => {
  const { reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ message: 'No reviews provided.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'AI service is not configured.' });
  }

  const prompt = `
    You are a friendly and helpful concierge summarizing guest feedback for a potential new guest.
    Based *only* on the reviews provided, give an honest and enticing summary of what it's like to stay at this property.
    Do not invent any details not mentioned in the reviews.

    Please provide your response in a valid JSON object format with the following keys: "summary_paragraph" and "key_highlights".
    - "summary_paragraph" should be a short, welcoming paragraph (2-3 sentences) written in the second person (e.g., "You'll find...").
    - "key_highlights" should be an array of 3-4 short, positive strings highlighting what guests consistently loved.

    Here are the approved guest reviews:
    ---
    ${reviews.join('\n---\n')}
    ---
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      },
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );

    const aiResult = JSON.parse(response.data.choices[0].message.content);
    res.json(aiResult);

  } catch (error) {
    console.error('OpenRouter Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to generate public summary.' });
  }
});

module.exports = router;