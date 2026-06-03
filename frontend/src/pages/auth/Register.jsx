import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/auth.service";
import { handleApiError } from "../../utils/handleApiError";

const Register = () => {
  const { saveUser, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.register(formData);
      saveUser(userData, userData.token);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      handleApiError(error, "Registration failed");
    }
  };

  return (
    <div className="flex justify-center w-full pt-10">
      <div className="bg-secondary-content p-12 max-w-lg w-full rounded-lg shadow-md shadow-current text-center">
        <Link
          to={"/"}
          className="btn flex-start btn-ghost mb-6 text-base-content"
        >
          <ArrowLeftIcon className="size-5" /> Back to Home
        </Link>
        {authError && <p className="text-red-500 mb-4 text-sm">{authError}</p>}
        <div className="flex flex-col py-7">
          <form onSubmit={handleSubmit}>
            <fieldset className="border border-primary rounded-lg p-6">
              <legend className="px-6 font-bold text-2xl">
                Registration Information
              </legend>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="register-name" className="font-semibold">
                  Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="register-username" className="font-semibold">
                  Username
                </label>
                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="register-email" className="font-semibold">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="register-password" className="font-semibold">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                  className="input input-lg w-full p-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <button className="w-full btn btn-primary btn-lg mt-5">
                Register
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
