import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, CheckCircle2, UserCheckIcon, Loader2 } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { getLanguageFlag } from "../components/FriendCard";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl">
             <BellIcon className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-semibold flex items-center gap-2 px-1">
                  <UserCheckIcon className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary badge-sm ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-100/40 backdrop-blur-md border border-base-200/50 hover:bg-base-100/60 transition-all duration-300"
                    >
                      <div className="card-body p-5">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="avatar ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-full">
                              <div className="w-14 h-14 rounded-full">
                                <img src={request.sender.profilePic || "/avatar.png"} alt={request.sender.fullName} className="object-cover" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="badge badge-secondary badge-outline text-xs gap-1">
                                  {getLanguageFlag(request.sender.nativeLanguage)}
                                  Native: <span className="capitalize">{request.sender.nativeLanguage}</span>
                                </span>
                                <span className="badge badge-ghost badge-outline text-xs gap-1">
                                  {getLanguageFlag(request.sender.learningLanguage)}
                                  Learning: <span className="capitalize">{request.sender.learningLanguage}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 btn-sm sm:btn-md w-full sm:w-auto gap-2"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                            Accept Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                <h2 className="text-xl font-semibold flex items-center gap-2 px-1">
                  <MessageSquareIcon className="size-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-100/50 backdrop-blur-sm border border-base-200/50 hover:bg-base-100/80 transition-all">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-4">
                          <div className="avatar mt-1">
                            <div className="size-10 rounded-full ring-1 ring-base-content/10">
                              <img
                                src={notification.recipient.profilePic || "/avatar.png"}
                                alt={notification.recipient.fullName}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                               <div>
                                 <h3 className="font-bold">{notification.recipient.fullName}</h3>
                                 <p className="text-base-content/70 text-sm mt-0.5">
                                   Accepted your friend request
                                 </p>
                               </div>
                               <div className="badge badge-success badge-sm gap-1 text-white">
                                 <MessageSquareIcon className="size-3" />
                                 New Friend
                               </div>
                            </div>
                            <p className="text-xs text-base-content/40 flex items-center mt-2 group-hover:text-base-content/60 transition-colors">
                              <ClockIcon className="size-3 mr-1" />
                              Just now
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
