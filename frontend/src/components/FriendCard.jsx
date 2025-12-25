import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100/40 backdrop-blur-md border border-base-200/50 hover:shadow-xl hover:bg-base-100/60 transition-all duration-300 group hover:-translate-y-1">
      <div className="card-body p-5">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full">
              <img 
                src={friend.profilePic || "/avatar.png"} 
                alt={friend.fullName} 
                className="object-cover"
                onError={(e) => {
                  e.target.onerror = null; // prevents looping
                  e.target.src = "/avatar.png";
                }}
              />
            </div>
          <div className="min-w-0">
             <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{friend.fullName}</h3>
             <p className="text-xs text-base-content/60 truncate">Online</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between text-sm bg-base-200/50 p-2 rounded-lg">
             <span className="opacity-70">Native</span>
             <span className="font-medium flex items-center gap-1">
                {getLanguageFlag(friend.nativeLanguage)} 
                <span className="capitalize">{friend.nativeLanguage}</span>
             </span>
          </div>
          <div className="flex items-center justify-between text-sm bg-base-200/50 p-2 rounded-lg">
             <span className="opacity-70">Learning</span>
             <span className="font-medium flex items-center gap-1">
                {getLanguageFlag(friend.learningLanguage)} 
                <span className="capitalize">{friend.learningLanguage}</span>
             </span>
          </div>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-block shadow-lg shadow-primary/20 hover:shadow-primary/40">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
