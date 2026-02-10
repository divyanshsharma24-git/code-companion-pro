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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
  ]
}

Be constructive, specific, and professional. Focus on actionable feedback.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Review this ${language || "code"} code:\n\n${code}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let review;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      review = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response as JSON:", content);
      // Fallback review
      review = {
        score: 50,
        readability: { rating: "Fair", details: "Unable to fully parse AI analysis. The code was received but structured analysis could not be generated." },
        performance: { rating: "Fair", details: "Performance analysis unavailable." },
        security: { rating: "Fair", details: "Security analysis unavailable." },
        maintainability: { rating: "Fair", details: "Maintainability analysis unavailable." },
        complexity: { rating: "Medium", details: "Complexity analysis unavailable." },
        bestPractices: { rating: "Fair", details: "Best practices analysis unavailable." },
        suggestions: ["Consider adding more comments", "Review error handling", "Add input validation"],
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
