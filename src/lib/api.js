
import { validateResult } from "./validateResult";

// Uses the Render backend URL in production.
// Uses the Vite proxy when running locally.
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function generateStudyMaterial(
  prompt,
  previousFlashcards = [],
  onlyFlashcards = false
) {
  if (
    typeof prompt !== "string" ||
    prompt.trim() === ""
  ) {
    throw new Error("Please enter a valid study topic.");
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          previousFlashcards,
          onlyFlashcards
        })
      }
    );
  } catch (error) {
    throw new Error(
      "Unable to connect to the server. Please check your connection."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "The server failed to generate study material."
    );
  }

  if (onlyFlashcards) {
    if (
      !Array.isArray(data.flashcards) ||
      data.flashcards.length === 0
    ) {
      throw new Error(
        "The server returned invalid flashcards."
      );
    }

    return data;
  }

  const validation = validateResult(data);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  return data;
}