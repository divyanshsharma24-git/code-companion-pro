import { AlertTriangle, AlertCircle, Info, Wrench } from "lucide-react";

interface Fix {
  issue: string;
  severity: "critical" | "warning" | "info";
  fix: string;
}

interface FixSuggestionsProps {
  fixes: Fix[];
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/20",
    label: "Critical",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    label: "Warning",
  },
  info: {
    icon: Info,
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
    label: "Info",
  },
};

const FixSuggestions = ({ fixes }: FixSuggestionsProps) => {
  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="card-glass rounded-xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center gap-2">
        <Wrench className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Suggested Fixes</h2>
      </div>
      <div className="space-y-3">
        {fixes.map((fix, i) => {
          const config = severityConfig[fix.severity] || severityConfig.info;
          const Icon = config.icon;
          return (
            <div key={i} className={`rounded-lg border ${config.border} ${config.bg} p-4 space-y-2`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.text}`} />
                <span className={`text-xs font-mono font-semibold uppercase ${config.text}`}>{config.label}</span>
                <span className="text-sm font-medium text-foreground">{fix.issue}</span>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed pl-6 font-mono whitespace-pre-wrap">
                {fix.fix}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FixSuggestions;
