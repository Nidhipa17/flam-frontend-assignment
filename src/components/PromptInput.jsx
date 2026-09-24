
import { useState } from "react";

function PromptInput({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState("");

  const MAX_LENGTH = 200;

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || loading) {
      return;
    }

    onSubmit(trimmedPrompt);
  };

  return (
    <div className="prompt-container">
      <div className="prompt-heading">
        <span className="section-label">LEARNING ASSISTANT</span>

        <h2>What do you want to learn?</h2>

        <p>
          Enter any topic and get a simple explanation,
          key points, and interactive flashcards.
        </p>
      </div>

      <form
        className="prompt-form"
        onSubmit={handleSubmit}
      >
        <label
          className="prompt-label"
          htmlFor="study-topic"
        >
          Study topic
        </label>

        <div className="prompt-field-group">
          <input
            id="study-topic"
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Explain Operating Systems"
            maxLength={MAX_LENGTH}
            disabled={loading}
            required
          />

          <div className="prompt-meta">
            <span>
              {prompt.trim()
                ? "Ready to learn"
                : "Enter a topic to begin"}
            </span>

            <span className="character-counter">
              {prompt.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="prompt-submit"
          disabled={loading || prompt.trim() === ""}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Generating...
            </>
          ) : (
            <>
              Generate Study Material
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default PromptInput;