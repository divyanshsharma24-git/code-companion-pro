import { useState } from "react";
import { toast } from "sonner";
import { Bot, Github } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                AI Code Reviewer
              </h1>
              <p className="text-xs text-muted-foreground">
                by Divyansh Sharma · IIT Jodhpur
              </p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">
            Intelligent Code Analysis
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste your code below and get professional-grade feedback on readability,
            performance, security, and more — powered by AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div>
            <CodeEditor
              code={code}
              language={language}
              loading={loading}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onSubmit={handleReview}
            />
          </div>

          {/* Right: Dashboard */}
          <div>
            {review ? (
              <ReviewDashboard review={review} />
            ) : (
              <div className="card-glass rounded-xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Review Yet
                </h3>
                <p className="text-sm text-muted-foreground/70 max-w-xs">
                  Paste your code on the left and click "Review Code" to get
                  AI-powered analysis and suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          Built with AI · Department of AIDSE · IIT Jodhpur
        </div>
      </footer>
    </div>
  );
};

export default Index;
