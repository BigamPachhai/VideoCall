import { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="flex w-full max-w-4xl bg-base-100/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden glass-effect border border-base-content/10">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 relative order-2 lg:order-1">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-base-content/60">
                Join Streamify and start your journey
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="alert alert-error shadow-sm text-sm py-3 rounded-lg">
                  {/* Assuming error object structure based on previous code */}
                  {error.response?.data?.message ||
                    error.message ||
                    "Signup failed"}
                </div>
              )}

              <div className="space-y-5">
                <div className="form-control">
                  <label className="label pl-1">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 bg-base-200/50 hover:bg-base-200 focus-within:bg-base-100 transition-colors">
                    <User className="size-5 text-base-content/40" />
                    <input
                      type="text"
                      className="grow"
                      placeholder="Ramesh Sharma"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label pl-1">
                    <span className="label-text font-medium">
                      Email Address
                    </span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 bg-base-200/50 hover:bg-base-200 focus-within:bg-base-100 transition-colors">
                    <Mail className="size-5 text-base-content/40" />
                    <input
                      type="email"
                      className="grow"
                      placeholder="ramesh@gmail.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label pl-1">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 bg-base-200/50 hover:bg-base-200 focus-within:bg-base-100 transition-colors">
                    <Lock className="size-5 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="grow"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </label>
                  <div className="label pb-0">
                    <span className="label-text-alt text-base-content/50">
                      Must be at least 6 characters
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full shadow-lg hover:shadow-primary/30 transition-all duration-300"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-base-content/60">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="link link-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Hero / Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary/10 to-primary/10 items-center justify-center p-12 relative group order-1 lg:order-2">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-base-100/50 backdrop-blur-md shadow-lg mb-4 ring-1 ring-base-content/5 group-hover:scale-105 transition-transform duration-500">
              <MessageSquare className="size-16 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
              Join the Community
            </h1>
            <p className="text-base-content/70 text-lg leading-relaxed">
              Connect with 1000+ happy users and start building meaningful
              connections today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
