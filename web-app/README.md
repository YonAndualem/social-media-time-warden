# 🔖 Social Media Time Warden

**Description:**  
Social Media Time Warden is a productivity and digital wellbeing tool designed for individuals who want to take control of their social media usage. It tracks time spent on popular platforms (Twitter/X, Facebook, Instagram, TikTok, YouTube, Snapchat), enforces daily limits, and provides real-time interventions (popups, snooze, or auto-close) when limits are exceeded. The project is built for hackathon participants, productivity enthusiasts, and anyone seeking healthier digital habits.

**Why it matters:**  
Social media overuse is a common challenge. By providing real-time feedback, analytics, and limit enforcement, this tool empowers users to make conscious choices about their online time, improving focus, wellbeing, and work-life balance.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Node.js + Express (MCP Server)
- **Database:** Supabase (PostgreSQL, Auth, RLS)
- **Browser Extension:** Manifest V3 (Chrome/Edge), JavaScript/TypeScript
- **APIs:** RESTful endpoints for usage, limits, and notifications
- **Other:** Postman (API design/testing), Vercel (optional deployment), GitHub Actions (CI/CD)

---

## 🧠 AI Integration Strategy

### Code Generation
- **IDE Copilot/CLI Agents:**  
  - Scaffold React components, Express routes, and extension scripts using AI-powered code completion.
  - Generate boilerplate for API endpoints, error handling, and data validation.
  - Use AI to quickly create utility functions, hooks, and context providers.

### Testing
- **Unit & Integration Tests:**  
  - Use AI prompts to generate Jest/React Testing Library tests for components and backend routes.
  - Ask AI to create edge-case tests and suggest mocking strategies for Supabase and browser APIs.
  - Review and refactor test coverage using AI-driven suggestions.

### Documentation
- **Docstrings & Inline Comments:**  
  - Use AI to generate and maintain clear docstrings for all exported functions and classes.
  - Prompt AI to summarize complex logic in comments, especially in extension scripts and backend validation.
  - Maintain this README and all API docs with AI-generated summaries and usage examples.

### Context-Aware Techniques
- **API Specs & File Trees:**  
  - Feed OpenAPI/Postman collections into AI to generate client code, test suites, and usage docs.
  - Use AI to analyze file trees and suggest refactors or modularization.
  - Paste git diffs or PRs into AI chat for review, changelog generation, and merge conflict resolution.

---

## 🚀 How to Use This Plan

- **Clone the repo and review this README for the project vision and workflow.**
- **Leverage AI tools at every stage:**  
  - For scaffolding, testing, and documentation, use your IDE’s Copilot or CLI agent.
  - Regularly update documentation and code comments with AI assistance.
  - Use AI to review and refactor as the project evolves.

---

**Let’s build a smarter, healthier relationship with social media—one line of code at a time!**