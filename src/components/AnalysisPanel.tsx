import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AnalysisPanelProps {
  title: string;
  icon: React.ReactNode;
  rating: string;
  details: string;
  index: number;
}

const ratingColor = (rating: string) => {
  const r = rating.toLowerCase();
  if (r === "excellent" || r === "low") return "text-success";
  if (r === "good") return "text-info";
  if (r === "fair" || r === "medium") return "text-warning";
  return "text-destructive";
};

const ratingBg = (rating: string) => {
  const r = rating.toLowerCase();
  if (r === "excellent" || r === "low") return "bg-success/10";
  if (r === "good") return "bg-info/10";
  if (r === "fair" || r === "medium") return "bg-warning/10";
  return "bg-destructive/10";
};

const AnalysisPanel = ({ title, icon, rating, details, index }: AnalysisPanelProps) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="card-glass rounded-lg overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary">{icon}</span>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono font-medium px-2.5 py-0.5 rounded-full ${ratingBg(rating)} ${ratingColor(rating)}`}>
            {rating}
          </span>
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-secondary-foreground leading-relaxed border-t border-border pt-3">
          {details}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
