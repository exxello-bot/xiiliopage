import { Check } from "lucide-react";

const STAGES = ["inbox", "discovery", "demo", "negotiation", "closed"];
const STAGE_LABELS: Record<string, string> = {
  inbox: "Inbox",
  discovery: "Discovery",
  demo: "Demo",
  negotiation: "Negotiation",
  closed: "Closed",
};

interface StatusTrackerProps {
  currentStage: string;
}

const StatusTracker = ({ currentStage }: StatusTrackerProps) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="flex items-center justify-between w-full">
      {STAGES.map((stage, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 border-2 border-primary text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs mt-1 ${isCurrent ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < currentIndex ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusTracker;
