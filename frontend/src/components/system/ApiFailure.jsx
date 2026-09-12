const ApiFailure = ({ message, onRetry }) => (
  <div
    role="alert"
    className="max-w-lg mx-auto my-10 p-6 bg-base-200 rounded-box text-center space-y-4"
  >
    <p>{message}</p>
    <button type="button" className="btn btn-primary" onClick={onRetry}>
      Try again
    </button>
  </div>
);
export default ApiFailure;
