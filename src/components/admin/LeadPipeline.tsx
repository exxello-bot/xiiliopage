import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

const STAGES = ["inbox", "discovery", "demo", "negotiation", "closed"];

interface Lead {
  id: string;
  name: string;
  company: string | null;
  status: string;
  score: number;
  stage: string;
  email: string;
  message: string;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
}

interface LeadPipelineProps {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  onUpdate: (id: string, field: string, value: string | number) => void;
  messageCounts?: Record<string, number>;
}

const stageColors: Record<string, string> = {
  inbox: "border-blue-500/30",
  discovery: "border-yellow-500/30",
  demo: "border-purple-500/30",
  negotiation: "border-orange-500/30",
  closed: "border-emerald-500/30",
};

const LeadPipeline = ({ leads, onSelect, onUpdate }: LeadPipelineProps) => {
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) onUpdate(leadId, "stage", stage);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter(l => l.stage === stage);
        return (
          <div
            key={stage}
            className={`min-w-[250px] flex-1 rounded-lg border ${stageColors[stage] || "border-border"} bg-secondary/30 p-3`}
            onDrop={(e) => handleDrop(e, stage)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground capitalize">{stage}</h3>
              <Badge variant="secondary" className="text-xs">{stageLeads.length}</Badge>
            </div>
            <div className="space-y-2">
              {stageLeads.map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onClick={() => onSelect(lead)}
                  className="cursor-pointer border-border bg-card hover:bg-secondary/50 transition-colors"
                >
                  <CardContent className="p-3 space-y-1">
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.company || "No company"}</p>
                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {lead.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-primary font-medium">{lead.score}pts</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadPipeline;
