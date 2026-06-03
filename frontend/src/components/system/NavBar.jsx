import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeSelector from "./ThemeSelector";

const NavBar = () => {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    setDrawerOpen(false);
    toast.success("Successfully logged out.");
    handleLogout();
    navigate("/", { replace: true });
  };

  return (
    <div className="drawer">
      <input
        id="drawer"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full">
          <div className="mx-2 flex-1 px-2">
            <Link to="/tasks" className="text-4xl font-bold text-primary">
              Task Manager
            </Link>
          </div>

          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal items-center gap-4">
              {user && (
                <>
                  <li>
                    <Link to="/tasks" className="btn btn-primary">
                      Tasks
                    </Link>
                  </li>
                  <li>
                    <Link to="/archived" className="btn btn-primary">
                      Archived
                    </Link>
                  </li>
                </>
              )}
              <li>
                <ThemeSelector />
              </li>
              {user && (
                <>
                  <li>
                    <button
                      onClick={handleLogoutClick}
                      className="btn btn-primary w-full"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex-none lg:hidden">
            <button
              id="openMenu"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="btn btn-square btn-ghost"
            >
              <Menu className="size-14 text-primary pt-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="drawer-side">
        <button
          id="drawerSide"
          className="drawer-overlay"
          aria-label="close sidebar"
          onClick={() => setDrawerOpen(false)}
        />
        <ul className="menu bg-base-200 min-h-full w-67 p-4 pt-6">
          <li className="text-2xl font-bold text-primary items-center">Menu</li>
          {user && (
            <>
              <li className="pt-5">
                <Link
                  to="/tasks"
                  className="btn btn-primary w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  Tasks
                </Link>
              </li>
              <li className="pt-5">
                <Link
                  to="/archived"
                  className="btn btn-primary w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  Archived
                </Link>
              </li>
            </>
          )}
          <li className="pt-5">
            <ThemeSelector />
          </li>
          {user && (
            <>
              <li className="mt-auto mb-4">
                <button
                  onClick={handleLogoutClick}
                  className="btn btn-primary w-full"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
