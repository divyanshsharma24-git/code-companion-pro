import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language } = await req.json();

    if (!code || !code.trim()) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    const systemPrompt = `You are a senior software engineer performing a thorough pull-request code review. Analyze the provided code and return a JSON object with EXACTLY this structure (no markdown, no code fences, just raw JSON):

{
  "score": <number 0-100>,
  "readability": {
    "rating": "<Excellent|Good|Fair|Poor>",
    "details": "<2-3 sentence analysis>"
  },
  "performance": {
    "rating": "<Excellent|Good|Fair|Poor>",
    "details": "<2-3 sentence analysis>"
  },
  "security": {
    "rating": "<Excellent|Good|Fair|Poor>",
    "details": "<2-3 sentence analysis>"
  },
  "maintainability": {
    "rating": "<Excellent|Good|Fair|Poor>",
    "details": "<2-3 sentence analysis>"
  },
  "complexity": {
    "rating": "<Low|Medium|High|Very High>",
    "details": "<2-3 sentence analysis>"
  },
  "bestPractices": {
    "rating": "<Excellent|Good|Fair|Poor>",
    "details": "<2-3 sentence analysis>"
  },
  "suggestions": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "fixes": [
    {
      "issue": "<brief issue description>",
      "severity": "<critical|warning|info>",
      "fix": "<concrete code fix or improvement with explanation>"
    }
  ]
}

Be constructive, specific, and professional. Focus on actionable feedback. In the "fixes" array, provide concrete code-level fixes for any issues found, with severity levels. Always provide at least 2-3 fixes.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Review this ${language || "code"} code:\n\n${code}` },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let review;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      review = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response as JSON:", content);
      review = {
        score: 50,
        readability: { rating: "Fair", details: "Unable to fully parse AI analysis." },
        performance: { rating: "Fair", details: "Performance analysis unavailable." },
        security: { rating: "Fair", details: "Security analysis unavailable." },
        maintainability: { rating: "Fair", details: "Maintainability analysis unavailable." },
        complexity: { rating: "Medium", details: "Complexity analysis unavailable." },
        bestPractices: { rating: "Fair", details: "Best practices analysis unavailable." },
        suggestions: ["Consider adding more comments", "Review error handling", "Add input validation"],
        fixes: [],
      };
    }

    return new Response(JSON.stringify(review), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Review error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
