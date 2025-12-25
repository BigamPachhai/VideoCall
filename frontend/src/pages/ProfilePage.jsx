import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import { Camera, RefreshCw, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const [image, setImage] = useState(authUser?.profilePic || "");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSave = () => {
    mutate({ profilePic: image });
  };

  const handleRandomize = () => {
    const randomId = Math.floor(Math.random() * 100) + 1;
    setImage(`https://avatar.iran.liara.run/public/${randomId}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        
        <div className="bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-base-200/50 overflow-hidden">
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 relative">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <div className="px-8 pb-8 relative">
             {/* Profile Image Section */}
             <div className="relative -mt-24 mb-8 flex flex-col items-center">
                <div className="relative group">
                   <div className="avatar">
                     <div className="w-40 h-40 rounded-full ring-4 ring-base-100 ring-offset-4 ring-offset-base-100 shadow-2xl">
                       <img
                         src={image || "/avatar.png"}
                         alt="Profile"
                         className="object-cover"
                         onError={(e) => (e.target.src = "/avatar.png")}
                       />
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="absolute -bottom-2 -right-2 flex gap-2">
                      <button
                        onClick={() => document.getElementById("fileInput").click()}
                        className="btn btn-circle btn-secondary shadow-lg hover:scale-105 transition-transform"
                        title="Upload Photo"
                      >
                        <Camera className="size-5" />
                      </button>
                      <button
                        onClick={handleRandomize}
                        className="btn btn-circle btn-primary shadow-lg hover:scale-105 transition-transform"
                        title="Randomize Avatar"
                      >
                        <RefreshCw className="size-5" />
                      </button>
                   </div>
                   
                   <input 
                       id="fileInput" 
                       type="file" 
                       accept="image/*" 
                       className="hidden" 
                       onChange={handleImageUpload} 
                   />
                </div>
                
                <h1 className="text-3xl font-bold mt-4">{authUser?.fullName}</h1>
                <p className="text-base-content/60">{authUser?.email}</p>
             </div>

             {/* Form Section */}
             <div className="space-y-8 max-w-2xl mx-auto">
                {/* Profile Pic URL - Optional */}
                <div className="collapse collapse-arrow bg-base-200/50 rounded-xl">
                   <input type="checkbox" /> 
                   <div className="collapse-title font-medium flex items-center gap-2">
                      <span>Advanced: Image URL</span>
                   </div>
                   <div className="collapse-content">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Profile Picture URL</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full bg-base-100"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://example.com/my-photo.jpg"
                        />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="form-control">
                      <label className="label pl-0">
                        <span className="label-text font-medium text-base-content/70">Native Language</span>
                      </label>
                      <div className="input input-bordered flex items-center gap-2 bg-base-200/30">
                         {/* We could use getLanguageFlag here if imported */}
                         <span className="font-semibold capitalize">{authUser?.nativeLanguage}</span>
                      </div>
                   </div>
                   <div className="form-control">
                      <label className="label pl-0">
                        <span className="label-text font-medium text-base-content/70">Learning Language</span>
                      </label>
                      <div className="input input-bordered flex items-center gap-2 bg-base-200/30">
                         <span className="font-semibold capitalize">{authUser?.learningLanguage}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="btn btn-primary btn-block shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
                    disabled={isPending}
                  >
                    {isPending ? <span className="loading loading-spinner" /> : "Save Changes"}
                  </button>
                </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
