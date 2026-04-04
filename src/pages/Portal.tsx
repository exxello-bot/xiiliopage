import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, Clock } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  company: string | null;
  message: string;
  status: string;
  stage: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  qualified: "bg-green-500/20 text-green-400 border-green-500/30",
  proposal_sent: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  won: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
};

const Portal = () => {
  const { user, loading, signOut } = useCustomerAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("contact_submissions")
        .select("id, name, company, message, status, stage, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (data) setSubmissions(data);
      setFetching(false);
    };
    fetch();
  }, [user]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display text-foreground">My Inquiries</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {submissions.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground">No inquiries yet</h2>
            <p className="text-muted-foreground mt-1">
              Submit a contact form on our website to get started.
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Go to Website
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <Card
                key={s.id}
                className="border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/portal/inquiry/${s.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-foreground">{s.company || "General Inquiry"}</CardTitle>
                    <Badge className={statusColors[s.status] || "bg-muted text-muted-foreground"}>
                      {s.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                    <span>Stage: {s.stage}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portal;
