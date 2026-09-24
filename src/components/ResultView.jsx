
import FlashcardDeck from "./FlashcardDeck";

function ResultView({
  result,
  onReset,
  onNewFlashcards,
  loading
}) {
  return (
    <section className="result-section">
      <div className="result-header">
        <div className="result-title-container">
          <span className="section-label">
            GENERATED MATERIAL
          </span>

          <h2>{result.topic}</h2>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onReset}
          disabled={loading}
        >
          New Topic
        </button>
      </div>

      <div className="summary-card">
        <h3>Summary</h3>

        <p>{result.summary}</p>
      </div>

      <div className="key-points-card">
        <h3>Key Points</h3>

        <ul>
          {result.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <FlashcardDeck
        flashcards={result.flashcards}
      />

      <div className="new-flashcards-container">
        <div className="new-flashcards-content">
          <div>
            <span className="new-flashcards-icon">✨</span>

            <h3>Want more practice?</h3>

            <p>
              Generate a fresh set of flashcards
              without repeating the previous questions.
            </p>
          </div>

          <button
            type="button"
            className="new-flashcards-button"
            onClick={onNewFlashcards}
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : "Generate New Flashcards ↗"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ResultView;