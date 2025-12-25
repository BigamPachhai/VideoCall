import { useState } from "react";
import { Link } from "react-router"; // Fixed import
import useLogin from "../hooks/useLogin";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
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
        {/* Left Side - Hero / Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10 items-center justify-center p-12 relative group">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex p-4 rounded-2xl bg-base-100/50 backdrop-blur-md shadow-lg mb-4 ring-1 ring-base-content/5 group-hover:scale-105 transition-transform duration-500">
              <MessageSquare className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Streamify
            </h1>
            <p className="text-base-content/70 text-lg leading-relaxed">
              Experience crystal clear video calls and seamless messaging with
              friends worldwide.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 relative">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-base-content/60">
                Sign in to continue your conversations
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="alert alert-error shadow-sm text-sm py-3 rounded-lg">
                  {/* Assuming error object structure based on previous code */}
                  {error.response?.data?.message ||
                    error.message ||
                    "Login failed"}
                </div>
              )}

              <div className="space-y-5">
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
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
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
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
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
                  <label className="label">
                    <Link
                      to="/forgot-password"
                      className="label-text-alt link link-hover hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </label>
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm text-base-content/60">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="link link-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
