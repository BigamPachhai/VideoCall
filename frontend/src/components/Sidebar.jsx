import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <aside className="w-80 bg-base-100/80 backdrop-blur-2xl border-r border-base-200/50 hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
             <ShipWheelIcon className="size-8 text-white" />
          </div>
          <span className="text-3xl font-extrabold font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/70">
            Streamify
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar pt-4">
        <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest px-4 mb-4">Menu</p>
        
        <Link
          to="/"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive("/") 
              ? "bg-primary text-primary-content shadow-xl shadow-primary/25 translate-x-1" 
              : "hover:bg-base-200/50 text-base-content/60 hover:text-base-content hover:shadow-sm"
          }`}
        >
          <HomeIcon className={`size-6 ${isActive("/") ? "text-primary-content" : "group-hover:text-primary transition-colors"}`} />
          <span className="font-semibold text-base">Home</span>
        </Link>

        <a
          href="/#friends"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group hover:bg-base-200/50 text-base-content/60 hover:text-base-content hover:shadow-sm`}
        >
          <UsersIcon className="size-6 group-hover:text-primary transition-colors" />
          <span className="font-semibold text-base">Friends</span>
        </a>

        <Link
          to="/notifications"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive("/notifications") 
              ? "bg-primary text-primary-content shadow-xl shadow-primary/25 translate-x-1" 
              : "hover:bg-base-200/50 text-base-content/60 hover:text-base-content hover:shadow-sm"
          }`}
        >
          <BellIcon className={`size-6 ${isActive("/notifications") ? "text-primary-content" : "group-hover:text-primary transition-colors"}`} />
          <span className="font-semibold text-base">Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-6 mt-auto">
        <div className="bg-base-200/40 rounded-[2rem] p-4 border border-base-200 transition-all hover:bg-base-200/60 hover:shadow-md cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="avatar online relative">
              <div className="w-12 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 group-hover:scale-105 transition-transform">
                <img src={authUser?.profilePic || "/avatar.png"} alt="User Avatar" className="object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base truncate group-hover:text-primary transition-colors">{authUser?.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                 <span className="size-2 rounded-full bg-success animate-pulse" />
                 <p className="text-xs font-medium text-base-content/50">Online Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
