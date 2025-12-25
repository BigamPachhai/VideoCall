import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, ensureStreamUser } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const {
    data: tokenData,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let output = { destroyed: false };
    
    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if the client is already connected to the correct user
        if (client.userID === authUser._id) {
           // Reuse existing connection
        } else if (client.userID) {
          // Connected to different user, disconnect first
          await client.disconnectUser();
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        } else {
           // Not connected at all, connect now
           await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        if (output.destroyed) return;

        // Ensure target user exists
        try {
          await ensureStreamUser(targetUserId);
        } catch (error) {
           console.error("Error ensuring target user:", error);
           // We continue anyway, as they might already exist
        }

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (!output.destroyed) {
          setChatClient(client);
          setChannel(currChannel);
          setLoading(false);
        }

      } catch (error) {
        console.error("Error initializing chat:", error);
        if (!output.destroyed) {
          toast.error("Connection failed. Please refresh.");
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      output.destroyed = true;
      // We don't necessarily want to disconnect the user on every unmount in dev mode
      // as it causes "consecutive calls" errors on remount.
      // But for production correctness we usually should.
      // For this specific issue, we will rely on the check `client.userID === authUser._id` to reuse connection.
    };
  }, [tokenData, authUser, targetUserId]);

  if (isTokenError) {
    return (
      <div className="h-[93vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Connection failed.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || isTokenLoading || !chatClient || !channel)
    return <ChatLoader />;

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4">
      <div className="w-full h-full max-w-7xl bg-base-100/40 backdrop-blur-xl border border-base-200/50 rounded-2xl shadow-2xl overflow-hidden glass-effect flex flex-col relative">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            <Window>
              <div className="flex items-center justify-between p-3 border-b border-base-200/50 bg-base-100/50 backdrop-blur-md sticky top-0 z-10">
                 <ChannelHeader />
                 <CallButton handleVideoCall={handleVideoCall} />
              </div>
              <MessageList className="no-scrollbar" />
              <div className="p-3 bg-base-100/50 backdrop-blur-md border-t border-base-200/50">
                 <MessageInput focus />
              </div>
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};
export default ChatPage;
