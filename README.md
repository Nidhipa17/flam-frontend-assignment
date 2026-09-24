
# FLAM Study Assistant

An AI-powered study assistant built with React, Vite, Express.js, and the Gemini API.

The application accepts a study topic from the user and generates structured study material containing:

- A topic
- A beginner-friendly summary
- Important key points
- Question-and-answer flashcards

Users can interact with flashcards, take a self-assessment quiz, and re-test questions they answered incorrectly.

## Live Demo

Frontend:

https://flam-frontend-dvip.onrender.com

Backend:

https://flam-frontend-assignment-09qf.onrender.com

## Features

- Free-form study topic input
- AI-generated study material
- Gemini API integration
- Structured JSON responses
- Summary generation
- Key points generation
- Interactive flashcards
- Flashcard question-and-answer flip interaction
- Previous and next flashcard navigation
- Self-assessment quiz
- Quiz score calculation
- Incorrect-answer tracking
- Re-test mode for incorrect answers
- Loading state during AI generation
- Error handling for failed API requests
- Validation of AI-generated response data
- Responsive layout for mobile and desktop
- Backend proxy for protecting the Gemini API key

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- JSX
- CSS
- React Hooks

### Backend

- Node.js
- Express.js
- Google GenAI SDK
- Gemini API
- dotenv
- CORS

## Project Structure

```text
flam-frontend-assignment/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ErrorState.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── LoadingState.jsx
│   │   ├── PromptInput.jsx
│   │   └── ResultView.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   │
│   ├── types/
│   │   └── result.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   └── generate.js
│
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
└── README.md
```

## How the Application Works

1. The user enters a study topic.
2. React sends the topic to the backend API.
3. The backend creates a structured prompt for Gemini.
4. Gemini returns structured JSON.
5. The backend parses and validates the response.
6. The validated response is returned to the frontend.
7. React renders the summary, key points, and flashcards.
8. Users can flip flashcards, navigate between cards, take a quiz, and re-test incorrect answers.

## AI Response Structure

The complete study material follows this structure:

```json
{
  "topic": "Operating System",
  "summary": "A beginner-friendly explanation of operating systems.",
  "keyPoints": [
    "An operating system manages computer hardware.",
    "It manages processes and memory.",
    "It provides an interface for users and applications."
  ],
  "flashcards": [
    {
      "question": "What is an operating system?",
      "answer": "An operating system manages hardware and software resources."
    }
  ]
}
```

The backend validates the response before it is sent to the frontend.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nidhipa17/flam-frontend-assignment.git
```

### 2. Move into the project directory

```bash
cd flam-frontend-assignment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root or in the location expected by the backend configuration.

Add the Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Never commit the actual API key to GitHub.

### 5. Start the frontend

```bash
npm run dev
```

### 6. Start the backend

Open another terminal and run:

```bash
npm run server
```

The backend runs on the configured server port.

## Environment Variables

### Backend

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend

For the deployed frontend, configure:

```env
VITE_API_URL=https://flam-frontend-assignment-09qf.onrender.com
```

The frontend uses the backend URL to send generation requests.

## Error Handling

The application includes handling for several AI and API failure cases:

- Invalid or empty user input
- Invalid server response
- Empty AI response
- Malformed JSON
- Incorrect response structure
- Invalid flashcard data
- API request failures
- Temporary AI service errors
- Loading and error states

The backend validates generated content before returning it to the frontend.

## Interactive Learning Features

### Flashcard Mode

Users can:

- View a flashcard question.
- Click the card to reveal its answer.
- Move to the previous card.
- Move to the next card.

### Quiz Mode

Users can:

- View each flashcard question.
- Reveal the correct answer.
- Mark whether they answered correctly.
- View their quiz score.
- Track incorrectly answered questions.

### Re-test Mode

Users can:

- Re-test the questions they answered incorrectly.
- Mark whether they improved.
- Continue practicing remaining incorrect questions.
- Return to the normal flashcard view.

The quiz uses self-assessment because the generated questions are open-ended and may have multiple valid answers.

## AI Usage Note

AI tools were used during development to support implementation, debugging, code explanation, and development planning.

The project was adapted and reviewed during development, and the code should be understood before submission or interview discussion.

The AI-generated suggestions were tested and adjusted to fit the application's structure and requirements.

## Security

- The Gemini API key is stored on the backend.
- The API key is not included in frontend code.
- Environment files containing secrets are excluded using `.gitignore`.
- The frontend communicates with the backend through an API endpoint.

## Known Limitations

- Generated study content depends on the response provided by the Gemini model.
- Temporary AI service errors or high demand may prevent generation.
- AI-generated answers should be reviewed for accuracy.
- Quiz answers use self-assessment rather than automatic natural-language evaluation.
- The application does not currently persist study sessions after the page is refreshed.
- The application does not require user authentication.
- API availability and usage limits may affect response generation.

## Deployment

The application is deployed using Render.

Frontend:

https://flam-frontend-dvip.onrender.com

Backend:

https://flam-frontend-assignment-09qf.onrender.com

The frontend uses the `VITE_API_URL` environment variable to connect to the deployed backend.

## Testing Checklist

Before submitting, test the following:

- [ ] The application opens successfully.
- [ ] A valid study topic generates study material.
- [ ] Empty input displays a validation message.
- [ ] Summary is displayed.
- [ ] Key points are displayed.
- [ ] Flashcards are displayed.
- [ ] Flashcards can be flipped.
- [ ] Previous and next navigation works.
- [ ] Quiz mode works.
- [ ] Quiz score is displayed.
- [ ] Incorrect answers are tracked.
- [ ] Re-test mode works.
- [ ] API errors display a readable message.
- [ ] The layout works on mobile.
- [ ] The API key is not committed to GitHub.
- [ ] The deployed frontend connects to the backend.

## Known Future Improvements

Possible future improvements include:

- Automatically evaluating typed quiz answers.
- Saving and restoring study sessions.
- Adding authentication.
- Adding additional learning modes.
- Adding more detailed progress tracking.
- Supporting different types of structured content.
- Adding animations and keyboard navigation.

## Time Spent

Update this section with the actual approximate time spent developing, testing, debugging, and deploying the project.

Approximate time spent:

[Enter your actual time here]

## Author

M M Nidhipa

GitHub:

https://github.com/Nidhipa17