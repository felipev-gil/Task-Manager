import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/auth.service";
import { handleApiError } from "../../utils/handleApiError";

const Login = () => {
  const navigate = useNavigate();
  const { saveUser, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.login(formData);
      saveUser(userData, userData.token);
      toast.success("Logged in successfully!");
      navigate("/tasks");
    } catch (error) {
      handleApiError(error, "Failed to log in");
    }
  };

  return (
    <div className="flex justify-center w-full pt-30">
      <div className="bg-secondary-content p-12 max-w-lg w-full rounded-lg shadow-md shadow-current text-center">
        <Link
          to={"/"}
          className="btn flex-start btn-ghost mb-6 text-base-content"
        >
          <ArrowLeftIcon className="size-5" /> Back to Home
        </Link>
        <p className="text-sm text-error py-4">{authError}</p>
        <div className="flex flex-col py-7">
          <form onSubmit={handleSubmit}>
            <fieldset className="border border-primary rounded-lg p-6">
              <legend className="px-6 font-bold text-2xl">Sign In</legend>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="login-email" className="font-semibold">
                  Email
                </label>
                <input
                  id="login-email"
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="login-password" className="font-semibold">
                  Password
                </label>
                <input
                  id="login-password"
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button className="w-full btn btn-primary btn-lg mt-5">
                Login
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
