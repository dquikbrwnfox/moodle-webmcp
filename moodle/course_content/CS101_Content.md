# CS 101: Agentic Web Development & WebMCP Standards

## Course Overview
- **Course Code**: CS 101
- **Term**: Fall 2026
- **Instructor**: Dr. Evelyn Vance (e.vance@apex.edu)
- **Credits**: 4.0 Units
- **Prerequisites**: Web Fundamentals (HTML/JS) or equivalent programming experience

---

## 📌 Section 1: Foundations of Agentic Web Protocols

### Reading 1: The Evolution from Passive DOM to Model Context Protocol
**Summary**: Traditional web applications were engineered exclusively for human visual navigation. As AI agents evolve into primary web actors, relying on heuristic DOM scraping and screenshot vision introduces latency, brittleness, and security risks. The emerging W3C Web Model Context Protocol (WebMCP) introduces a declarative browser standard (`document.modelContext.registerTool`) allowing websites to expose structured, typed APIs directly to browser-embedded AI models.

### Key Concepts:
- **Client-Side Tool Registration**: How web pages declare tools using JSON Schema input definitions.
- **Zero-Token Session Inheritance**: How in-browser agent tools leverage active HTTP-only session cookies and CSRF tokens without raw API key exposure.
- **Comparison**: Backend MCP (stdio/SSE over external daemons) vs. In-Browser WebMCP (same-origin DOM execution).

---

## 📌 Section 2: Implementing WebMCP in Web Applications

### Lecture Notes: The `document.modelContext.registerTool` Specification
```javascript
document.modelContext.registerTool({
  name: "get_upcoming_deadlines",
  description: "Get all pending assignment deadlines sorted chronologically.",
  inputSchema: {
    type: "object",
    properties: {
      days_ahead: { type: "number", description: "Number of days ahead to look (default: 14)" }
    }
  },
  execute: async (args) => {
    // In-browser execution handler accessing active session state
    const response = await fetch('/api/deadlines?days=' + (args.days_ahead || 14));
    return await response.json();
  }
});
```

---

## 📝 Assignment 1: Evaluating Autonomous Agent Boundaries

- **Due Date**: September 2, 2026 at 11:59 PM PT
- **Total Points**: 100 Points
- **Submission Type**: Text Entry / PDF Upload

### Assignment Prompt:
Write a 1,200 to 1,500-word critical analysis evaluating autonomous tool execution by LLMs in web browsers. Your paper must:
1. **Philosophical Foundations**: Contrast Utilitarian efficiency gains with Deontological duties of informed consent.
2. **Technical Architecture**: Explain how client-side WebMCP execution differs from backend daemon architectures.
3. **Threat Modeling**: Address indirect prompt injection vectors on untrusted websites.
4. **Governance Proposal**: Propose an actionable human-in-the-loop confirmation boundary for high-consequence write actions vs. low-consequence read queries.

### Grading Rubric (100 Points Total)

| Criterion | Weight | Exemplary (100%) | Proficient (80%) | Developing (50%) | Unacceptable (0%) |
|---|---|---|---|---|---|
| **Ethical Framework Application** | 35 pts | Rigorous, nuanced comparison of 2+ frameworks (Utilitarianism vs Deontology) applied to agent autonomy. | Accurate comparison with clear relevance; minor gaps in synthesis. | Mentions frameworks superficially without deep analytical contrast. | No philosophical frameworks utilized. |
| **Technical Depth & WebMCP** | 35 pts | Detailed technical explanation of `document.modelContext`, client-side boundaries, and prompt injection vectors. | Solid explanation of agent mechanics with basic security considerations. | Vague or partially inaccurate description of agent capabilities. | Major technical misconceptions. |
| **Governance & Confirmation Gates** | 20 pts | Specific, actionable multi-tier confirmation mechanism balancing safety and speed. | Reasonable governance proposal with clear confirmation boundaries. | Generic proposal lacking operational specifics. | Missing governance recommendation. |
| **Clarity, Structure & Citations** | 10 pts | Impeccable academic prose, clear structural headings, proper APA citations. | Clear and readable with minor stylistic flaws. | Disorganized sections or informal tone. | Unstructured or missing citations. |

---

## 💬 Discussion Forum: Week 4 Prompt

**Topic**: *Where should the human confirmation gate sit in browser-agent workflows?*  
**Prompt**: In your view, should browser-agent systems require explicit human confirmation for financial or submission actions, or can confidence scoring automate them safely?

