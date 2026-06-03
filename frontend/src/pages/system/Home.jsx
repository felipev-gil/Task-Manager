import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-full pt-50">
      <div className="bg-secondary-content p-12 max-w-lg w-full rounded-lg shadow-md shadow-current text-center">
        <h2 className="text-2xl mb-6 text-base-content font-semibold">
          Welcome!
        </h2>
        <h2 className="text-2xl mb-6 text-base-content font-semibold">
          Please log in or register
        </h2>
        <div className="flex flex-col py-7 space-y-6">
          <Link className="btn btn-primary btn-lg" to="/login">
            Login
          </Link>
          <Link className="btn btn-primary btn-lg" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
