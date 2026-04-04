import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Star, TrendingUp } from "lucide-react";

interface Lead {
  status: string;
  created_at: string;
}

interface LeadStatsProps {
  leads: Lead[];
}

const LeadStats = ({ leads }: LeadStatsProps) => {
  const total = leads.length;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = leads.filter(l => new Date(l.created_at) >= oneWeekAgo).length;
  const qualified = leads.filter(l => l.status === "qualified").length;
  const won = leads.filter(l => l.status === "won").length;
  const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const stats = [
    { label: "Total Leads", value: total, icon: Users },
    { label: "New This Week", value: newThisWeek, icon: UserPlus },
    { label: "Qualified", value: qualified, icon: Star },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadStats;
