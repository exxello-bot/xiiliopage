import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  assigned_to: string | null;
  created_at: string;
  message: string;
  notes: string | null;
}

interface LeadTableProps {
  leads: Lead[];
  onUpdate: (id: string, field: string, value: string | number) => void;
  onSelect: (lead: Lead) => void;
}

const statusColor = (s: string) => {
  const map: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    contacted: "bg-yellow-500/20 text-yellow-400",
    qualified: "bg-green-500/20 text-green-400",
    proposal_sent: "bg-purple-500/20 text-purple-400",
    won: "bg-emerald-500/20 text-emerald-400",
    lost: "bg-red-500/20 text-red-400",
  };
  return map[s] || "bg-muted text-muted-foreground";
};

const LeadTable = ({ leads, onUpdate, onSelect }: LeadTableProps) => {
  const [search, setSearch] = useState("");

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, email, or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-secondary border-border text-foreground"
      />
      <div className="rounded-lg border border-border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Company</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Score</TableHead>
              <TableHead className="text-muted-foreground">Stage</TableHead>
              <TableHead className="text-muted-foreground">Assigned</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow
                key={lead.id}
                className="border-border cursor-pointer hover:bg-secondary/50"
                onClick={() => onSelect(lead)}
              >
                <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                <TableCell className="text-muted-foreground">{lead.company || "—"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={lead.status} onValueChange={(v) => onUpdate(lead.id, "status", v)}>
                    <SelectTrigger className="w-[130px] h-7 border-0 bg-transparent p-0">
                      <Badge className={statusColor(lead.status)}>
                        {lead.status.replace("_", " ")}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-foreground">{lead.score}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={lead.stage} onValueChange={(v) => onUpdate(lead.id, "stage", v)}>
                    <SelectTrigger className="w-[120px] h-7 border-0 bg-transparent p-0 text-muted-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.assigned_to || "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadTable;
