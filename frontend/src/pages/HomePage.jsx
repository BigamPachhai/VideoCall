import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getFriendRequests,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Globe, Sparkles, MessageCircle } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const interactionIds = new Set();
    
    // Outgoing requests: we sent to them
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        interactionIds.add(req.recipient._id);
      });
    }

    // Incoming requests: they sent to us
    if (friendRequests?.incomingReqs && friendRequests.incomingReqs.length > 0) {
        friendRequests.incomingReqs.forEach((req) => {
            interactionIds.add(req.sender._id);
        });
    }

    setOutgoingRequestsIds(interactionIds);
  }, [outgoingFriendReqs, friendRequests]);

  return (
    <div className="">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-base-100 rounded-b-[3rem] shadow-xl border-b border-base-200 mb-12">
         {/* Background Decoration */}
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50" />
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" />
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" />

         <div className="container mx-auto px-6 py-16 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200/50 backdrop-blur-sm border border-base-content/10 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Sparkles className="size-3 text-yellow-500" />
               <span>Welcome back, Language Learner!</span>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-tight">
               Master Languages Through <br className="hidden sm:block" /> Real Conversations
             </h1>
             
             <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed">
               Connect with native speakers worldwide. Practice speaking, make friends, and level up your fluency with video calls and chat.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#recommended" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/30 min-w-[160px] group">
                   Find Partners
                   <Globe className="size-5 ml-2 group-hover:rotate-12 transition-transform" />
                </a>
                <a href="#friends" className="btn btn-neutral btn-lg min-w-[160px]">
                   My Friends
                   <MessageCircle className="size-5 ml-2" />
                </a>
             </div>
         </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20">
        
        {/* YOUR FRIENDS SECTION */}
        <section id="friends" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-secondary/10 rounded-lg">
                  <UsersIcon className="size-6 text-secondary" />
               </div>
               <h2 className="text-2xl font-bold tracking-tight">Your Network</h2>
            </div>
            
            <Link to="/notifications" className="btn btn-ghost hover:bg-base-200">
              <span className="relative">
                <UsersIcon className="size-5" />
                {friendRequests?.incomingReqs?.length > 0 && (
                   <span className="absolute -top-1 -right-1 size-2 bg-error rounded-full animate-pulse" />
                )}
              </span>
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                 <div key={i} className="h-64 rounded-2xl bg-base-200 animate-pulse" />
              ))}
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED USERS SECTION */}
        <section id="recommended" className="scroll-mt-24">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Meet New Learners</h2>
            <p className="text-lg text-base-content/70">
              Discover perfect language exchange partners based on your profile preferences.
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner text-primary loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-100/50 backdrop-blur-md border border-base-200 p-12 text-center shadow-lg max-w-md mx-auto">
              <div className="mx-auto w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6">
                 <Globe className="size-10 text-base-content/40" />
              </div>
              <h3 className="font-bold text-xl mb-3">No recommendations available</h3>
              <p className="text-base-content/60">
                We couldn't find any language partners for you right now. 
                They might be shy! Check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-100 shadow-xl shadow-base-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group ring-1 ring-base-200 overflow-hidden"
                  >
                    <div className="card-body p-6">
                      <div className="flex items-start justify-between mb-4">
                          <div className="avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-full transition-transform duration-300">
                             <div className="w-16 h-16 rounded-full aspect-square">
                               <img 
                                 src={user.profilePic || "/avatar.png"} 
                                 alt={user.fullName} 
                                 className="object-cover"
                                 onError={(e) => {
                                   e.target.onerror = null; 
                                   e.target.src = "/avatar.png";
                                 }}
                               />
                             </div>
                          </div>
                          {user.location && (
                             <div className="badge badge-ghost gap-1 opacity-70">
                               <MapPinIcon className="size-3" />
                               {user.location}
                             </div>
                          )}
                      </div>

                      <div className="mb-4">
                        <h3 className="font-bold text-xl truncate group-hover:text-primary transition-colors mb-1">{user.fullName}</h3>
                        <p className="text-sm text-base-content/60 line-clamp-2 min-h-[2.5rem]">
                           {user.bio || "Passionate language learner ready to connect!"}
                        </p>
                      </div>

                      {/* Languages */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                         <div className="bg-base-200/50 p-3 rounded-xl">
                            <p className="text-xs text-base-content/50 uppercase font-semibold mb-1">Native</p>
                            <div className="flex items-center gap-2">
                               {getLanguageFlag(user.nativeLanguage)}
                               <span className="font-medium capitalize text-sm">{user.nativeLanguage}</span>
                            </div>
                         </div>
                         <div className="bg-base-200/50 p-3 rounded-xl">
                            <p className="text-xs text-base-content/50 uppercase font-semibold mb-1">Learning</p>
                            <div className="flex items-center gap-2">
                               {getLanguageFlag(user.learningLanguage)}
                               <span className="font-medium capitalize text-sm">{user.learningLanguage}</span>
                            </div>
                         </div>
                      </div>

                      {/* Action button */}
                      <button
                        className={`btn w-full btn-lg min-h-[3rem] h-12 text-sm gap-2 shadow-sm transition-all duration-300 ${
                          hasRequestBeenSent 
                            ? "btn-disabled bg-base-300 text-base-content/50" 
                            : "btn-primary shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Connect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
