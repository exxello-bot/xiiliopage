import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageThread from "@/components/portal/MessageThread";

const STATUSES = ["new", "contacted", "qualified", "proposal_sent", "won", "lost"];
const STAGES = ["inbox", "discovery", "demo", "negotiation", "closed"];

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  score: number;
  stage: string;
  notes: string | null;
  assigned_to: string | null;
  message: string;
  created_at: string;
}

interface LeadDetailProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, field: string, value: string | number) => void;
}

const LeadDetail = ({ lead, open, onClose, onUpdate }: LeadDetailProps) => {
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      setAssignedTo(lead.assigned_to || "");
      setScore(lead.score);
    }
  }, [lead]);

  if (!lead) return null;

  const saveField = (field: string, value: string | number) => {
    onUpdate(lead.id, field, value);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">{lead.name}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <p className="text-sm text-muted-foreground">{lead.company || "No company"}</p>
              <p className="text-xs text-muted-foreground">
                Submitted {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Original Message */}
            <div className="space-y-2">
              <Label className="text-foreground">Original Message</Label>
              <div className="p-3 rounded-lg bg-secondary text-sm text-foreground">
                {lead.message}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-foreground">Status</Label>
              <Select value={lead.status} onValueChange={(v) => saveField("status", v)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stage */}
            <div className="space-y-2">
              <Label className="text-foreground">Stage</Label>
              <Select value={lead.stage} onValueChange={(v) => saveField("stage", v)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <Label className="text-foreground">Lead Score: {score}</Label>
              <Slider
                value={[score]}
                onValueChange={([v]) => setScore(v)}
                onValueCommit={([v]) => saveField("score", v)}
                max={100}
                step={5}
                className="py-2"
              />
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
              <Label className="text-foreground">Assigned To</Label>
              <Input
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                onBlur={() => saveField("assigned_to", assignedTo)}
                className="bg-secondary border-border text-foreground"
                placeholder="Team member name"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-foreground">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-secondary border-border text-foreground min-h-[100px]"
                placeholder="Internal notes..."
              />
              <Button
                size="sm"
                onClick={() => saveField("notes", notes)}
              >
                Save Notes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <MessageThread submissionId={lead.id} senderRole="admin" />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetail;
