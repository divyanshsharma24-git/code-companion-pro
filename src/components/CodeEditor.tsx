import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Code2, Loader2, Sparkles } from "lucide-react";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go",
  "Rust", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML/CSS", "Other",
];

interface CodeEditorProps {
  code: string;
  language: string;
  loading: boolean;
  onCodeChange: (val: string) => void;
  onLanguageChange: (val: string) => void;
  onSubmit: () => void;
}

const CodeEditor = ({
  code,
  language,
  loading,
  onCodeChange,
  onLanguageChange,
  onSubmit,
}: CodeEditorProps) => {
  return (
    <div className="card-glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Code Input</h2>
        </div>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang.toLowerCase()}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your code here for review..."
        className="min-h-[320px] font-mono text-sm bg-muted/50 border-border resize-y leading-relaxed"
        spellCheck={false}
      />

      <Button
        onClick={onSubmit}
        disabled={loading || !code.trim()}
        className="w-full glow-primary font-semibold text-base h-12"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Code...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Review Code
          </>
        )}
      </Button>
    </div>
  );
};

export default CodeEditor;
