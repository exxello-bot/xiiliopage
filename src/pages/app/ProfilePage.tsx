import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User, Mail, Shield } from "lucide-react";
import type { User as AuthUser } from "@supabase/supabase-js";

const ProfilePage = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const displayName = user?.user_metadata?.full_name || "User";
  const email = user?.email || "";

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-body mb-1">Account</p>
        <h1 className="font-display text-3xl text-foreground">Profile</h1>
      </div>

      <Card className="p-5 border-border mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-display text-lg text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" /> {email}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 border-border mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display text-base text-foreground">App Info</h3>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Xiilio AI — Digital Growth Platform</p>
          <p>Version 1.0.0</p>
        </div>
      </Card>

      <Button
        variant="destructive"
        className="w-full min-h-[44px]"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default ProfilePage;
