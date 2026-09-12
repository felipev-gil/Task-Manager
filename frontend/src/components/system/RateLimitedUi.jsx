import { ZapIcon } from "lucide-react";

const RateLimitedUi = ({ onRetry }) => {
  return (
    <div className="flex justify-center py-15">
      <div className="flex flex-col items-center justify-center border bg-primary/30 rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-4 p-6">
          <div className="bg-primary/20 p-4 rounded-full mr-6">
            <ZapIcon className="size-14 text-primary" />
          </div>
          <div>
            <h3 className="text-lg mb-2 text-base-content font-semibold">
              Rate Limit Reached
            </h3>
            <p className="text-md text-base-content">
              You've made too many requests in a short period. Please wait a
              moment.
            </p>
            <p className="text-md text-base-content">
              Try again in a few seconds for the best experience.
            </p>
            {onRetry && (
              <button className="btn btn-primary mt-4" onClick={onRetry}>
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUi;
