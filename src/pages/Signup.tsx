import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + "/home",
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account, then log in.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background px-6 pt-[env(safe-area-inset-top)]">
      {/* Brand header */}
      <div className="flex flex-col items-center pt-16 pb-10">
        <h1 className="font-display text-5xl text-primary tracking-wider">XIILIO</h1>
        <p className="text-muted-foreground text-sm font-body mt-2">Digital Growth Platform</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col max-w-sm w-full mx-auto">
        <h2 className="font-display text-2xl text-foreground mb-6">Create account</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground text-sm">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary border-border text-foreground h-12 rounded-xl"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary border-border text-foreground h-12 rounded-xl"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary border-border text-foreground h-12 rounded-xl pr-12"
                placeholder="Min 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Continue as Guest →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
