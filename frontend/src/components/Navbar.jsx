
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-base-100/60 border-b border-base-300 shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-base-content">OnlyChat</h1>
          </Link>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Settings always visible */}
            <Link to="/settings" className="btn btn-sm btn-ghost gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Authenticated users */}
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm btn-ghost gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="btn btn-sm btn-ghost gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {/* On homepage, if not logged in */}
            {!authUser && isHome && (
              <>
                <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
                <Link to="/signup" className="btn btn-sm btn-outline">Sign Up</Link>
              </>
            )}

            {/* On login page, just in case */}
          {!authUser && isLoginPage && (
  <>
    <Link to="/profile" className="btn btn-sm btn-ghost gap-2">
      <User className="size-5" />
      <span className="hidden sm:inline">Profile</span>
    </Link>
    <button className="btn btn-sm btn-ghost gap-2" onClick={logout}>
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  </>
)}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
