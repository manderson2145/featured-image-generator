# Featured Image Generator

A modern web application that uses AI to automatically generate stunning featured images for your blog posts. Simply upload or paste your article, select a style, and let AI create the perfect header image.

## Features

- **Article Input**: Upload text/markdown files or paste your article directly
- **AI-Powered Analysis**: Automatically extracts key themes and topics from your content
- **Multiple Styles**: Choose from 8 different artistic styles:
  - Realistic
  - Cartoon
  - Digital Art
  - Oil Painting
  - Watercolor
  - Minimalist
  - Abstract
  - 3D Render
- **Flexible Sizing**: Generate images in three different sizes:
  - Square (1024x1024)
  - Landscape (1792x1024)
  - Portrait (1024x1792)
- **Easy Download**: Download your generated image with one click

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI DALL-E 3

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd featured-image-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

## Usage

### Running the Application

You need to run both the frontend and backend servers:

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3001`

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

3. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)

### Using the App

1. **Enter Your Article**:
   - Upload a text or markdown file using the file upload button
   - OR paste your article content directly into the text area

2. **Select Image Options**:
   - Choose your preferred image style
   - Select the desired image size

3. **Generate**:
   - Click "Generate Featured Image"
   - Wait for the AI to analyze your article and create the image (usually 10-30 seconds)

4. **Download**:
   - Once generated, click "Download Image" to save it to your device

## Project Structure

```
featured-image-generator/
├── src/                    # Frontend React application
│   ├── App.tsx            # Main React component
│   ├── App.css            # Custom styles
│   ├── index.css          # Tailwind CSS imports
│   └── main.tsx           # React entry point
├── server/                 # Backend Express server
│   └── index.js           # Server with API endpoints
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## API Endpoints

### POST `/api/generate-image`

Generates a featured image based on article content.

**Request Body**:
```json
{
  "article": "Your article text...",
  "style": "realistic",
  "size": "1024x1024"
}
```

**Response**:
```json
{
  "imageUrl": "https://...",
  "prompt": "Generated prompt used for image creation",
  "analysis": {
    "summary": "Article summary",
    "keywords": ["keyword1", "keyword2", ...]
  }
}
```

### GET `/api/health`

Health check endpoint to verify the server is running.

## Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

3. For production deployment, you'll need to:
   - Serve the built frontend files (from `dist/`)
   - Run the backend server with proper environment variables
   - Consider using a process manager like PM2 for the backend

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PORT` | Backend server port (default: 3001) | No |

## Troubleshooting

### "OpenAI API key is not configured"
- Make sure you've created a `.env` file in the root directory
- Verify that your `OPENAI_API_KEY` is set correctly
- Restart the backend server after updating `.env`

### CORS errors
- Ensure the backend server is running on port 3001
- Check that the frontend is making requests to `http://localhost:3001`

### Image generation fails
- Verify your OpenAI API key is valid and has credits
- Check the server console for detailed error messages
- Ensure your article is not empty

## Cost Considerations

This app uses OpenAI's DALL-E 3 API, which has costs associated with each image generation:
- Standard quality: ~$0.040 per image (1024x1024)
- HD quality: ~$0.080 per image (1024x1024)

The app currently uses standard quality. Monitor your OpenAI usage at [https://platform.openai.com/usage](https://platform.openai.com/usage).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
