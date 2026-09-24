
import { useState } from "react";

function FlashcardDeck({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    return (
      <div className="flashcard-empty">
        <p>No flashcards are available.</p>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  return (
    <section className="flashcard-section">
      <div className="section-heading">
        <span className="section-label">PRACTICE</span>
        <h2>Interactive Flashcards</h2>
        <p>Test your understanding of the topic.</p>
      </div>

      <div className="flashcard-progress">
        Card {currentIndex + 1} of {totalCards}
      </div>

      <div className="flashcard">
        <div className="flashcard-number">
          Question {currentIndex + 1}
        </div>

        <h3 className="flashcard-question">
          {currentCard.question}
        </h3>

        {showAnswer && (
          <div className="flashcard-answer">
            <h4>Answer</h4>
            <p>{currentCard.answer}</p>
          </div>
        )}

        <button
          type="button"
          className="show-answer-button"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>

      <div className="flashcard-controls">
        <button
          type="button"
          className="secondary-button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {currentIndex === totalCards - 1 ? (
          <button
            type="button"
            className="primary-button"
            onClick={handleRestart}
          >
            Restart
          </button>
        ) : (
          <button
            type="button"
            className="primary-button"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}

export default FlashcardDeck;