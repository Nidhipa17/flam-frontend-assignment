
import { useState } from "react";
import "./App.css";

import { generateStudyMaterial } from "./lib/api";

import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [currentPrompt, setCurrentPrompt] = useState("");
  const [previousFlashcards, setPreviousFlashcards] = useState([]);

  // Generate complete study material for a new topic
  const handleGenerateStudyMaterial = async (prompt) => {
    setLoading(true);
    setLoadingMore(false);
    setError("");
    setResult(null);
    setCurrentPrompt(prompt);
    setPreviousFlashcards([]);

    try {
      const data = await generateStudyMaterial(
        prompt,
        [],
        false
      );

      setResult(data);
      setPreviousFlashcards(data.flashcards);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while generating study material."
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate only new flashcards
  const handleGenerateNewFlashcards = async () => {
    if (!currentPrompt || loading || loadingMore) {
      return;
    }

    setLoadingMore(true);
    setError("");

    try {
      const data = await generateStudyMaterial(
        currentPrompt,
        previousFlashcards,
        true
      );

      // Add new flashcards to the existing result
      setResult((currentResult) => ({
        ...currentResult,
        flashcards: [
          ...(currentResult?.flashcards || []),
          ...data.flashcards
        ]
      }));

      // Remember all flashcards to avoid repeated questions
      setPreviousFlashcards((previous) => [
        ...previous,
        ...data.flashcards
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while generating new flashcards."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Reset the application
  const handleReset = () => {
    setResult(null);
    setError("");
    setCurrentPrompt("");
    setPreviousFlashcards([]);
  };

  const isBusy = loading || loadingMore;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="header-badge">
            AI POWERED LEARNING
          </span>

          <h1>StudyDepth - Study Assistant</h1>

          <p>
            Learn difficult topics through summaries,
            key points, and interactive flashcards.
          </p>
        </div>
      </header>

      <main className="main-content">
        <section className="input-section">
          <PromptInput
            onSubmit={handleGenerateStudyMaterial}
            loading={isBusy}
          />
        </section>

        {/* Show loading screen only during initial generation */}
        {loading && !result && <LoadingState />}

        {/* Show errors when there is no active loading */}
        {error && !loading && !loadingMore && (
          <ErrorState
            message={error}
            onRetry={() => setError("")}
          />
        )}

        {/* Keep existing result visible while new flashcards load */}
        {result && !loading && (
          <ResultView
            result={result}
            onReset={handleReset}
            onNewFlashcards={handleGenerateNewFlashcards}
            loading={loadingMore}
          />
        )}

        {/* Empty state */}
        {!loading && !loadingMore && !error && !result && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>

            <h2>Start learning something new</h2>

            <p>
              Enter a topic above to generate study material
              and interactive flashcards.
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built by M M NIDHIPA</p>
      </footer>
    </div>
  );
}

export default App;