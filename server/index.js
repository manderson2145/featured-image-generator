import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to analyze article and extract key themes
function analyzeArticle(articleText) {
  // Extract first few sentences for title/main topic
  const sentences = articleText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstSentences = sentences.slice(0, 3).join('. ');

  // Extract keywords (simple approach - can be enhanced with NLP)
  const words = articleText.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);

  // Count word frequency
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Get top keywords
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return {
    summary: firstSentences.substring(0, 200),
    keywords: keywords.slice(0, 5),
  };
}

// Function to generate image prompt based on article analysis and style
function generateImagePrompt(analysis, style) {
  const { summary, keywords } = analysis;

  const styleDescriptions = {
    'realistic': 'photorealistic, high quality photography, detailed',
    'cartoon': 'cartoon style, animated, colorful, playful illustration',
    'digital-art': 'digital art, modern, vibrant colors, artistic',
    'oil-painting': 'oil painting style, classical art, textured brushstrokes',
    'watercolor': 'watercolor painting, soft colors, artistic, flowing',
    'minimalist': 'minimalist design, clean, simple, elegant, modern',
    'abstract': 'abstract art, creative, artistic interpretation, modern',
    '3d-render': '3D rendered, CGI, modern, sleek, professional',
  };

  const styleDesc = styleDescriptions[style] || styleDescriptions['realistic'];

  // Create a descriptive prompt
  const prompt = `Create a ${styleDesc} featured image representing an article about: ${summary}.
    Key themes: ${keywords.join(', ')}.
    The image should be eye-catching, professional, and suitable as a blog post header.
    Do not include any text in the image.`;

  return prompt.substring(0, 1000); // OpenAI has a character limit
}

// API endpoint to generate image
app.post('/api/generate-image', async (req, res) => {
  try {
    const { article, style, size } = req.body;

    if (!article || article.trim().length === 0) {
      return res.status(400).json({ error: 'Article content is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file'
      });
    }

    // Analyze the article
    console.log('Analyzing article...');
    const analysis = analyzeArticle(article);

    // Generate image prompt
    console.log('Generating image prompt...');
    const prompt = generateImagePrompt(analysis, style);
    console.log('Prompt:', prompt);

    // Call OpenAI DALL-E API
    console.log('Calling OpenAI API...');
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size || '1024x1024',
      quality: 'standard',
    });

    const imageUrl = response.data[0].url;

    res.json({
      imageUrl,
      prompt,
      analysis,
    });

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate image',
      details: error.response?.data || error.toString(),
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`OpenAI API Key configured: ${!!process.env.OPENAI_API_KEY}`);
});
