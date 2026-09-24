
import { useState } from "react";

function FlashcardDeck({ flashcards = [] }) {
  const [mode, setMode] = useState("flashcards");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [retestIndices, setRetestIndices] = useState([]);
  const [retestIndex, setRetestIndex] = useState(0);
  const [retestAnswers, setRetestAnswers] = useState({});
  const [retestRevealed, setRetestRevealed] = useState(false);
  const [retestCompleted, setRetestCompleted] = useState(false);

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    return (
      <section className="flashcard-section">
        <h3>Flashcards</h3>

        <p>No flashcards are available for this topic.</p>
      </section>
    );
  }

  const currentCard = flashcards[currentIndex];
  const quizCard = flashcards[quizIndex];

  const retestCards = retestIndices
    .map((index) => flashcards[index])
    .filter(Boolean);

  const retestCard = retestCards[retestIndex];

  const resetFlashcardMode = () => {
    setMode("flashcards");
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const startQuiz = () => {
    setMode("quiz");
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizRevealed(false);
    setWrongAnswers([]);
    setQuizCompleted(false);
  };

  const startRetest = () => {
    if (wrongAnswers.length === 0) {
      return;
    }

    setRetestIndices([...wrongAnswers]);
    setMode("retest");
    setRetestIndex(0);
    setRetestAnswers({});
    setRetestRevealed(false);
    setRetestCompleted(false);
  };

  const goToPreviousCard = () => {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex - 1);
    setIsFlipped(false);
  };

  const goToNextCard = () => {
    if (currentIndex === flashcards.length - 1) {
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex + 1);
    setIsFlipped(false);
  };

  const revealQuizAnswer = () => {
    setQuizRevealed(true);
  };

  const markQuizAnswer = (isCorrect) => {
    setQuizAnswers((previousAnswers) => ({
      ...previousAnswers,
      [quizIndex]: isCorrect
    }));

    if (!isCorrect && !wrongAnswers.includes(quizIndex)) {
      setWrongAnswers((previousWrongAnswers) => [
        ...previousWrongAnswers,
        quizIndex
      ]);
    }

    if (isCorrect) {
      setWrongAnswers((previousWrongAnswers) =>
        previousWrongAnswers.filter((index) => index !== quizIndex)
      );
    }
  };

  const goToNextQuizQuestion = () => {
    if (quizIndex === flashcards.length - 1) {
      setQuizCompleted(true);
      return;
    }

    setQuizIndex((previousIndex) => previousIndex + 1);
    setQuizRevealed(false);
  };

  const revealRetestAnswer = () => {
    setRetestRevealed(true);
  };

  const markRetestAnswer = (isCorrect) => {
    const originalIndex = retestIndices[retestIndex];

    setRetestAnswers((previousAnswers) => ({
      ...previousAnswers,
      [retestIndex]: isCorrect
    }));

    if (isCorrect) {
      setWrongAnswers((previousWrongAnswers) =>
        previousWrongAnswers.filter((index) => index !== originalIndex)
      );
    } else if (!wrongAnswers.includes(originalIndex)) {
      setWrongAnswers((previousWrongAnswers) => [
        ...previousWrongAnswers,
        originalIndex
      ]);
    }
  };

  const goToNextRetestQuestion = () => {
    if (retestIndex === retestCards.length - 1) {
      setRetestCompleted(true);
      return;
    }

    setRetestIndex((previousIndex) => previousIndex + 1);
    setRetestRevealed(false);
  };

  const calculateQuizScore = () => {
    return Object.values(quizAnswers).filter(
      (answer) => answer === true
    ).length;
  };

  const calculateRetestScore = () => {
    return Object.values(retestAnswers).filter(
      (answer) => answer === true
    ).length;
  };

  return (
    <section className="flashcard-section">
      <div className="flashcard-section-header">
        <div>
          <span className="section-label">ACTIVE LEARNING</span>

          <h3>Flashcards</h3>
        </div>

        <span className="flashcard-count">
          {flashcards.length} cards
        </span>
      </div>

      <div className="flashcard-mode-buttons">
        <button
          type="button"
          className={
            mode === "flashcards"
              ? "primary-button"
              : "secondary-button"
          }
          onClick={resetFlashcardMode}
        >
          Flashcards
        </button>

        <button
          type="button"
          className={
            mode === "quiz"
              ? "primary-button"
              : "secondary-button"
          }
          onClick={startQuiz}
        >
          Take Quiz
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={startRetest}
          disabled={wrongAnswers.length === 0}
        >
          Re-test Wrong Answers
        </button>
      </div>

      {mode === "flashcards" && (
        <div className="flashcard-learning-area">
          <button
            type="button"
            className="flashcard-card"
            onClick={() =>
              setIsFlipped((previous) => !previous)
            }
            aria-label="Click to flip the flashcard"
          >
            <span className="flashcard-number">
              Card {currentIndex + 1} of {flashcards.length}
            </span>

            <h4>{isFlipped ? "Answer" : "Question"}</h4>

            <p>
              {isFlipped
                ? currentCard.answer
                : currentCard.question}
            </p>

            <span className="flashcard-hint">
              {isFlipped
                ? "Click to view the question"
                : "Click to reveal the answer"}
            </span>
          </button>

          <div className="flashcard-navigation">
            <button
              type="button"
              className="secondary-button"
              onClick={goToPreviousCard}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={goToNextCard}
              disabled={
                currentIndex === flashcards.length - 1
              }
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {mode === "quiz" && (
        <div className="quiz-area">
          {!quizCompleted ? (
            <>
              <div className="quiz-progress">
                Question {quizIndex + 1} of {flashcards.length}
              </div>

              <div className="quiz-card">
                <h4>{quizCard.question}</h4>

                <p>
                  Think about your answer before revealing
                  the correct answer.
                </p>

                {!quizRevealed ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={revealQuizAnswer}
                  >
                    Reveal Answer
                  </button>
                ) : (
                  <>
                    <div className="quiz-answer">
                      <strong>Correct answer:</strong>

                      <p>{quizCard.answer}</p>
                    </div>

                    <p>
                      Were you able to answer the question
                      correctly?
                    </p>

                    <div className="quiz-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => markQuizAnswer(true)}
                      >
                        I got it right
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => markQuizAnswer(false)}
                      >
                        I got it wrong
                      </button>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  className="primary-button"
                  onClick={goToNextQuizQuestion}
                  disabled={
                    quizAnswers[quizIndex] === undefined
                  }
                >
                  {quizIndex === flashcards.length - 1
                    ? "Finish Quiz"
                    : "Next Question →"}
                </button>
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <h4>Quiz Completed!</h4>

              <p>
                Your score: {calculateQuizScore()} /{" "}
                {flashcards.length}
              </p>

              <p>
                Incorrect answers: {wrongAnswers.length}
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={startRetest}
                disabled={wrongAnswers.length === 0}
              >
                Re-test Wrong Answers
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={startQuiz}
              >
                Try Quiz Again
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "retest" && (
        <div className="retest-area">
          {retestCards.length === 0 ? (
            <div className="quiz-result">
              <h4>No Wrong Answers</h4>

              <p>
                Great work! There are no incorrect answers
                to re-test.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={resetFlashcardMode}
              >
                Back to Flashcards
              </button>
            </div>
          ) : !retestCompleted ? (
            <>
              <div className="quiz-progress">
                Re-test Question {retestIndex + 1} of{" "}
                {retestCards.length}
              </div>

              <div className="quiz-card">
                <h4>{retestCard.question}</h4>

                <p>
                  Try answering this question from memory.
                </p>

                {!retestRevealed ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={revealRetestAnswer}
                  >
                    Reveal Answer
                  </button>
                ) : (
                  <>
                    <div className="quiz-answer">
                      <strong>Correct answer:</strong>

                      <p>{retestCard.answer}</p>
                    </div>

                    <p>
                      Do you understand the answer now?
                    </p>

                    <div className="quiz-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => markRetestAnswer(true)}
                      >
                        I got it right
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => markRetestAnswer(false)}
                      >
                        Still need practice
                      </button>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  className="primary-button"
                  onClick={goToNextRetestQuestion}
                  disabled={
                    retestAnswers[retestIndex] === undefined
                  }
                >
                  {retestIndex === retestCards.length - 1
                    ? "Finish Re-test"
                    : "Next Question →"}
                </button>
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <h4>Re-test Completed!</h4>

              <p>
                Score: {calculateRetestScore()} /{" "}
                {retestCards.length}
              </p>

              <p>
                Remaining questions to practice:{" "}
                {wrongAnswers.length}
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={startRetest}
                disabled={wrongAnswers.length === 0}
              >
                Practice Remaining Questions
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetFlashcardMode}
              >
                Back to Flashcards
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default FlashcardDeck;