# Quizzed On Anything

A Flask web application that generates multiple-choice quizzes on any topic using OpenAI's GPT-3.5-turbo API.

## Features

- Interactive quiz generation based on user-provided topics
- Multiple choice questions with immediate feedback
- Score tracking
- Responsive design for mobile and desktop

## Deployment on Vercel

### Prerequisites

1. Install the Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### Deployment Steps

1. **Login to Vercel:**

   ```bash
   vercel login
   ```

2. **Set up environment variables:**

   ```bash
   vercel env add OPENAI_API_KEY
   ```

   Enter your OpenAI API key when prompted.

3. **Deploy the application:**

   ```bash
   vercel --prod
   ```

4. **Your app will be deployed to a URL like:**
   ```
   https://your-app-name.vercel.app
   ```

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Local Development

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variable:

   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

3. Run the application:
   ```bash
   python api/index.py
   ```

## Project Structure

```
├── api/
│   ├── index.py          # Main Flask application
│   ├── templates/
│   │   └── quiz-me.html  # Frontend template
│   └── static/
│       └── css/
│           └── quiz-me.css # Styles
├── requirements.txt       # Python dependencies
├── vercel.json          # Vercel configuration
└── README.md           # This file
```

## How it Works

1. User enters a topic in the input field
2. Frontend sends a POST request to `/quiz` with the topic
3. Backend uses OpenAI's GPT-3.5-turbo to generate 6 multiple-choice questions
4. Questions are parsed and returned to the frontend
5. User can answer questions and see their score at the end
