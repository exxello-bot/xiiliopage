import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Building2, ChevronRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Submission {
  id: string;
  name: string;
  company: string | null;
  message: string;
  status: string;
  stage: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  qualified: "bg-green-500/20 text-green-400",
  closed: "bg-muted text-muted-foreground",
};

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchSubmissions = async () => {
      const { data } = await supabase
        .from("contact_submissions")
        .select("id, name, company, message, status, stage, created_at")
        .eq("email", user.email!)
        .order("created_at", { ascending: false });
      setSubmissions(data ?? []);
      setLoading(false);
    };
    fetchSubmissions();
  }, [user]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-body mb-1">Welcome back</p>
        <h1 className="font-display text-3xl text-foreground">{displayName}</h1>
      </div>

      <h2 className="font-display text-lg text-foreground mb-3">Your Inquiries</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <Card className="p-6 text-center border-border">
          <p className="text-muted-foreground text-sm mb-3">No inquiries yet</p>
          <button
            onClick={() => navigate("/services")}
            className="text-primary text-sm font-medium"
          >
            Explore our services →
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card
              key={sub.id}
              className="p-4 border-border active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => navigate(`/inquiry/${sub.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {sub.company && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="w-3 h-3" /> {sub.company}
                    </span>
                  )}
                </div>
                <Badge className={statusColors[sub.status] || statusColors.new} variant="secondary">
                  {sub.status}
                </Badge>
              </div>
              <p className="text-sm text-foreground line-clamp-2 mb-2">{sub.message}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
