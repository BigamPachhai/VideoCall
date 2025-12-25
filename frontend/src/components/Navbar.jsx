import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, User } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full mb-4 px-4 pt-4">
    <div className="mx-auto max-w-7xl backdrop-blur-xl bg-base-100/70 border border-base-200 shadow-sm rounded-2xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all duration-300">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <ShipWheelIcon className="size-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider hidden sm:block">
                Streamify
              </span>
            </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           {/* Notifications */}
          <Link to={"/notifications"} className="btn btn-ghost btn-circle btn-sm sm:btn-md relative group">
            <BellIcon className="size-5 sm:size-6 text-base-content/70 group-hover:text-primary transition-colors" />
            {/* Optional: Add badge here if notifications exist */}
          </Link>

          <ThemeSelector />

          {/* Profile Link */}
          <Link to="/profile" className="btn btn-ghost btn-circle btn-sm sm:btn-md group">
            <User className="size-5 sm:size-6 text-base-content/70 group-hover:text-primary transition-colors" />
          </Link>

          {/* Avatar */}
          <div className="avatar ring-2 ring-base-200 ring-offset-1 rounded-full hover:ring-primary transition-all duration-300">
            <div className="w-8 sm:w-9 rounded-full">
              <img src={authUser?.profilePic || "/avatar.png"} alt="User Avatar" className="object-cover" />
            </div>
          </div>

          {/* Logout button */}
          <button 
            className="btn btn-ghost btn-circle btn-sm sm:btn-md group tooltip tooltip-bottom" 
            data-tip="Logout"
            onClick={logoutMutation}
          >
            <LogOutIcon className="size-5 sm:size-6 text-base-content/70 group-hover:text-error transition-colors" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
