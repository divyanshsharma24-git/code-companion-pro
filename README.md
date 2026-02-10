## Code Companion Pro — AI Code Review Assistant

Code Companion Pro is an AI-powered developer assistant that reviews source code and generates structured engineering feedback. The application evaluates readability, performance, security, maintainability, complexity, and best practices, then provides actionable improvement suggestions through an interactive dashboard.

This project demonstrates how large language models can be integrated into developer-tool workflows using serverless architecture and modern web interfaces.

---

## Author

Divyansh Sharma, 
Department of Artificial Intelligence and Data Science Engineering (AIDSE),
IIT Jodhpur

GitHub: [https://github.com/divyanshsharma24-git](https://github.com/divyanshsharma24-git)
LinkedIn: [https://www.linkedin.com/in/divyansh-sharma-a92889340](https://www.linkedin.com/in/divyansh-sharma-a92889340)

---

## Live Demo

[https://code-companion-pro.vercel.app/](https://code-companion-pro.vercel.app/)

---

## Overview

Code Companion Pro simulates an automated pull-request review assistant. Users can paste a code snippet, choose a programming language, and receive structured AI feedback with a quality score and improvement suggestions.

The application is designed to resemble lightweight engineering productivity tools used in modern development teams.

---

## Features

* AI-powered code review
* Programming language selection
* Code quality score visualization
* Readability analysis
* Performance analysis
* Security feedback
* Maintainability evaluation
* Complexity assessment
* Best-practice recommendations
* Actionable suggestions panel
* Animated dashboard UI
* Serverless AI integration

---

## System Architecture

Frontend (Vercel deployment)
→ Supabase Edge Function
→ Groq LLM API
→ Structured JSON review
→ Dashboard rendering

This architecture separates the UI layer, backend logic, and AI inference system.

---

## Tech Stack

Frontend:

* Vite
* JavaScript
* CSS

Backend:

* Supabase Edge Functions (Deno)

AI Integration:

* Groq API (Llama-3 model)

Deployment:

* Vercel
* Supabase

---

## How It Works

The application follows a structured analysis pipeline:

1. User submits code snippet
2. Edge function receives request
3. Prompt builder generates review instructions
4. Groq LLM analyzes the code
5. Structured JSON response is returned
6. Dashboard displays results

This workflow mirrors simplified automated code-review systems used in software engineering pipelines.

---

## Environment Variables

Set the following variable in Supabase:

GROQ_API_KEY=your_api_key

The API key is only used in serverless functions and never exposed to the frontend.

---

## Learning Outcomes

This project demonstrates:

* LLM integration into developer tooling
* prompt engineering for structured AI output
* serverless backend design
* AI-assisted code analysis workflows
* dashboard-style UI systems
* modern deployment pipelines

---

## Portfolio Context

Code Companion Pro is part of a portfolio roadmap focused on:

* AI / ML systems
* developer productivity tools
* full-stack engineering
* data pipeline design

This project highlights the integration of AI systems into real software products.

---

## License

MIT License
