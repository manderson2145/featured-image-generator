import { useState } from 'react';
import './App.css';

const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'oil-painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'abstract', label: 'Abstract' },
  { value: '3d-render', label: '3D Render' },
];

const IMAGE_SIZES = [
  { value: '1024x1024', label: 'Square (1024x1024)' },
  { value: '1792x1024', label: 'Landscape (1792x1024)' },
  { value: '1024x1792', label: 'Portrait (1024x1792)' },
];

function App() {
  const [article, setArticle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageStyle, setImageStyle] = useState('realistic');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setArticle(event.target?.result as string);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleGenerate = async () => {
    if (!article.trim()) {
      setError('Please enter or upload an article first.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article,
          style: imageStyle,
          size: imageSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `featured-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Featured Image Generator
          </h1>
          <p className="text-gray-600">
            Transform your articles into stunning featured images with AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Article Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Article Content
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Article File
                </label>
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Paste Your Article
                </label>
                <textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="Paste your article content here..."
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    resize-none text-gray-700"
                />
              </div>

              <div className="text-sm text-gray-500">
                {article.length} characters
              </div>
            </div>

            {/* Image Options */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Image Options
              </h2>

              {/* Style Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setImageStyle(style.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          imageStyle === style.value
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Size
                </label>
                <div className="space-y-2">
                  {IMAGE_SIZES.map((size) => (
                    <label
                      key={size.value}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-all
                        ${
                          imageSize === size.value
                            ? 'bg-indigo-50 border-2 border-indigo-500'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="imageSize"
                        value={size.value}
                        checked={imageSize === size.value}
                        onChange={(e) => setImageSize(e.target.value)}
                        className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {size.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !article.trim()}
                className={`w-full py-3 px-6 rounded-md font-semibold text-white
                  transition-all duration-200 ${
                    loading || !article.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Featured Image'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Generated Image
            </h2>

            <div className="min-h-[500px] flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">
                    Analyzing your article and generating image...
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="w-full">
                  <img
                    src={generatedImage}
                    alt="Generated featured image"
                    className="w-full h-auto rounded-lg shadow-md mb-4"
                  />
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 px-6 rounded-md font-semibold text-white
                      bg-green-600 hover:bg-green-700 transition-all duration-200
                      shadow-lg hover:shadow-xl"
                  >
                    Download Image
                  </button>
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-red-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <svg
                    className="mx-auto h-24 w-24 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
