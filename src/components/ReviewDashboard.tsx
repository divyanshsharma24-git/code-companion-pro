import {
  Eye,
  Zap,
  Shield,
  Wrench,
  GitBranch,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import ScoreRing from "./ScoreRing";
import AnalysisPanel from "./AnalysisPanel";
import FixSuggestions from "./FixSuggestions";
import CodeChatbot from "./CodeChatbot";

interface Review {
  score: number;
  readability: { rating: string; details: string };
  performance: { rating: string; details: string };
  security: { rating: string; details: string };
  maintainability: { rating: string; details: string };
  complexity: { rating: string; details: string };
  bestPractices: { rating: string; details: string };
  suggestions: string[];
  fixes?: { issue: string; severity: "critical" | "warning" | "info"; fix: string }[];
}

interface ReviewDashboardProps {
  review: Review;
  code: string;
  language: string;
}

const ReviewDashboard = ({ review, code, language }: ReviewDashboardProps) => {
  const panels = [
    { title: "Readability", icon: <Eye className="w-5 h-5" />, ...review.readability },
    { title: "Performance", icon: <Zap className="w-5 h-5" />, ...review.performance },
    { title: "Security", icon: <Shield className="w-5 h-5" />, ...review.security },
    { title: "Maintainability", icon: <Wrench className="w-5 h-5" />, ...review.maintainability },
    { title: "Complexity", icon: <GitBranch className="w-5 h-5" />, ...review.complexity },
    { title: "Best Practices", icon: <CheckCircle2 className="w-5 h-5" />, ...review.bestPractices },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Card */}
      <div className="card-glass rounded-xl p-6 flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground mb-2">Quality Score</h2>
        <ScoreRing score={review.score} />
      </div>

      {/* Analysis Panels */}
      <div className="space-y-3">
        {panels.map((panel, i) => (
          <AnalysisPanel
            key={panel.title}
            title={panel.title}
            icon={panel.icon}
            rating={panel.rating}
            details={panel.details}
            index={i}
          />
        ))}
      </div>

      {/* Suggested Fixes */}
      <FixSuggestions fixes={review.fixes || []} />

      {/* Suggestions */}
      {review.suggestions?.length > 0 && (
        <div
          className="card-glass rounded-xl p-6 space-y-4 animate-fade-in"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Suggestions</h2>
          </div>
          <ul className="space-y-3">
            {review.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-secondary-foreground">
                <span className="text-primary font-mono font-bold shrink-0">{i + 1}.</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Chatbot */}
      <CodeChatbot code={code} language={language} review={review} />
    </div>
  );
};

export default ReviewDashboard;
