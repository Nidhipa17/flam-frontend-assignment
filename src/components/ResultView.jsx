import FlashcardDeck from "./FlashcardDeck";

function ResultView({ result, onReset }) {
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
    </section>
  );
}

export default ResultView;