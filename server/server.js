const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());


const openaiApiKey = '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';

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                prompt: userMessage,
                max_tokens: 50,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const botMessage = response.data.choices[0].text.trim();
        res.json({ reply: botMessage });
    } catch (error) {
        console.error('Error with OpenAI API:', error.response?.data || error.message);
        if (error.response?.data?.error?.code === 'insufficient_quota') {
            res.json({ reply: "I'm currently unable to process your request due to quota issues. Please try again later." });
        } else {
            res.status(500).json({ reply: 'Sorry, something went wrong on the server.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
