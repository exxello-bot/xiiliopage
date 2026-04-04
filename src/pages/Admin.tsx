import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, LayoutGrid, Table as TableIcon, Sun, Moon, Download } from "lucide-react";
import { useTheme } from "next-themes";
import LeadStats from "@/components/admin/LeadStats";
import LeadTable from "@/components/admin/LeadTable";
import LeadPipeline from "@/components/admin/LeadPipeline";
import LeadDetail from "@/components/admin/LeadDetail";
import { toast } from "sonner";

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

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const { theme, setTheme } = useTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const exportCSV = () => {
    if (leads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    const headers = ["Name", "Email", "Company", "Status", "Score", "Stage", "Assigned To", "Notes", "Message", "Created At"];
    const rows = leads.map(l => [
      l.name, l.email, l.company || "", l.status, l.score, l.stage,
      l.assigned_to || "", (l.notes || "").replace(/"/g, '""'), l.message.replace(/"/g, '""'),
      new Date(l.created_at).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const fetchLeads = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load leads");
    } else {
      setLeads((data as Lead[]) || []);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchLeads();
  }, [isAdmin, fetchLeads]);

  const handleUpdate = async (id: string, field: string, value: string | number) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update lead");
      return;
    }

    setLeads(prev =>
      prev.map(l => l.id === id ? { ...l, [field]: value } : l)
    );

    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, [field]: value } : null);
    }

    toast.success("Lead updated");
  };

  const handleSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display text-foreground">Lead Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </header>

      <main className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <LeadStats leads={leads} />

        <Tabs defaultValue="pipeline">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="pipeline" className="gap-2">
              <LayoutGrid className="h-4 w-4" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <TableIcon className="h-4 w-4" /> Table
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="mt-4">
            <LeadPipeline leads={leads} onSelect={handleSelect} onUpdate={handleUpdate} />
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <LeadTable leads={leads} onUpdate={handleUpdate} onSelect={handleSelect} />
          </TabsContent>
        </Tabs>
      </main>

      <LeadDetail
        lead={selectedLead}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Admin;
