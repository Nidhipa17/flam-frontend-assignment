
function ErrorState({ message, onRetry }) {
  return (
    <section className="error-state">
      <div className="error-icon">⚠️</div>

      <h2>Something went wrong</h2>

      <p>{message}</p>

      <button
        type="button"
        className="secondary-button"
        onClick={onRetry}
      >
        Try Again
      </button>
    </section>
  );
}

export default ErrorState;