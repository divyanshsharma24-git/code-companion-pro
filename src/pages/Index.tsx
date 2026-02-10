import { useState } from "react";
import { toast } from "sonner";
import { Bot, Code2, Shield, Zap, CheckCircle2, Send } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import ReviewDashboard from "@/components/ReviewDashboard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setReview(null);

    try {
      const { data, error } = await supabase.functions.invoke("review-code", {
        body: { code, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setReview(data);
      toast.success("Code analysis complete!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Security Checks",
      description: "Detects vulnerabilities and unsafe patterns.",
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Performance Tuning",
      description: "Identifies bottlenecks and optimization opportunities.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: "Code Style",
      description: "Ensures consistency and adherence to best practices.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              CodeReview<span className="text-primary">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReview(null);
                setCode("");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Bot className="w-4 h-4" />
              New Review
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        {!review ? (
          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground">
                <Bot className="w-4 h-4 text-primary" />
                AI-Powered Code Analysis
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
                Elevate your code quality
                <br />
                <span className="gradient-text">in seconds.</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
                Paste your snippet below. Our advanced AI will analyze it for performance,
                security, and best practices, giving you actionable feedback instantly.
              </p>
            </div>

            {/* Code Editor */}
            <div className="max-w-3xl mx-auto">
              <CodeEditor
                code={code}
                language={language}
                loading={loading}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onSubmit={handleReview}
              />
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="text-center space-y-2 p-4"
                >
                  <div className="flex justify-center mb-2">{f.icon}</div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ReviewDashboard review={review} code={code} language={language} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container max-w-5xl mx-auto px-4 text-center text-xs text-muted-foreground leading-relaxed">
          Made by Divyansh Sharma · Department of Artificial Intelligence and Data Science Engineering (AIDSE) · IIT Jodhpur
        </div>
      </footer>
    </div>
  );
};

export default Index;
