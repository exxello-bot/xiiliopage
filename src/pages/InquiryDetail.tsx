import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import StatusTracker from "@/components/portal/StatusTracker";
import MessageThread from "@/components/portal/MessageThread";

interface Submission {
  id: string;
  name: string;
  email: string;
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

const InquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useCustomerAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("contact_submissions")
        .select("id, name, email, company, message, status, stage, created_at, updated_at")
        .eq("id", id)
        .maybeSingle();
      setSubmission(data);
      setFetching(false);
    };
    fetch();
  }, [user, id]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground">Inquiry not found</p>
          <Button className="mt-4" onClick={() => navigate("/portal")}>Back to Portal</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/portal")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inquiries
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Status Tracker */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <StatusTracker currentStage={submission.stage} />
          </CardContent>
        </Card>

        {/* Submission Details */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">
                {submission.company || "General Inquiry"}
              </CardTitle>
              <Badge className={statusColors[submission.status] || "bg-muted text-muted-foreground"}>
                {submission.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Submitted by</p>
              <p className="text-sm text-foreground">{submission.name} ({submission.email})</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Original Message</p>
              <p className="text-sm text-foreground bg-secondary rounded-lg p-3">{submission.message}</p>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Submitted: {new Date(submission.created_at).toLocaleDateString()}</span>
              <span>Last updated: {new Date(submission.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MessageThread submissionId={submission.id} senderRole="customer" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InquiryDetail;
