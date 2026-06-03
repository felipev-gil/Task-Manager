import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center text-center h-auto py-20">
      <div>
        <h1 className="text-9xl mb-6 text-base-content font-extrabold">404</h1>
        <p className="text-4xl mb-6 text-base-content font-semibold">
          Something's missing.
        </p>
        <p className="text-lg text-base-content mb-6">
          Sorry, we can't find that page. Go back to explore on the home page.
        </p>
        <Link to="/" className="btn btn-primary btn-lg mb-6">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
