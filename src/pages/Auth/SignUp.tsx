import React, { useState } from "react";
import { Mail, Lock, UserPlus } from "lucide-react";

export default function SignUp() {
  const [formState, setFormState] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate user registration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Sign Up Successful!");
    setIsSubmitting(false);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-gray-400 mb-2">
              <UserPlus className="inline-block mr-2" /> Name
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="relative group">
            <label className="block text-gray-400 mb-2">
              <Mail className="inline-block mr-2" /> Email
            </label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative group">
            <label className="block text-gray-400 mb-2">
              <Lock className="inline-block mr-2" /> Password
            </label>
            <input
              type="password"
              required
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-2 text-white transition-all duration-300 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            <UserPlus className={isSubmitting ? "animate-ping" : ""} />
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex items-center justify-center my-4">
          <p className="text-gray-400">Or you can use</p>
        </div>
        <SignInWithGoogle />
        {/* <SignInWithGithub /> */}
        
      </div>

      <ToastContainer  />
    </div>
    

  );
}