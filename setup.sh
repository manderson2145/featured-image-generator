#!/bin/bash

echo "=========================================="
echo "  Featured Image Generator - Setup"
echo "=========================================="
echo ""
echo "This script will help you create your .env file."
echo ""
echo "You'll need your OpenAI API key."
echo "If you don't have one yet, get it from: https://platform.openai.com/api-keys"
echo ""
read -p "Do you have your OpenAI API key ready? (yes/no): " ready

if [ "$ready" != "yes" ]; then
    echo ""
    echo "Please get your API key first from: https://platform.openai.com/api-keys"
    echo "Then run this script again: ./setup.sh"
    exit 0
fi

echo ""
echo "Great! Let's create your .env file."
echo ""
read -p "Paste your OpenAI API key here: " api_key

if [ -z "$api_key" ]; then
    echo "Error: API key cannot be empty"
    exit 1
fi

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=$api_key
PORT=3001
EOF

echo ""
echo "✓ .env file created successfully!"
echo ""
echo "Your configuration:"
echo "  - API Key: ${api_key:0:20}... (hidden for security)"
echo "  - Port: 3001"
echo ""
echo "Next steps:"
echo "  1. Open two terminal windows"
echo "  2. In terminal 1, run: npm run server"
echo "  3. In terminal 2, run: npm run dev"
echo "  4. Open http://localhost:5173 in your browser"
echo ""
echo "Setup complete! 🎉"
