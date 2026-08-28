# AI 202: Advanced Agent Architectures & Tool Security

## Course Overview
- **Course Code**: AI 202
- **Term**: Fall 2026
- **Instructor**: Dr. Evelyn Vance (e.vance@apex.edu)
- **Credits**: 4.0 Units
- **Prerequisites**: CS 101 or equivalent AI/Web background

---

## 📌 Section 1: Threat Vectors in In-Browser Agents

### Reading 1: Indirect Prompt Injection in Web Browsing Workflows
**Summary**: When AI agents consume unstructured web content (such as comments, emails, or public forum posts), malicious actors can embed adversarial prompts designed to hijack the model's instruction following. In an agent with tool access, an injection could trigger unauthorized data exfiltration or unintended transactions.

### Key Defense Strategies:
- **Strict Separation of Privilege**: Separating low-trust content parsing from privileged tool execution.
- **Tainted Context Isolation**: Tracking data provenance before passing outputs into downstream tool invocations.
- **Human-in-the-Loop Verification**: Enforcing explicit user sign-off for state-mutating actions.

---

## 📝 Lab 2: Threat Modeling WebMCP Tools

- **Due Date**: September 5, 2026 at 11:59 PM PT
- **Total Points**: 100 Points

### Lab Prompt:
Conduct a comprehensive STRIDE threat model on a multi-tool WebMCP implementation (e.g. course querying, forum posting, grade review). Propose schema-level validations, capability restrictions, and an origin verification protocol.

### Grading Rubric (100 Points Total)

| Criterion | Weight | Exemplary (100%) | Proficient (80%) | Developing (50%) |
|---|---|---|---|---|
| **STRIDE Threat Modeling** | 40 pts | Comprehensive identification of Spoofing, Tampering, Repudiation, Info Disclosure, DoS, and Elevation of Privilege threats. | Covers major threat categories with minor edge case omissions. | Incomplete threat analysis. |
| **Defensive Architecture & Schemas** | 40 pts | Strict JSON Schema input sanitization, origin checking, and human confirmation workflows. | Solid defensive proposal with standard validation patterns. | Vague security recommendations. |
| **Experimental Verification** | 20 pts | Concrete test vectors and verification methodology. | Basic test cases provided. | Missing test vectors. |

---

## 💬 Discussion Forum: AI 202 Defense Strategies

**Topic**: *Defending Against Multi-Turn Poisoning Attacks in Web Environments*  
**Prompt**: How should client-side applications isolate third-party tool outputs to prevent multi-turn context drift?

