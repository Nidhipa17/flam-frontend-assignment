
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "Error: GEMINI_API_KEY is missing in the .env file."
  );

  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.1-flash-lite";

app.use(cors());
app.use(express.json());

// =========================================
// VALIDATE COMPLETE STUDY MATERIAL
// =========================================

function validateStudyMaterial(result) {
  if (!result || typeof result !== "object") {
    return {
      valid: false,
      message: "The response is not a valid object."
    };
  }

  if (
    typeof result.topic !== "string" ||
    result.topic.trim() === ""
  ) {
    return {
      valid: false,
      message: "The response is missing a valid topic."
    };
  }

  if (
    typeof result.summary !== "string" ||
    result.summary.trim() === ""
  ) {
    return {
      valid: false,
      message: "The response is missing a valid summary."
    };
  }

  if (
    !Array.isArray(result.keyPoints) ||
    result.keyPoints.length === 0
  ) {
    return {
      valid: false,
      message: "The response must contain key points."
    };
  }

  return validateFlashcards(result.flashcards);
}

// =========================================
// VALIDATE FLASHCARDS
// =========================================

function validateFlashcards(flashcards) {
  if (
    !Array.isArray(flashcards) ||
    flashcards.length === 0
  ) {
    return {
      valid: false,
      message: "The response must contain flashcards."
    };
  }

  const hasInvalidFlashcard = flashcards.some(
    (card) =>
      !card ||
      typeof card !== "object" ||
      typeof card.question !== "string" ||
      card.question.trim() === "" ||
      typeof card.answer !== "string" ||
      card.answer.trim() === ""
  );

  if (hasInvalidFlashcard) {
    return {
      valid: false,
      message: "One or more flashcards are invalid."
    };
  }

  return {
    valid: true,
    message: "The flashcards are valid."
  };
}

// =========================================
// RESPONSE SCHEMAS
// =========================================

const completeResponseSchema = {
  type: "object",
  properties: {
    topic: {
      type: "string"
    },
    summary: {
      type: "string"
    },
    keyPoints: {
      type: "array",
      items: {
        type: "string"
      }
    },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string"
          },
          answer: {
            type: "string"
          }
        },
        required: ["question", "answer"],
        propertyOrdering: ["question", "answer"]
      }
    }
  },
  required: [
    "topic",
    "summary",
    "keyPoints",
    "flashcards"
  ],
  propertyOrdering: [
    "topic",
    "summary",
    "keyPoints",
    "flashcards"
  ]
};

const flashcardsOnlySchema = {
  type: "object",
  properties: {
    topic: {
      type: "string"
    },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string"
          },
          answer: {
            type: "string"
          }
        },
        required: ["question", "answer"],
        propertyOrdering: ["question", "answer"]
      }
    }
  },
  required: ["topic", "flashcards"],
  propertyOrdering: ["topic", "flashcards"]
};

// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Study Assistant backend is running."
  });
});

// =========================================
// GENERATE STUDY MATERIAL
// =========================================

app.post("/api/generate", async (req, res) => {
  try {
    const {
      prompt,
      previousFlashcards = [],
      onlyFlashcards = false
    } = req.body;

    if (
      typeof prompt !== "string" ||
      prompt.trim() === ""
    ) {
      return res.status(400).json({
        message: "Please enter a valid study topic."
      });
    }

    const topic = prompt.trim();

    // Collect questions from previous flashcard sets
    const previousQuestions = Array.isArray(previousFlashcards)
      ? previousFlashcards
          .filter(
            (card) =>
              card &&
              typeof card.question === "string"
          )
          .map((card) => card.question.trim())
          .filter(Boolean)
      : [];

    const previousQuestionsText =
      previousQuestions.length > 0
        ? previousQuestions
            .map(
              (question, index) =>
                `${index + 1}. ${question}`
            )
            .join("\n")
        : "No previous questions exist.";

    // =========================================
    // CREATE PROMPT
    // =========================================

    let instruction;

    if (onlyFlashcards) {
      instruction = `
You are an educational study assistant.

Topic:
${topic}

Generate exactly 5 NEW question-and-answer flashcards.

IMPORTANT RULES:

- Generate only flashcards.
- Do not generate a summary.
- Do not generate key points.
- Do not repeat any previous question.
- Do not create slightly reworded versions of previous questions.
- Cover different concepts, examples, applications, or details.
- Use clear and beginner-friendly language.
- Every flashcard must contain a question and an answer.

Previous questions to avoid:

${previousQuestionsText}

Return only the requested JSON structure.
`;
    } else {
      instruction = `
You are an educational study assistant.

Generate study material for this topic:

${topic}

Generate:

1. topic:
   The name of the study topic.

2. summary:
   A clear and beginner-friendly explanation.

3. keyPoints:
   At least 5 important points.

4. flashcards:
   Exactly 5 question-and-answer flashcards.

IMPORTANT RULES:

- Use clear and beginner-friendly language.
- Every flashcard must contain a question and an answer.
- Do not repeat any previous question.

Previous questions to avoid:

${previousQuestionsText}

Return only the requested JSON structure.
`;
    }

    const schema = onlyFlashcards
      ? flashcardsOnlySchema
      : completeResponseSchema;

    console.log(
      onlyFlashcards
        ? "Generating flashcards only..."
        : "Generating complete study material..."
    );

    // =========================================
    // CALL GEMINI
    // =========================================

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: instruction,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: schema
      }
    });

    const generatedText = response?.text;

    if (
      typeof generatedText !== "string" ||
      generatedText.trim() === ""
    ) {
      return res.status(502).json({
        message: "The AI returned an empty response."
      });
    }

    let generatedMaterial;

    try {
      generatedMaterial = JSON.parse(generatedText);
    } catch (error) {
      console.error(
        "JSON parsing error:",
        error
      );

      return res.status(502).json({
        message: "The AI returned invalid JSON."
      });
    }

    // =========================================
    // VALIDATE RESPONSE
    // =========================================

    if (onlyFlashcards) {
      const validation = validateFlashcards(
        generatedMaterial.flashcards
      );

      if (!validation.valid) {
        return res.status(502).json({
          message: validation.message
        });
      }
    } else {
      const validation = validateStudyMaterial(
        generatedMaterial
      );

      if (!validation.valid) {
        return res.status(502).json({
          message: validation.message
        });
      }
    }

    // =========================================
    // REMOVE DUPLICATE QUESTIONS
    // =========================================

    const previousQuestionSet = new Set(
      previousQuestions.map((question) =>
        question.toLowerCase().trim()
      )
    );

    const uniqueFlashcards =
      generatedMaterial.flashcards.filter(
        (card) =>
          !previousQuestionSet.has(
            card.question.toLowerCase().trim()
          )
      );

    if (uniqueFlashcards.length === 0) {
      return res.status(502).json({
        message:
          "The AI generated repeated questions. Please try again."
      });
    }

    generatedMaterial.flashcards = uniqueFlashcards;

    // =========================================
    // SEND RESPONSE
    // =========================================

    return res.status(200).json(generatedMaterial);
  } catch (error) {
    console.error(
      "Error generating study material:",
      error
    );

    if (error?.status === 503) {
      return res.status(503).json({
        message:
          "The AI service is temporarily busy. Please try again in a few seconds."
      });
    }

    return res.status(500).json({
      message:
        "Something went wrong while generating study material."
    });
  }
});

// =========================================
// START SERVER
// =========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Backend server running on port ${PORT}`
  );
});