export function validateResult(result) {
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

  if (
    !Array.isArray(result.flashcards) ||
    result.flashcards.length === 0
  ) {
    return {
      valid: false,
      message: "The response must contain flashcards."
    };
  }

  const hasInvalidKeyPoint = result.keyPoints.some(
    (point) =>
      typeof point !== "string" ||
      point.trim() === ""
  );

  if (hasInvalidKeyPoint) {
    return {
      valid: false,
      message: "One or more key points are invalid."
    };
  }

  const hasInvalidFlashcard = result.flashcards.some(
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
    message: "The response is valid."
  };
}